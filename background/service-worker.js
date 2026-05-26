'use strict';

// ── Job state ──────────────────────────────────────────────────────────────
let job = newJob();

function newJob() {
  return {
    status:     'idle',  // idle | estimating | awaiting_count | streaming | generating | done | error
    text:       '',
    mode:       'definitions',
    styled:     false,
    lang:       'auto',
    detail:     3,
    enhance:    false,
    tags:       [],
    min:        1,
    max:        15,
    count:      5,
    isFallback: false,
    cards:      [],
    errorMsg:   '',
    errorRaw:   '',
  };
}

// Connected popup ports
const ports = new Set();

// ── Persistence ───────────────────────────────────────────────────────────
let _stateRestored = false;

async function ensureStateRestored() {
  if (_stateRestored) return;
  _stateRestored = true;
  const data  = await chrome.storage.local.get({ saved_job: null });
  const saved = data.saved_job;
  if (saved && ['done', 'awaiting_count'].includes(saved.status) && saved.text) {
    job = { ...newJob(), ...saved };
  }
}

function saveJobState() {
  if (['done', 'awaiting_count'].includes(job.status)) {
    chrome.storage.local.set({ saved_job: { ...job } });
  } else {
    chrome.storage.local.remove('saved_job');
  }
}

// ── Session history ────────────────────────────────────────────────────────
const MAX_HISTORY = 7;

async function saveToHistory(j) {
  if (!j.cards?.length) return;
  const data     = await chrome.storage.local.get({ session_history: [] });
  const sessions = data.session_history || [];
  sessions.unshift({
    id:           Date.now(),
    timestamp:    Date.now(),
    mode:         j.mode,
    styled:       j.styled,
    detail:       j.detail,
    enhance:      j.enhance,
    text_preview: j.text.substring(0, 120),
    text:         j.text,
    cards:        j.cards,
  });
  if (sessions.length > MAX_HISTORY) sessions.length = MAX_HISTORY;
  await chrome.storage.local.set({ session_history: sessions });
}

// ── SW keepalive (alarm-based, one-shot pattern) ───────────────────────────
const KEEPALIVE_ALARM = 'sw-keepalive';
const KEEPALIVE_DELAY = 0.4; // minutes (~24s)

function startKeepalive() {
  chrome.alarms.create(KEEPALIVE_ALARM, { delayInMinutes: KEEPALIVE_DELAY });
}
function stopKeepalive() {
  chrome.alarms.clear(KEEPALIVE_ALARM);
}

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === KEEPALIVE_ALARM) {
    if (['estimating', 'generating', 'streaming'].includes(job.status)) {
      startKeepalive();
    }
  }
});

// ── Top-level event listeners ─────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ provider: null }, data => {
    if (data.provider === null) {
      chrome.storage.sync.set({
        provider:             'groq',
        groq_api_key:         '',
        groq_model:           'llama-3.3-70b-versatile',
        ollama_endpoint:      'http://localhost:11434',
        ollama_model:         'llama3.2:latest',
        openai_endpoint:      'https://api.openai.com',
        openai_api_key:       '',
        openai_model:         'gpt-4o-mini',
        anki_deck:            'Default',
        ui_language:          'ru',
        styled_text:          false,
        default_tags:         '',
        custom_prompt_suffix: '',
      });
    }
  });

  chrome.contextMenus.create({
    id:       'anki-clipper-generate',
    title:    'Создать карточки Anki',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId !== 'anki-clipper-generate') return;
  const text = (info.selectionText || '').trim();
  if (text.length < 10) return;

  const settings = await loadSettings();
  job = { ...newJob(), status: 'estimating', text, mode: 'definitions', styled: !!settings.styled_text };
  broadcast({ type: 'STATE', job });
  startKeepalive();

  try { await chrome.action.openPopup(); } catch (_) {}

  await runEstimation();
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name !== 'popup') return;
  ports.add(port);
  port.onDisconnect.addListener(() => ports.delete(port));
  port.onMessage.addListener(msg => handleMessage(port, msg));
});

chrome.notifications.onClicked.addListener(id => {
  chrome.notifications.clear(id);
  chrome.action.openPopup().catch(() => {});
});

