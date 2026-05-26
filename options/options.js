'use strict';

// ── Translations ───────────────────────────────────────────────────────────
const OPT_STRINGS = {
  ru: {
    groq_custom_model:  'Другая модель...',
    page_subtitle:      'Настройки расширения',
    section_ai:         'AI-провайдер',
    section_lang:       'Язык интерфейса',
    section_advanced:   'Дополнительно',
    lbl_groq:           'Groq',
    lbl_ollama:         'Ollama',
    lbl_openai:         'OpenAI',
    lbl_groq_key:       'API-ключ Groq',
    lbl_openai_ep:      'Endpoint',
    lbl_openai_key:     'API-ключ',
    lbl_model:          'Модель',
    lbl_ollama_ep:      'Адрес Ollama',
    lbl_anki_deck:      'Название колоды',
    lbl_default_tags:   'Теги по умолчанию',
    lbl_custom_prompt:  'Дополнение к промпту',
    hint_groq_key:      'Получить ключ: console.groq.com → API Keys',
    hint_openai_ep:     'Совместим с OpenAI, OpenRouter, LM Studio, Jan и другими',
    hint_openai_model:  'Например: gpt-4o-mini, gpt-4o, claude-3-haiku, mistral-small',
    hint_anki_deck:     'Введите вручную или загрузите список из запущенной Anki',
    hint_default_tags:  'Добавляются ко всем карточкам (через пробел)',
    hint_custom_prompt: 'Добавляется в конец всех промптов генерации карточек',
    btn_load_decks:     '↓ Из Anki',
    btn_load_models:    '↓ Загрузить',
    btn_save:           'Сохранить настройки',
    save_ok:            'Настройки сохранены',
    decks_loaded:       n  => `Загружено колод: ${n}`,
    models_found:       n  => `Найдено моделей: ${n}`,
    err_anki:           'Не удалось подключиться к AnkiConnect. Убедитесь, что Anki запущена.',
    err_ollama:         ep => `Не удалось подключиться к Ollama (${ep}).`,
  },
  en: {
    groq_custom_model:  'Custom model...',
    page_subtitle:      'Extension settings',
    section_ai:         'AI provider',
    section_lang:       'Interface language',
    section_advanced:   'Advanced',
    lbl_groq:           'Groq',
    lbl_ollama:         'Ollama',
    lbl_openai:         'OpenAI',
    lbl_groq_key:       'Groq API key',
    lbl_openai_ep:      'Endpoint',
    lbl_openai_key:     'API key',
    lbl_model:          'Model',
    lbl_ollama_ep:      'Ollama address',
    lbl_anki_deck:      'Deck name',
    lbl_default_tags:   'Default tags',
    lbl_custom_prompt:  'Prompt addition',
    hint_groq_key:      'Get key: console.groq.com → API Keys',
    hint_openai_ep:     'Compatible with OpenAI, OpenRouter, LM Studio, Jan, and others',
    hint_openai_model:  'E.g.: gpt-4o-mini, gpt-4o, claude-3-haiku, mistral-small',
    hint_anki_deck:     'Enter manually or load the list from a running Anki',
    hint_default_tags:  'Added to all cards (space-separated)',
    hint_custom_prompt: 'Appended to all card generation prompts',
    btn_load_decks:     '↓ From Anki',
    btn_load_models:    '↓ Load',
    btn_save:           'Save settings',
    save_ok:            'Settings saved',
    decks_loaded:       n  => `Decks loaded: ${n}`,
    models_found:       n  => `Models found: ${n}`,
    err_anki:           'Could not connect to AnkiConnect. Make sure Anki is running.',
    err_ollama:         ep => `Could not connect to Ollama (${ep}).`,
  },
};

let ot = OPT_STRINGS.ru;

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (typeof ot[key] === 'string') el.textContent = ot[key];
  });
  const customOpt = $('groq-model-select')?.querySelector('option[value="__custom__"]');
  if (customOpt) customOpt.textContent = ot.groq_custom_model;
  updateGroqModelHint();
}

const DEFAULTS = {
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
};

const $ = id => document.getElementById(id);