// ── Message dispatch ──────────────────────────────────────────────────────
async function handleMessage(port, msg) {
  await ensureStateRestored();
  switch (msg.type) {
    case 'GET_STATE':
      port.postMessage({ type: 'STATE', job });
      break;

    case 'GET_HISTORY': {
      const data = await chrome.storage.local.get({ session_history: [] });
      port.postMessage({ type: 'HISTORY', sessions: data.session_history || [] });
      break;
    }

    case 'START_ESTIMATION': {
      const text = msg.text || '';
      if (text.length > 300_000) {
        job = { ...newJob(), status: 'error', text, errorMsg: 'Текст слишком длинный (максимум 300 000 символов). Сократите его перед анализом.', errorRaw: '' };
        broadcast({ type: 'STATE', job });
        return;
      }
      job = { ...newJob(), status: 'estimating', text, mode: msg.mode, styled: !!msg.styled };
      broadcast({ type: 'STATE', job });
      startKeepalive();
      await runEstimation();
      break;
    }

    case 'START_GENERATION': {
      const detail  = Number(msg.detail)  || 3;
      const enhance = !!msg.enhance;
      const tags    = Array.isArray(msg.tags) ? msg.tags : [];
      const lang    = msg.lang || 'auto';
      const styled  = msg.styled !== undefined ? !!msg.styled : job.styled;
      const count   = Number(msg.count)   || detailToCount(detail, job.min, job.max);
      job = { ...job, status: 'generating', count, detail, enhance, tags, lang, styled };
      broadcast({ type: 'STATE', job });
      startKeepalive();
      await runGeneration();
      break;
    }

    case 'SYNC_CARDS':
      if (job.status === 'done' && Array.isArray(msg.cards)) {
        job.cards = msg.cards;
        saveJobState();
      }
      break;

    case 'GENERATE_TAGS': {
      const settings    = await loadSettings();
      const tagText     = (msg.text || '').substring(0, 3000);
      const existingTags = msg.existingTags || [];
      try {
        const raw     = await callAI(settings, tagText, getTagsPrompt(existingTags));
        const cleaned = raw.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
        let tags;
        try {
          tags = JSON.parse(cleaned);
          if (!Array.isArray(tags)) throw new Error('not array');
        } catch (_) {
          const matches = cleaned.match(/"([^"]+)"/g);
          tags = matches ? matches.map(s => s.replace(/"/g, '').trim()) : [];
        }
        const cleanTags = tags
          .map(tag => String(tag).trim().toLowerCase().replace(/\s+/g, '-'))
          .filter(tag => tag.length > 0 && tag.length < 50);
        port.postMessage({ type: 'TAGS', tags: cleanTags, existingTags });
      } catch (err) {
        port.postMessage({ type: 'TAGS', tags: [], existingTags: [], error: err.message });
      }
      break;
    }

    case 'RESTORE_SESSION': {
      const data     = await chrome.storage.local.get({ session_history: [] });
      const sessions = data.session_history || [];
      const session  = sessions.find(s => s.id === msg.id);
      if (session) {
        job = {
          ...newJob(),
          status:  'done',
          text:    session.text || '',
          mode:    session.mode || 'definitions',
          styled:  !!session.styled,
          detail:  session.detail || 3,
          enhance: !!session.enhance,
          cards:   session.cards || [],
        };
        broadcast({ type: 'STATE', job });
      }
      break;
    }

    case 'CLEAR':
      job = newJob();
      stopKeepalive();
      chrome.storage.local.remove('saved_job');
      broadcast({ type: 'STATE', job });
      break;
  }
}

function broadcast(msg) {
  saveJobState();
  for (const p of ports) {
    try { p.postMessage(msg); } catch (_) {}
  }
}

// ── Estimation ────────────────────────────────────────────────────────────
async function runEstimation() {
  const settings = await loadSettings();
  try {
    const raw     = await callAI(settings, job.text, getEstimatePrompt(job.mode));
    const cleaned = raw.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();

    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (_) {
      const minM = cleaned.match(/"min"\s*:\s*(\d+)/);
      const maxM = cleaned.match(/"max"\s*:\s*(\d+)/);
      if (!minM || !maxM) throw new Error('no min/max');
      data = { min: Number(minM[1]), max: Number(maxM[1]) };
    }

    const min   = Math.max(1, Math.round(Number(data.min)) || 1);
    const max   = Math.max(min + 1, Math.round(Number(data.max)) || min + 5);
    const count = Math.round((min + max) / 2);

    job = { ...job, status: 'awaiting_count', min, max, count, isFallback: false };
    broadcast({ type: 'STATE', job });
  } catch (_) {
    job = { ...job, status: 'awaiting_count', min: 1, max: 15, count: 5, isFallback: true };
    broadcast({ type: 'STATE', job });
  }
  stopKeepalive();
}

// ── Generation ────────────────────────────────────────────────────────────
async function runGeneration() {
  const settings = await loadSettings();
  const prompt   = getPrompt(job.mode, job.count, job.styled, job.detail, job.enhance, settings.custom_prompt_suffix, job.lang);
  try {
    const cards = await streamGeneration(settings, job.text, prompt);
    job = { ...job, status: 'done', cards };
    broadcast({ type: 'STATE', job });
    await saveToHistory(job);
    stopKeepalive();

    if (ports.size === 0) {
      chrome.notifications.create('cards-ready', {
        type:               'basic',
        iconUrl:            chrome.runtime.getURL('icons/icon48.png'),
        title:              'Anki Clipper',
        message:            `Готово! ${cards.length} карточек. Нажмите, чтобы открыть.`,
        requireInteraction: true,
      });
    }
  } catch (err) {
    job = { ...job, status: 'error', errorMsg: err.message || String(err), errorRaw: err.raw || '' };
    broadcast({ type: 'STATE', job });
    stopKeepalive();

    if (ports.size === 0) {
      chrome.notifications.create('cards-error', {
        type:               'basic',
        iconUrl:            chrome.runtime.getURL('icons/icon48.png'),
        title:              'Anki Clipper — Ошибка',
        message:            String(err.message || 'Ошибка при генерации').substring(0, 200),
        requireInteraction: true,
      });
    }
  }
}

// ── Streaming generation with incremental card broadcast ──────────────────
async function streamGeneration(settings, text, systemPrompt) {
  let accumulated   = '';
  let lastCardCount = 0;

  function onChunk(chunk) {
    accumulated += chunk;
    const partial = extractCardPairs(accumulated);
    if (partial.length > lastCardCount) {
      lastCardCount = partial.length;
      const streamJob = { ...job, status: 'streaming', cards: partial };
      // Broadcast streaming state (don't persist streaming state)
      for (const p of ports) {
        try { p.postMessage({ type: 'STATE', job: streamJob }); } catch (_) {}
      }
    }
  }

  await streamAI(settings, text, systemPrompt, onChunk);
  return parseCards(accumulated);
}

// ── Settings ──────────────────────────────────────────────────────────────
function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.sync.get({
      provider:             'groq',
      groq_api_key:         '',
      groq_model:           'llama-3.3-70b-versatile',
      ollama_endpoint:      'http://localhost:11434',
      ollama_model:         'llama3.2:latest',
      openai_endpoint:      'https://api.openai.com',
      openai_api_key:       '',
      openai_model:         'gpt-4o-mini',
      anki_deck:            'Default',
      ui_language:          'ru',
      default_tags:         '',
      custom_prompt_suffix: '',
    }, resolve);
  });
}

// ── AI streaming ──────────────────────────────────────────────────────────
async function streamAI(settings, text, systemPrompt, onChunk) {
  switch (settings.provider) {
    case 'ollama': return streamOllama(settings, text, systemPrompt, onChunk);
    case 'openai': return streamOpenAI(settings, text, systemPrompt, onChunk);
    default:       return streamGroq(settings, text, systemPrompt, onChunk);
  }
}

// callAI accumulates stream into a string — used for estimation
async function callAI(settings, text, systemPrompt) {
  let result = '';
  await streamAI(settings, text, systemPrompt, chunk => { result += chunk; });
  return result;
}

// ── Groq streaming (SSE) ──────────────────────────────────────────────────
async function streamGroq(settings, text, systemPrompt, onChunk) {
  const apiKey = settings.groq_api_key || '';
  if (!apiKey) throw new Error('API-ключ Groq не задан. Откройте настройки и введите ключ.');
  const model = settings.groq_model || 'llama-3.3-70b-versatile';

  const resp = await fetchWithRetry('https://api.groq.com/openai/v1/chat/completions', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body:    JSON.stringify({
      model,
      messages:    [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }],
      temperature: 0.2,
      stream:      true,
    }),
  }, 'Groq');

  await readSSEStream(resp, onChunk);
}