// ── Groq model catalog ────────────────────────────────────────────────────
const GROQ_MODELS = [
  {
    id:   'llama-3.3-70b-versatile',
    hint: { ru: '128k контекст · Лучшее качество, рекомендуется ⭐', en: '128k context · Best quality, recommended ⭐' },
  },
  {
    id:   'llama-3.1-8b-instant',
    hint: { ru: '128k контекст · Быстрый, экономный', en: '128k context · Fast and economical' },
  },
  {
    id:   'gemma2-9b-it',
    hint: { ru: '8k контекст · Компактный и быстрый', en: '8k context · Compact and fast' },
  },
  {
    id:   'deepseek-r1-distill-llama-70b',
    hint: { ru: '64k контекст · Рассуждающая модель (reasoning)', en: '64k context · Reasoning model' },
  },
  {
    id:   'mixtral-8x7b-32768',
    hint: { ru: '32k контекст · Хорош для длинных текстов', en: '32k context · Good for long texts' },
  },
];

function buildGroqModelSelect() {
  const sel = $('groq-model-select');
  sel.innerHTML = '';
  GROQ_MODELS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.id;
    sel.appendChild(opt);
  });
  const custom = document.createElement('option');
  custom.value = '__custom__';
  custom.textContent = ot.groq_custom_model;
  sel.appendChild(custom);
}

function setGroqModel(modelId) {
  const known = GROQ_MODELS.find(m => m.id === modelId);
  const lang  = ot === OPT_STRINGS.en ? 'en' : 'ru';
  if (known) {
    $('groq-model-select').value = modelId;
    $('groq-model-custom').classList.add('hidden');
    $('groq-model-hint').textContent = known.hint[lang];
  } else {
    $('groq-model-select').value    = '__custom__';
    $('groq-model-custom').value    = modelId;
    $('groq-model-custom').classList.remove('hidden');
    $('groq-model-hint').textContent = '';
  }
  $('groq-model').value = modelId;
}

function updateGroqModelHint() {
  const val  = $('groq-model-select').value;
  const m    = GROQ_MODELS.find(m => m.id === val);
  const lang = ot === OPT_STRINGS.en ? 'en' : 'ru';
  $('groq-model-hint').textContent = m ? m.hint[lang] : '';
}

// ── Load ──────────────────────────────────────────────────────────────────
chrome.storage.sync.get(DEFAULTS, settings => {
  ot = OPT_STRINGS[settings.ui_language] || OPT_STRINGS.ru;
  buildGroqModelSelect();
  applyTranslations();

  $('radio-groq').checked   = settings.provider === 'groq';
  $('radio-ollama').checked = settings.provider === 'ollama';
  $('radio-openai').checked = settings.provider === 'openai';

  $('groq-key').value         = settings.groq_api_key;
  $('ollama-endpoint').value  = settings.ollama_endpoint;
  $('ollama-model').value     = settings.ollama_model;
  $('openai-endpoint').value  = settings.openai_endpoint;
  $('openai-key').value       = settings.openai_api_key;
  $('openai-model').value     = settings.openai_model;
  $('anki-deck').value        = settings.anki_deck;
  $('input-default-tags').value   = settings.default_tags;
  $('input-custom-prompt').value  = settings.custom_prompt_suffix;
  setGroqModel(settings.groq_model);

  $('radio-ru').checked = settings.ui_language === 'ru';
  $('radio-en').checked = settings.ui_language === 'en';

  updateProviderUI(settings.provider);
});

// ── Provider toggle ───────────────────────────────────────────────────────
document.querySelectorAll('input[name="provider"]').forEach(radio => {
  radio.addEventListener('change', () => updateProviderUI(radio.value));
});

function updateProviderUI(provider) {
  $('groq-fields').classList.toggle('hidden', provider !== 'groq');
  $('ollama-fields').classList.toggle('hidden', provider !== 'ollama');
  $('openai-fields').classList.toggle('hidden', provider !== 'openai');
}

// ── Groq model select ─────────────────────────────────────────────────────
$('groq-model-select').addEventListener('change', () => {
  const val  = $('groq-model-select').value;
  const lang = ot === OPT_STRINGS.en ? 'en' : 'ru';
  if (val === '__custom__') {
    $('groq-model-custom').classList.remove('hidden');
    $('groq-model').value            = $('groq-model-custom').value;
    $('groq-model-hint').textContent = '';
  } else {
    $('groq-model-custom').classList.add('hidden');
    $('groq-model').value            = val;
    const m = GROQ_MODELS.find(m => m.id === val);
    $('groq-model-hint').textContent = m ? m.hint[lang] : '';
  }
});