// ── Ollama streaming (NDJSON) ─────────────────────────────────────────────
async function streamOllama(settings, text, systemPrompt, onChunk) {
  const endpoint = (settings.ollama_endpoint || 'http://localhost:11434').replace(/\/$/, '');
  const model    = settings.ollama_model || 'llama3.2:latest';

  let resp;
  try {
    resp = await fetch(`${endpoint}/api/chat`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        model,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }],
        stream:   true,
        options:  { temperature: 0.2 },
      }),
    });
  } catch (_) {
    throw new Error(`Не удалось подключиться к Ollama (${endpoint}). Убедитесь, что Ollama запущена.`);
  }

  if (!resp.ok) {
    const body = await resp.text();
    let msg;
    if (resp.status === 403) {
      msg = 'Ollama заблокировала запрос (403 Forbidden) — расширение не в списке разрешённых источников.\n\nРешение: задайте переменную OLLAMA_ORIGINS=* и перезапустите Ollama.';
    } else {
      msg = `Ollama вернула ошибку ${resp.status}: ${resp.statusText}`;
    }
    const e = new Error(msg); e.raw = body; throw e;
  }

  const reader  = resp.body.getReader();
  const decoder = new TextDecoder();
  let   buf     = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const obj     = JSON.parse(line);
        const content = obj.message?.content || '';
        if (content) onChunk(content);
        if (obj.done) return;
      } catch (_) {}
    }
  }
}

// ── OpenAI-compatible streaming (SSE) ────────────────────────────────────
async function streamOpenAI(settings, text, systemPrompt, onChunk) {
  const apiKey   = (settings.openai_api_key || '').trim();
  const endpoint = (settings.openai_endpoint || 'https://api.openai.com').replace(/\/$/, '');
  const model    = settings.openai_model || 'gpt-4o-mini';

  if (!apiKey) throw new Error('API-ключ OpenAI-совместимого провайдера не задан. Откройте настройки и введите ключ.');

  const resp = await fetchWithRetry(`${endpoint}/v1/chat/completions`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body:    JSON.stringify({
      model,
      messages:    [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }],
      temperature: 0.2,
      stream:      true,
    }),
  }, 'OpenAI');

  await readSSEStream(resp, onChunk);
}

// ── SSE stream reader (shared by Groq and OpenAI) ─────────────────────────
async function readSSEStream(resp, onChunk) {
  const reader  = resp.body.getReader();
  const decoder = new TextDecoder();
  let   buf     = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const chunk   = JSON.parse(data);
        const content = chunk.choices?.[0]?.delta?.content || '';
        if (content) onChunk(content);
      } catch (_) {}
    }
  }
}

// ── Fetch with retry on 429 ───────────────────────────────────────────────
async function fetchWithRetry(url, options, providerName = 'API', maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let resp;
    try {
      resp = await fetch(url, options);
    } catch (err) {
      if (attempt === maxRetries) throw new Error(`Не удалось подключиться к ${providerName}. Проверьте интернет-соединение.`);
      await sleep(2000 * (attempt + 1));
      continue;
    }

    if (resp.status === 429) {
      if (attempt === maxRetries) {
        const e = new Error(`${providerName}: превышен лимит запросов (429). Подождите немного и попробуйте ещё раз.`);
        e.raw = await resp.text().catch(() => '');
        throw e;
      }
      const retryAfter = Number(resp.headers.get('Retry-After') || '') || (10 * (attempt + 1));
      await sleep(Math.min(retryAfter, 30) * 1000);
      continue;
    }

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      const e    = new Error(`${providerName} API вернул ошибку ${resp.status}: ${resp.statusText}`);
      e.raw      = body;
      throw e;
    }

    return resp;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── JSON parsing ──────────────────────────────────────────────────────────
function unescapeJsonStr(s) {
  return s
    .replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r')
    .replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function extractCardPairs(text) {
  const frontMs = [...text.matchAll(/"front"\s*:\s*"((?:[^"\\]|\\.)*)"/gs)];
  const backMs  = [...text.matchAll(/"back"\s*:\s*"((?:[^"\\]|\\.)*)"/gs)];
  if (!frontMs.length || !backMs.length) return [];
  const fronts = frontMs.map(m => unescapeJsonStr(m[1]).trim());
  const backs  = backMs.map(m  => unescapeJsonStr(m[1]).trim());
  const count  = Math.min(fronts.length, backs.length);
  const result = [];
  for (let i = 0; i < count; i++) {
    if (fronts[i] && backs[i]) result.push({ front: fronts[i], back: backs[i] });
  }
  return result;
}

function filterCards(arr) {
  return arr
    .filter(c => c && typeof c === 'object')
    .map(c => ({ front: String(c.front || '').trim(), back: String(c.back || '').trim() }))
    .filter(c => c.front && c.back);
}