$('groq-model-custom').addEventListener('input', () => {
  $('groq-model').value = $('groq-model-custom').value.trim();
});

// ── Deck loader ──────────────────────────────────────────────────────────
$('btn-load-decks').addEventListener('click', async () => {
  const btn    = $('btn-load-decks');
  const sel    = $('deck-select');
  const status = $('deck-status');

  btn.disabled = true;
  btn.textContent = '...';
  status.className = 'status-line';
  status.textContent = '';

  try {
    const resp = await fetch('http://localhost:8765', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ action: 'deckNames', version: 6, params: {} }),
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);

    const decks   = [...(data.result || [])].sort((a, b) => a.localeCompare(b));
    const current = $('anki-deck').value;

    sel.innerHTML = '';
    decks.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name; opt.textContent = name;
      if (name === current) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.classList.remove('hidden');
    status.textContent = ot.decks_loaded(decks.length);
    status.className = 'status-line status-ok';
  } catch (_) {
    status.textContent = ot.err_anki;
    status.className = 'status-line status-err';
    sel.classList.add('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = ot.btn_load_decks;
  }
});

$('deck-select').addEventListener('change', () => {
  $('anki-deck').value = $('deck-select').value;
});

// ── Ollama model loader ───────────────────────────────────────────────────
$('btn-load-models').addEventListener('click', async () => {
  const btn      = $('btn-load-models');
  const sel      = $('model-select');
  const status   = $('model-status');
  const endpoint = ($('ollama-endpoint').value.trim() || 'http://localhost:11434').replace(/\/$/, '');

  btn.disabled = true;
  btn.textContent = '...';
  status.className = 'status-line';
  status.textContent = '';

  try {
    const resp = await fetch(`${endpoint}/api/tags`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    const models  = [...(data.models || [])].map(m => m.name).sort();
    const current = $('ollama-model').value;

    sel.innerHTML = '';
    models.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name; opt.textContent = name;
      if (name === current) opt.selected = true;
      sel.appendChild(opt);
    });

    sel.classList.remove('hidden');
    status.textContent = ot.models_found(models.length);
    status.className = 'status-line status-ok';
  } catch (_) {
    status.textContent = ot.err_ollama(endpoint);
    status.className = 'status-line status-err';
    sel.classList.add('hidden');
  } finally {
    btn.disabled = false;
    btn.textContent = ot.btn_load_models;
  }
});

$('model-select').addEventListener('change', () => {
  $('ollama-model').value = $('model-select').value;
});

// ── Save ──────────────────────────────────────────────────────────────────
$('btn-save').addEventListener('click', () => {
  const provider = document.querySelector('input[name="provider"]:checked')?.value || 'groq';
  const ui_lang  = document.querySelector('input[name="ui_language"]:checked')?.value || 'ru';

  const settings = {
    provider,
    groq_api_key:         $('groq-key').value.trim(),
    groq_model:           $('groq-model').value.trim()           || DEFAULTS.groq_model,
    ollama_endpoint:      $('ollama-endpoint').value.trim()      || DEFAULTS.ollama_endpoint,
    ollama_model:         $('ollama-model').value.trim()         || DEFAULTS.ollama_model,
    openai_endpoint:      $('openai-endpoint').value.trim()      || DEFAULTS.openai_endpoint,
    openai_api_key:       $('openai-key').value.trim(),
    openai_model:         $('openai-model').value.trim()         || DEFAULTS.openai_model,
    anki_deck:            $('anki-deck').value.trim()            || DEFAULTS.anki_deck,
    default_tags:         $('input-default-tags').value.trim(),
    custom_prompt_suffix: $('input-custom-prompt').value.trim(),
    ui_language:          ui_lang,
  };

  chrome.storage.sync.set(settings, () => {
    ot = OPT_STRINGS[ui_lang] || OPT_STRINGS.ru;
    applyTranslations();

    const ok = $('save-ok');
    ok.classList.remove('invisible');
    setTimeout(() => ok.classList.add('invisible'), 2500);
  });
});