function parseCards(raw) {
  raw = raw.trim().replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cards = filterCards(parsed);
      if (cards.length > 0) return cards;
    }
  } catch (_) {}
  const extracted = extractCardPairs(raw);
  if (extracted.length > 0) return extracted;
  const e = new Error('AI вернул некорректный JSON. Смотрите необработанный ответ ниже.');
  e.raw   = raw;
  throw e;
}

// ── Detail level helpers ──────────────────────────────────────────────────
function detailToCount(detail, min, max) {
  const fraction = (Math.max(1, Math.min(5, detail)) - 1) / 4;
  return Math.max(1, Math.round(min + fraction * (max - min)));
}

// ── Prompts ───────────────────────────────────────────────────────────────
const PROMPT_DEFINITIONS = `You are a flashcard extraction assistant. Create definition-based flashcards.

FRONT of each card — must be exactly one of:
- A specific term, concept, or named entity the text defines or describes
- A function, method, class, command, or operator (for programming/technical texts)
- A formula, abbreviation, law, or principle name
- A key phrase that acts as a label for an idea the text explains

BACK of each card — strict rules:
- Write a COMPLETE, detailed definition synthesized from the ENTIRE text, not just the sentence where the term first appears.
- If the text elaborates on the concept across multiple places, gather and merge all of it.
- Cover: what it is, how it works, why it matters, conditions, edge cases, examples — everything the text says about it.
- Minimum 2–4 sentences. A single short sentence is unacceptable unless the concept is trivially simple.
- Preserve exact terminology, formulas, and numeric values verbatim from the source.
- The answer must read as the most complete definition the text offers — as if it were an excerpt synthesized from the full passage.

GENERAL:
- Output language must match the input text language.
- Extract every term, function, formula, abbreviation, and named concept worth memorizing.
- Return ONLY a raw JSON array — no markdown, no code fences, no text outside the JSON.
- Format: [{"front": "term", "back": "complete definition"}]
- If nothing useful, return [].`;

const PROMPT_QUESTIONS = `You are a flashcard extraction assistant. Create question-and-answer flashcards.

FRONT of each card — must be a specific, answerable question. Either:
- A question you formulate from key facts, processes, causes, effects, comparisons, steps, or principles in the text
- OR a question that appears verbatim or near-verbatim in the text itself
- Prefer deep questions: "How does X work?", "Why does X happen?", "What is the difference between X and Y?", "What happens when X?", "Under what conditions does X apply?"
- Avoid shallow "What is X?" questions unless the definition itself is the key takeaway.

BACK of each card — strict rules:
- Write a COMPLETE, detailed answer synthesized from the ENTIRE text — if multiple parts of the text contribute to the answer, merge them.
- Include: the direct answer plus context, mechanism, reason, consequence, or example that the text provides.
- Minimum 2–4 sentences. A single short sentence is unacceptable unless the answer is inherently brief.
- Preserve exact terminology, formulas, and numeric values verbatim from the source.

GENERAL:
- Output language must match the input text language.
- Generate a question for every distinct fact, process, comparison, cause-effect, step sequence, or principle in the text.
- Also include any questions explicitly posed in the text itself.
- Return ONLY a raw JSON array — no markdown, no code fences, no text outside the JSON.
- Format: [{"front": "specific question?", "back": "complete detailed answer"}]
- If nothing useful, return [].`;

const STYLED_FORMAT_INSTRUCTION = `

FORMATTING — BACK field only (use HTML, not markdown):
- Wrap inline code, variable names, commands, and function names in <code>text</code>
- Wrap multi-line code examples in <pre><code>block</code></pre>
- Wrap key defined terms in <b>term</b>
- Wrap caveats, notes, or warnings in <em>text</em>
- Wrap enumerated items or steps in <ul><li>item</li></ul>
- Wrap direct examples or quotations from the source in <blockquote>text</blockquote>
- Do NOT use markdown syntax (no **, no \`, no #)
- Do NOT add HTML attributes (write <code>, not <code class="...">)
- FRONT field must always be plain text — no HTML tags whatsoever`;

const DETAIL_PROMPTS = {
  1: `\n\nDETAIL LEVEL — VERY BRIEF: Override all length rules. Each BACK must be exactly 1 sentence — the single most essential fact or definition only. No examples, no mechanism, no context.`,
  2: `\n\nDETAIL LEVEL — BRIEF: Override the length rules above. Keep each BACK to 1–2 sentences — the core definition or direct answer only. Omit examples and elaborations.`,
  3: '',
  4: `\n\nDETAIL LEVEL — DETAILED: Expand each BACK thoroughly. Include examples, mechanisms, conditions, and edge cases from the text. Aim for 4–6 sentences per card where content supports it.`,
  5: `\n\nDETAIL LEVEL — VERY DETAILED: Make each BACK as comprehensive as the source text allows. Cover all aspects: definition, mechanism, examples, conditions, edge cases, comparisons, and practical implications. Aim for 6–10 sentences per card.`,
};

const ENHANCE_PROMPT = `\n\nAI ENHANCEMENT ENABLED: You may supplement each BACK with relevant knowledge from your training data that directly clarifies, contextualizes, or extends the source text. Add concrete examples, real-world applications, analogies, or important related facts where the source is brief. Integrate this additional knowledge naturally — do not label or separate it from the source content.`;

const LANG_INSTRUCTIONS = {
  ru: '\n\nOUTPUT LANGUAGE: Russian. Write ALL flashcard content (both front and back) in Russian only, regardless of the input text language.',
  en: '\n\nOUTPUT LANGUAGE: English. Write ALL flashcard content (both front and back) in English only, regardless of the input text language.',
};

function getPrompt(mode, count, styled = false, detail = 3, enhance = false, customSuffix = '', lang = 'auto') {
  const base = mode === 'questions' ? PROMPT_QUESTIONS : PROMPT_DEFINITIONS;
  let prompt = styled ? base + STYLED_FORMAT_INSTRUCTION : base;
  if (lang !== 'auto' && LANG_INSTRUCTIONS[lang]) prompt += LANG_INSTRUCTIONS[lang];
  if (DETAIL_PROMPTS[detail]) prompt += DETAIL_PROMPTS[detail];
  if (enhance) prompt += ENHANCE_PROMPT;
  if (customSuffix) prompt += `\n\nADDITIONAL INSTRUCTIONS: ${customSuffix}`;
  if (!count) return prompt;
  return prompt +
    `\n\nCRITICAL COUNT CONSTRAINT: Generate EXACTLY ${count} flashcards — no more, no less. ` +
    `Select the ${count} most valuable and informative cards from the text. ` +
    `If the text genuinely supports fewer, generate as many as possible.`;
}

function getTagsPrompt(existingTags) {
  const tagSection = existingTags.length > 0
    ? `Existing tags already in the Anki collection — PREFER these if relevant:\n${existingTags.slice(0, 100).join(', ')}\n\n`
    : 'No existing tags in the collection — suggest appropriate new ones.\n\n';
  return (
    `Suggest Anki flashcard tags for the text below.\n\n` +
    tagSection +
    `Rules:\n` +
    `- Prefer tags from the existing list when they match the text's topics\n` +
    `- Add new tags only when no existing tag covers an important topic\n` +
    `- Suggest 2–6 tags total, ordered by relevance (most relevant first)\n` +
    `- Tags must be lowercase; use hyphens instead of spaces (e.g. machine-learning)\n` +
    `- Return ONLY a raw JSON array, no markdown, no other text: ["tag1", "tag2"]`
  );
}

function getEstimatePrompt(mode) {
  const modeLabel = mode === 'questions'
    ? 'question-answer (specific questions about the text)'
    : 'definition (terms, functions, formulas, concepts)';
  return (
    `Count how many flashcards can be made from THIS TEXT ONLY in ${modeLabel} mode.\n\n` +
    `Return ONLY a raw JSON object — no markdown, no code fences, no extra text:\n` +
    `{"min": <number>, "max": <number>}\n\n` +
    `min = number of the most essential items the text EXPLICITLY states (core facts only, nothing marginal)\n` +
    `max = total number of DISTINCT items explicitly present in the text (full coverage, zero repetition)\n\n` +
    `STRICT RULES — text-only counting:\n` +
    `- Count ONLY what is directly and clearly stated in the text\n` +
    `- Do NOT count items you would invent, infer, or supply from your own knowledge\n` +
    `- Do NOT count implied concepts that the text does not actually explain\n` +
    `- Do NOT split one concept into multiple sub-cards just to inflate the number\n` +
    `- Treat near-identical facts as ONE card, not several\n` +
    `- If the text is short or sparse, the numbers must be small — do not pad\n` +
    `- Be conservative: it is better to undercount than to overcount\n` +
    `- min >= 1 if any useful content exists; max >= min`
  );
}
