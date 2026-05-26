'use strict';

// ── Translations ───────────────────────────────────────────────────────────
const STRINGS = {
  ru: {
    styled_label:         '✨ Стилизировать',
    btn_grab:             '📋 Взять из буфера обмена',
    text_title:           'Текст из буфера',
    text_subtitle:        'Отредактируйте перед анализом',
    mode_definitions:     '📖 Определения',
    mode_questions:       '❓ Вопросы',
    hint_definitions:     'Термины, функции, формулы → подробные определения из текста',
    hint_questions:       'Конкретные вопросы по тексту, включая вопросы из самого текста',
    text_placeholder:     'Текст для анализа...',
    btn_analyze:          '✨ Анализировать',
    btn_back:             '← Назад',
    btn_close:            'Закрыть',
    slider_title:         'Количество карточек',
    slider_units:         'карточек',
    btn_generate:         '✨ Сгенерировать',
    btn_change_text:      '← Изменить текст',
    loading_estimating:   'Оцениваю количество карточек...',
    loading_hint_bg:      'Задача выполняется в фоне',
    loading_generating:   'Генерирую карточки...',
    loading_hint_close:   'Можно закрыть расширение — задача продолжится в фоне',
    cards_found:          n    => `Найдено карточек: ${n}`,
    slider_range:        (a,b) => `от ${a} до ${b} карточек`,
    slider_range_none:         'Оценка недоступна — выберите вручную',
    slider_min:           n    => `${n} — ключевое`,
    slider_max:           n    => `${n} — всё`,
    select_all:           'Выбрать все',
    btn_add:              n    => `Добавить выбранные (${n})`,
    btn_adding:           'Добавляю...',
    btn_again:            'Ещё',
    btn_retry:            'Повторить',
    conn_anki:            'AnkiConnect',
    conn_groq_ok:         'Groq API',
    conn_groq_warn:       'Groq: нет ключа',
    conn_ollama_ok:       n    => `Ollama (${n} мод.)`,
    conn_ollama_err:      'Ollama недоступна',
    conn_openai_ok:       'OpenAI API',
    conn_openai_warn:     'OpenAI: нет ключа',
    deck_prefix:          'Колода:',
    deck_loading:         'Загрузка колод...',
    deck_unavail:         'Anki недоступна — введите колоду в настройках',
    warn_no_perm:         'Не удалось прочитать буфер обмена. Убедитесь, что разрешение выдано.',
    warn_too_short:       'Буфер обмена пуст или содержит слишком мало текста (минимум 10 символов).',
    warn_long_text:       n    => `Длинный текст (${(n/1000).toFixed(0)}k симв.) — генерация может занять больше времени.`,
    warn_too_long:        n    => `Текст слишком длинный (${(n/1000).toFixed(0)}k симв., максимум 300k). Сократите его.`,
    err_anki:             'Anki/AnkiConnect недоступны. Убедитесь, что Anki запущена, плагин AnkiConnect установлен (порт 8765), и в настройках AnkiConnect добавлен "*" в webCorsOriginList.',
    err_connect:          'Не удалось подключиться к AnkiConnect (http://localhost:8765)',
    err_no_model:         'Не найдена подходящая модель карточки. В Anki должна быть модель с полями «Front» и «Back» (обычно это «Basic» / «Простая»).',
    card_front:           'Лицевая сторона',
    card_back:            'Обратная сторона',
    card_divider:         'Ответ',
    card_duplicate:       'Дубликат',
    card_err_badge:       'Ошибка',
    card_delete_title:    'Удалить карточку',
    card_copy_title:      'Копировать карточку',
    card_flip_title:      'Просмотр карточки',
    btn_restart:          '↺ Сначала',
    btn_download:         '⬇ Скачать',
    success_added:        n    => `Добавлено ${n} карточек`,
    success_deck:         d    => `в колоду «${d}»`,
    char_count:           n    => `${n.toLocaleString('ru-RU')} симв.`,
    detail_level_label:   'Подробность ответов',
    detail_brief_short:   'Кратко',
    detail_detailed_short:'Подробно',
    detail_level_1:       'Очень кратко',
    detail_level_2:       'Кратко',
    detail_level_3:       'Стандарт',
    detail_level_4:       'Подробно',
    detail_level_5:       'Очень подробно',
    enhance_title:        'AI улучшение',
    enhance_desc:         'Нейросеть дополнит карточки из своих знаний',
    tags_label:           'Теги Anki',
    tags_hint:            'Через пробел, добавятся ко всем карточкам',
    btn_suggest_tags:     '✨ Подобрать',
    tags_suggesting:      'Подбираю...',
    tags_from_anki:       'Из коллекции',
    tags_new_tag:         'Новые',
    tags_err:             'Не удалось подобрать теги',
    gen_title:            'Настройки генерации',
    streaming_text:       'Генерирую карточки...',
    filter_placeholder:   'Поиск по карточкам...',
    history_title:        'История сессий',
    history_open:         'Открыть',
    history_empty:        'Нет сохранённых сессий',
    history_cards:        n    => `${n} карт.`,
    history_just_now:     'только что',
    history_mode_def:     'Определения',
    history_mode_q:       'Вопросы',
  },
  en: {
    styled_label:         '✨ Stylize',
    btn_grab:             '📋 Grab from clipboard',
    text_title:           'Text from clipboard',
    text_subtitle:        'Edit before analysis',
    mode_definitions:     '📖 Definitions',
    mode_questions:       '❓ Questions',
    hint_definitions:     'Terms, functions, formulas → detailed definitions from the text',
    hint_questions:       'Specific questions about the text, including questions from the text itself',
    text_placeholder:     'Text to analyze...',
    btn_analyze:          '✨ Analyze',
    btn_back:             '← Back',
    btn_close:            'Close',
    slider_title:         'Number of cards',
    slider_units:         'cards',
    btn_generate:         '✨ Generate',
    btn_change_text:      '← Change text',
    loading_estimating:   'Estimating card count...',
    loading_hint_bg:      'Task is running in the background',
    loading_generating:   'Generating cards...',
    loading_hint_close:   'You can close the extension — the task will continue in the background',
    cards_found:          n    => `Cards found: ${n}`,
    slider_range:        (a,b) => `from ${a} to ${b} cards`,
    slider_range_none:         'Estimation unavailable — select manually',
    slider_min:           n    => `${n} — key`,
    slider_max:           n    => `${n} — all`,
    select_all:           'Select all',
    btn_add:              n    => `Add selected (${n})`,
    btn_adding:           'Adding...',
    btn_again:            'Again',
    btn_retry:            'Retry',
    conn_anki:            'AnkiConnect',
    conn_groq_ok:         'Groq API',
    conn_groq_warn:       'Groq: no key',
    conn_ollama_ok:       n    => `Ollama (${n} mod.)`,
    conn_ollama_err:      'Ollama unavailable',
    conn_openai_ok:       'OpenAI API',
    conn_openai_warn:     'OpenAI: no key',
    deck_prefix:          'Deck:',
    deck_loading:         'Loading decks...',
    deck_unavail:         'Anki unavailable — enter deck name in settings',
    warn_no_perm:         'Could not read clipboard. Make sure the permission is granted.',
    warn_too_short:       'Clipboard is empty or contains too little text (minimum 10 characters).',
    warn_long_text:       n    => `Long text (${(n/1000).toFixed(0)}k chars) — generation may take longer.`,
    warn_too_long:        n    => `Text is too long (${(n/1000).toFixed(0)}k chars, max 300k). Please shorten it.`,
    err_anki:             'Anki/AnkiConnect unavailable. Make sure Anki is running, the AnkiConnect plugin is installed (port 8765), and "*" is added to webCorsOriginList in AnkiConnect settings.',
    err_connect:          'Could not connect to AnkiConnect (http://localhost:8765)',
    err_no_model:         'No suitable card model found. Anki must have a model with "Front" and "Back" fields (usually "Basic").',
    card_front:           'Front side',
    card_back:            'Back side',
    card_divider:         'Answer',
    card_duplicate:       'Duplicate',
    card_err_badge:       'Error',
    card_delete_title:    'Delete card',
    card_copy_title:      'Copy card',
    card_flip_title:      'Preview card',
    btn_restart:          '↺ Start over',
    btn_download:         '⬇ Download',
    success_added:        n    => `Added ${n} cards`,
    success_deck:         d    => `to deck "${d}"`,
    char_count:           n    => `${n.toLocaleString('en-US')} chars`,
    detail_level_label:   'Answer detail',
    detail_brief_short:   'Brief',
    detail_detailed_short:'Detailed',
    detail_level_1:       'Very brief',
    detail_level_2:       'Brief',
    detail_level_3:       'Standard',
    detail_level_4:       'Detailed',
    detail_level_5:       'Very detailed',
    enhance_title:        'AI enhancement',
    enhance_desc:         'AI will supplement cards from its own knowledge',
    tags_label:           'Anki tags',
    tags_hint:            'Space-separated, added to all cards',
    btn_suggest_tags:     '✨ Suggest',
    tags_suggesting:      'Suggesting...',
    tags_from_anki:       'From collection',
    tags_new_tag:         'New',
    tags_err:             'Failed to suggest tags',
    gen_title:            'Generation settings',
    streaming_text:       'Generating cards...',
    filter_placeholder:   'Search cards...',
    history_title:        'Session history',
    history_open:         'Open',
    history_empty:        'No saved sessions',
    history_cards:        n    => `${n} cards`,
    history_just_now:     'just now',
    history_mode_def:     'Definitions',
    history_mode_q:       'Questions',
  },
};

// ── Local state ────────────────────────────────────────────────────────────
let cards         = [];
let settings      = {};
let currentMode   = 'definitions';
let lastJobText   = '';
let sliderCount   = 10;
let detailLevel   = 3;
let aiEnhance     = false;
let currentStyled = false;
let backsHidden   = false;
let cardLanguage  = 'auto';
let filterText    = '';
const undoStack   = [];
const MAX_UNDO    = 30;
let streamedCount = 0;  // cards already appended to DOM during streaming
let dragIndex     = -1;
let t             = STRINGS.ru;

// ── SW port ────────────────────────────────────────────────────────────────
let swPort = null;

function connectPort() {
  swPort = chrome.runtime.connect({ name: 'popup' });
  swPort.onMessage.addListener(msg => {
    if (msg.type === 'STATE')   applyState(msg.job);
    if (msg.type === 'HISTORY') renderHistory(msg.sessions);
    if (msg.type === 'TAGS')    onTagsReceived(msg);
  });
  swPort.onDisconnect.addListener(() => {
    swPort = null;
    setTimeout(connectPort, 300);
  });
}

function sendSW(msg) {
  if (swPort) { try { swPort.postMessage(msg); } catch (_) {} }
}

// ── DOM refs ───────────────────────────────────────────────────────────────
const views = {
  idle:    document.getElementById('view-idle'),
  history: document.getElementById('view-history'),
  text:    document.getElementById('view-text'),
  slider:  document.getElementById('view-slider'),
  loading: document.getElementById('view-loading'),
  cards:   document.getElementById('view-cards'),
  success: document.getElementById('view-success'),
  error:   document.getElementById('view-error'),
};

const els = {
  deckSubtitle:          document.getElementById('deck-subtitle'),
  btnDeckPick:           document.getElementById('btn-deck-pick'),
  deckPickerWrap:        document.getElementById('deck-picker-wrap'),
  deckPickerSelect:      document.getElementById('deck-picker-select'),
  deckPickerStatus:      document.getElementById('deck-picker-status'),
  deckSubtitleCards:     document.getElementById('deck-subtitle-cards'),
  btnDeckPickCards:      document.getElementById('btn-deck-pick-cards'),
  deckPickerWrapCards:   document.getElementById('deck-picker-wrap-cards'),
  deckPickerSelectCards: document.getElementById('deck-picker-select-cards'),
  deckPickerStatusCards: document.getElementById('deck-picker-status-cards'),
  dotAnki:            document.getElementById('dot-anki'),
  labelAnki:          document.getElementById('label-anki'),
  dotAi:              document.getElementById('dot-ai'),
  labelAi:            document.getElementById('label-ai'),
  idleWarning:        document.getElementById('idle-warning'),
  btnGrab:            document.getElementById('btn-grab'),
  btnOptions:         document.getElementById('btn-options'),
  btnHistory:         document.getElementById('btn-history'),
  btnHistoryBack:     document.getElementById('btn-history-back'),
  historyList:        document.getElementById('history-list'),
  historyEmpty:       document.getElementById('history-empty'),
  chkStyled:          document.getElementById('chk-styled'),
  // text view
  textEditor:         document.getElementById('text-editor'),
  textCharCount:      document.getElementById('text-char-count'),
  textLengthWarning:  document.getElementById('text-length-warning'),
  btnAnalyze:         document.getElementById('btn-analyze'),
  btnTextBack:        document.getElementById('btn-text-back'),
  // slider view
  sliderRangeLabel:   document.getElementById('slider-range-label'),
  sliderMinLabel:     document.getElementById('slider-min-label'),
  sliderMaxLabel:     document.getElementById('slider-max-label'),
  cardCountSlider:    document.getElementById('card-count-slider'),
  sliderCountNum:     document.getElementById('slider-count-num'),
  detailLevelSlider:  document.getElementById('detail-level-slider'),
  detailLevelBadge:   document.getElementById('detail-level-badge'),
  chkEnhance:         document.getElementById('chk-enhance'),
  tagsInput:          document.getElementById('tags-input'),
  btnSuggestTags:     document.getElementById('btn-suggest-tags'),
  tagChipsWrap:       document.getElementById('tag-chips-wrap'),
  btnGenerate:        document.getElementById('btn-generate'),
  btnSliderBack:      document.getElementById('btn-slider-back'),
  // loading
  loadingText:        document.getElementById('loading-text'),
  loadingHint:        document.getElementById('loading-hint'),
  // cards view
  cardsCountLabel:    document.getElementById('cards-count-label'),
  btnUndo:            document.getElementById('btn-undo'),
  btnToggleBacks:     document.getElementById('btn-toggle-backs'),
  chkSelectAll:       document.getElementById('chk-select-all'),
  cardFilterInput:    document.getElementById('card-filter-input'),
  cardsList:          document.getElementById('cards-list'),
  streamingBar:       document.getElementById('streaming-bar'),
  streamingBarText:   document.getElementById('streaming-bar-text'),
  cardsError:         document.getElementById('cards-error'),
  btnAddAnki:         document.getElementById('btn-add-anki'),
  btnRestart:         document.getElementById('btn-restart'),
  btnDownload:        document.getElementById('btn-download'),
  btnBack:            document.getElementById('btn-back'),
  // success
  successText:        document.getElementById('success-text'),
  successSub:         document.getElementById('success-sub'),
  btnAgain:           document.getElementById('btn-again'),
  // error
  errorText:          document.getElementById('error-text'),
  errorRaw:           document.getElementById('error-raw'),
  btnRetry:           document.getElementById('btn-retry'),
  btnErrorBack:       document.getElementById('btn-error-back'),
  // flip modal
  flipModal:          document.getElementById('flip-modal'),
  flipBackdrop:       document.getElementById('flip-backdrop'),
  flipFront:          document.getElementById('flip-front'),
  flipBack:           document.getElementById('flip-back'),
  btnFlipClose:       document.getElementById('btn-flip-close'),
};

// ── Translation helpers ────────────────────────────────────────────────────
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (typeof t[key] === 'string') el.textContent = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (typeof t[key] === 'string') el.placeholder = t[key];
  });
  updateDetailBadge();
  updateAddButton();
}

function updateDetailBadge() {
  if (els.detailLevelBadge) els.detailLevelBadge.textContent = t[`detail_level_${detailLevel}`] || '';
}

// ── View switching ─────────────────────────────────────────────────────────
function showView(name) {
  Object.entries(views).forEach(([k, el]) => {
    el.classList.toggle('hidden', k !== name);
    if (k === name) el.classList.add('view');
  });
}

// ── Apply state from SW ────────────────────────────────────────────────────
function applyState(job) {
  if (job.text) lastJobText = job.text;

  switch (job.status) {
    case 'idle':
      showView('idle');
      break;

    case 'estimating':
      els.loadingText.textContent = t.loading_estimating;
      els.loadingHint.textContent = t.loading_hint_bg;
      showView('loading');
      break;

    case 'awaiting_count': {
      const { min, max, count, isFallback } = job;
      sliderCount = count;
      els.cardCountSlider.min   = min;
      els.cardCountSlider.max   = max;
      els.cardCountSlider.value = count;
      els.sliderCountNum.textContent = count;
      els.sliderRangeLabel.textContent = isFallback
        ? t.slider_range_none
        : t.slider_range(min, max);
      els.sliderMinLabel.textContent = t.slider_min(min);
      els.sliderMaxLabel.textContent = t.slider_max(max);
      showView('slider');
      break;
    }

    case 'generating':
      streamedCount = 0;
      cards = [];
      els.loadingText.textContent = t.loading_generating;
      els.loadingHint.textContent = t.loading_hint_close;
      showView('loading');
      break;

    case 'streaming': {
      const newCards = job.cards || [];
      if (newCards.length > streamedCount) {
        if (streamedCount === 0) {
          // First cards: initialize the cards view
          cards = [];
          els.cardsList.innerHTML = '';
          els.chkSelectAll.checked = true;
          els.cardsError.classList.add('hidden');
          filterText = '';
          els.cardFilterInput.value = '';
          resetBacksToggle();
          showView('cards');
        }
        for (let i = streamedCount; i < newCards.length; i++) {
          cards.push(newCards[i]);
          const row = buildCardRow(newCards[i], i, !!job.styled);
          els.cardsList.appendChild(row);
          row.querySelectorAll('.card-textarea').forEach(autoResize);
        }
        streamedCount = newCards.length;
        els.cardsCountLabel.textContent = t.cards_found(cards.length);
        applyCardFilter();
        // Disable add button during streaming
        els.btnAddAnki.disabled = true;
        els.btnAddAnki.textContent = t.streaming_text;
      }
      els.streamingBar.classList.remove('hidden');
      break;
    }

    case 'done':
      streamedCount = 0;
      cards = [...(job.cards || [])];
      filterText = '';
      els.cardFilterInput.value = '';
      undoStack.length = 0;
      els.btnUndo.disabled = true;
      resetBacksToggle();
      els.streamingBar.classList.add('hidden');
      renderCards(!!job.styled);
      showView('cards');
      break;

    case 'error':
      showError(job.errorMsg, job.errorRaw);
      break;
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
async function init() {
  settings = await loadSettings();
  t = STRINGS[settings.ui_language] || STRINGS.ru;
  applyTranslations();

  const deckLabel = `${t.deck_prefix} ${settings.anki_deck || 'Default'}`;
  els.deckSubtitle.textContent      = deckLabel;
  els.deckSubtitleCards.textContent = deckLabel;
  syncProviderUI();
  els.chkStyled.checked = !!settings.styled_text;

  // Restore persisted UI prefs
  chrome.storage.local.get({ ui_prefs: {} }, data => {
    const prefs = data.ui_prefs || {};
    if (prefs.detailLevel !== undefined) {
      detailLevel = prefs.detailLevel;
      els.detailLevelSlider.value = detailLevel;
      updateDetailBadge();
    }
    if (prefs.aiEnhance !== undefined) {
      aiEnhance = prefs.aiEnhance;
      els.chkEnhance.checked = aiEnhance;
    }
    if (prefs.cardLanguage) {
      cardLanguage = prefs.cardLanguage;
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === cardLanguage));
    }
  });

  // Pre-populate tags from default settings
  if (settings.default_tags) els.tagsInput.value = settings.default_tags;

  showView('idle');
  hideWarning();
  checkConnections();

  connectPort();
  sendSW({ type: 'GET_STATE' });
}

function saveUiPrefs() {
  chrome.storage.local.set({ ui_prefs: { detailLevel, aiEnhance, cardLanguage } });
}

// ── Provider toggle ────────────────────────────────────────────────────────
function syncProviderUI() {
  document.querySelectorAll('.provider-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.provider === settings.provider);
  });
}

document.querySelectorAll('.provider-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.provider === settings.provider) return;
    settings.provider = btn.dataset.provider;
    chrome.storage.sync.set({ provider: settings.provider });
    syncProviderUI();
    checkConnections();
  });
});

// ── Styled toggle ──────────────────────────────────────────────────────────
els.chkStyled.addEventListener('change', () => {
  settings.styled_text = els.chkStyled.checked;
  chrome.storage.sync.set({ styled_text: settings.styled_text });
});

// ── Hide/show backs toggle ─────────────────────────────────────────────────
function resetBacksToggle() {
  backsHidden = false;
  els.cardsList.classList.remove('backs-hidden');
  els.btnToggleBacks.classList.remove('active');
  els.btnToggleBacks.title = 'Скрыть ответы';
}

els.btnToggleBacks.addEventListener('click', () => {
  backsHidden = !backsHidden;
  els.cardsList.classList.toggle('backs-hidden', backsHidden);
  els.btnToggleBacks.classList.toggle('active', backsHidden);
  els.btnToggleBacks.title = backsHidden ? 'Показать ответы' : 'Скрыть ответы';
});

// ── Undo ──────────────────────────────────────────────────────────────────
let syncTimer = null;

function syncCardsNow() {
  sendSW({ type: 'SYNC_CARDS', cards });
}

function syncCards() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncCardsNow, 100);
}

function pushUndo() {
  undoStack.push(cards.map(c => ({ ...c })));
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  els.btnUndo.disabled = false;
}

function applyUndo() {
  if (!undoStack.length) return;
  cards = undoStack.pop();
  els.btnUndo.disabled = undoStack.length === 0;
  syncCardsNow();
  renderCards(currentStyled);
}

els.btnUndo.addEventListener('click', applyUndo);

// ── Language toggle ────────────────────────────────────────────────────────
document.getElementById('lang-toggle').addEventListener('click', e => {
  const btn = e.target.closest('.lang-btn');
  if (!btn) return;
  cardLanguage = btn.dataset.lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b === btn));
  saveUiPrefs();
});

// ── Connection status ──────────────────────────────────────────────────────
function setConn(which, state, label) {
  const dot = which === 'anki' ? els.dotAnki : els.dotAi;
  const lbl = which === 'anki' ? els.labelAnki : els.labelAi;
  dot.className   = `conn-dot ${state}`;
  lbl.textContent = label;
}

async function checkConnections() {
  setConn('anki', 'checking', t.conn_anki);
  const provLabel = settings.provider === 'ollama' ? 'Ollama' : settings.provider === 'openai' ? 'OpenAI' : 'Groq';
  setConn('ai', 'checking', provLabel);

  try {
    const r = await fetch('http://localhost:8765', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deckNames', version: 6, params: {} }),
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error);
    setConn('anki', 'ok', t.conn_anki);
  } catch (_) {
    setConn('anki', 'err', t.conn_anki);
  }

  if (settings.provider === 'ollama') {
    const endpoint = (settings.ollama_endpoint || 'http://localhost:11434').replace(/\/$/, '');
    try {
      const r = await fetch(`${endpoint}/api/tags`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setConn('ai', 'ok', t.conn_ollama_ok((d.models || []).length));
    } catch (_) {
      setConn('ai', 'err', t.conn_ollama_err);
    }
  } else if (settings.provider === 'openai') {
    setConn('ai', settings.openai_api_key ? 'ok' : 'warn',
            settings.openai_api_key ? t.conn_openai_ok : t.conn_openai_warn);
  } else {
    setConn('ai', settings.groq_api_key ? 'ok' : 'warn',
            settings.groq_api_key ? t.conn_groq_ok : t.conn_groq_warn);
  }
}

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
      anki_model:           '',
      ui_language:          'ru',
      styled_text:          false,
      default_tags:         '',
      custom_prompt_suffix: '',
    }, resolve);
  });
}

// ── Warning helpers ────────────────────────────────────────────────────────
function showWarning(msg) {
  els.idleWarning.textContent = msg;
  els.idleWarning.classList.remove('hidden');
}
function hideWarning() {
  els.idleWarning.classList.add('hidden');
}

// ── Grab from clipboard ────────────────────────────────────────────────────
els.btnGrab.addEventListener('click', async () => {
  hideWarning();
  let text = '';
  try {
    text = await navigator.clipboard.readText();
  } catch (_) {
    showWarning(t.warn_no_perm);
    return;
  }
  text = text.trim();
  if (text.length < 10) {
    showWarning(t.warn_too_short);
    return;
  }
  openTextEditor(text);
});

// ── Text editor view ───────────────────────────────────────────────────────
function openTextEditor(text) {
  els.textEditor.value = text;
  updateCharCount();
  showView('text');
}

function updateCharCount() {
  const n = els.textEditor.value.length;
  els.textCharCount.textContent = t.char_count(n);

  if (n > 300_000) {
    els.textCharCount.className = 'char-count danger';
    els.textLengthWarning.textContent = t.warn_too_long(n);
    els.textLengthWarning.className = 'inline-error';
    els.textLengthWarning.classList.remove('hidden');
    els.btnAnalyze.disabled = true;
  } else if (n > 60_000) {
    els.textCharCount.className = 'char-count warn';
    els.textLengthWarning.textContent = t.warn_long_text(n);
    els.textLengthWarning.className = 'inline-warning';
    els.textLengthWarning.classList.remove('hidden');
    els.btnAnalyze.disabled = false;
  } else {
    els.textCharCount.className = 'char-count';
    els.textLengthWarning.classList.add('hidden');
    els.btnAnalyze.disabled = false;
  }
}

els.textEditor.addEventListener('input', updateCharCount);

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    document.getElementById('mode-hint').textContent =
      currentMode === 'definitions' ? t.hint_definitions : t.hint_questions;
  });
});

els.btnAnalyze.addEventListener('click', () => {
  const text = els.textEditor.value.trim();
  if (text.length < 10 || text.length > 300_000) return;
  sendSW({ type: 'START_ESTIMATION', text, mode: currentMode, styled: !!settings.styled_text });
});

els.btnTextBack.addEventListener('click', () => showView('idle'));

// ── Generation settings view ───────────────────────────────────────────────
els.cardCountSlider.addEventListener('input', () => {
  sliderCount = Number(els.cardCountSlider.value);
  els.sliderCountNum.textContent = sliderCount;
});

els.detailLevelSlider.addEventListener('input', () => {
  detailLevel = Number(els.detailLevelSlider.value);
  updateDetailBadge();
  saveUiPrefs();
});

els.chkEnhance.addEventListener('change', () => {
  aiEnhance = els.chkEnhance.checked;
  saveUiPrefs();
});

// ── Tag suggestion ────────────────────────────────────────────────────────
els.btnSuggestTags.addEventListener('click', async () => {
  if (!lastJobText) return;

  els.btnSuggestTags.disabled    = true;
  els.btnSuggestTags.textContent = t.tags_suggesting;
  els.tagChipsWrap.classList.add('hidden');

  // Try to fetch existing tags from Anki (gracefully fails if Anki is down)
  let existingTags = [];
  try {
    existingTags = await ankiAction('getTags', {});
    if (!Array.isArray(existingTags)) existingTags = [];
  } catch (_) {}

  sendSW({ type: 'GENERATE_TAGS', text: lastJobText, existingTags });
});

function onTagsReceived(msg) {
  els.btnSuggestTags.disabled    = false;
  els.btnSuggestTags.textContent = t.btn_suggest_tags;

  if (msg.error || !msg.tags?.length) {
    if (msg.error) {
      // Show brief error in chip area
      els.tagChipsWrap.innerHTML = `<span style="font-size:11px;color:var(--red)">${t.tags_err}</span>`;
      els.tagChipsWrap.classList.remove('hidden');
    }
    return;
  }

  renderTagChips(msg.tags, msg.existingTags || []);
}

function renderTagChips(suggestedTags, existingAnkiTags) {
  const wrap       = els.tagChipsWrap;
  const existingSet = new Set(existingAnkiTags.map(tag => tag.toLowerCase()));

  wrap.innerHTML = '';

  // Legend — only if there's a mix of existing and new
  const hasExisting = suggestedTags.some(tag => existingSet.has(tag.toLowerCase()));
  const hasNew      = suggestedTags.some(tag => !existingSet.has(tag.toLowerCase()));
  if (hasExisting && hasNew) {
    const legend = document.createElement('div');
    legend.className = 'tag-chips-legend';
    legend.innerHTML =
      `<span class="tag-chips-legend-item"><span class="tag-chips-legend-dot existing"></span>${t.tags_from_anki}</span>` +
      `<span class="tag-chips-legend-item"><span class="tag-chips-legend-dot new-tag"></span>${t.tags_new_tag}</span>`;
    wrap.appendChild(legend);
  }

  const chipsRow = document.createElement('div');
  chipsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';

  suggestedTags.forEach(tag => {
    const isExisting = existingSet.has(tag.toLowerCase());
    const chip = document.createElement('button');
    chip.className       = `tag-chip ${isExisting ? 'tag-chip-existing' : 'tag-chip-new'}`;
    chip.dataset.tag     = tag;
    chip.dataset.selected = 'true';
    chip.type            = 'button';

    const icon = document.createElement('span');
    icon.className   = 'tag-chip-icon';
    icon.textContent = isExisting ? '▪' : '✦';

    const label = document.createElement('span');
    label.textContent = tag;

    chip.append(icon, label);
    chip.addEventListener('click', () => {
      const isSelected = chip.dataset.selected === 'true';
      chip.dataset.selected = isSelected ? 'false' : 'true';
      syncTagsFromChips();
    });

    chipsRow.appendChild(chip);
  });

  wrap.appendChild(chipsRow);
  wrap.classList.remove('hidden');
  syncTagsFromChips();
}

function syncTagsFromChips() {
  const selected = [...els.tagChipsWrap.querySelectorAll('.tag-chip[data-selected="true"]')]
    .map(chip => chip.dataset.tag);
  els.tagsInput.value = selected.join(' ');
}

els.btnGenerate.addEventListener('click', () => {
  const rawTags = els.tagsInput.value.trim();
  const tags    = rawTags ? rawTags.split(/\s+/).filter(Boolean) : [];
  sendSW({ type: 'START_GENERATION', count: sliderCount, detail: detailLevel, enhance: aiEnhance, tags, lang: cardLanguage, styled: !!settings.styled_text });
});

els.btnSliderBack.addEventListener('click', () => {
  els.tagChipsWrap.classList.add('hidden');
  els.tagChipsWrap.innerHTML = '';
  sendSW({ type: 'CLEAR' });
  if (lastJobText) openTextEditor(lastJobText);
  else showView('idle');
});

// ── History view ───────────────────────────────────────────────────────────
els.btnHistory.addEventListener('click', () => {
  showView('history');
  sendSW({ type: 'GET_HISTORY' });
});

els.btnHistoryBack.addEventListener('click', () => showView('idle'));

function formatRelativeTime(ts) {
  const diff  = Date.now() - ts;
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  const locale = t === STRINGS.en ? 'en-US' : 'ru-RU';
  const timeStr = new Date(ts).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  if (mins < 2)   return t.history_just_now;
  if (mins < 60)  return t === STRINGS.en ? `${mins} min ago` : `${mins} мин. назад`;
  if (days === 0) return (t === STRINGS.en ? 'today ' : 'сегодня ') + timeStr;
  if (days === 1) return (t === STRINGS.en ? 'yesterday ' : 'вчера ') + timeStr;
  if (days < 7)   return t === STRINGS.en ? `${days} days ago` : `${days} дн. назад`;
  return new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
}

function renderHistory(sessions) {
  els.historyList.innerHTML = '';
  if (!sessions || sessions.length === 0) {
    els.historyEmpty.classList.remove('hidden');
    return;
  }
  els.historyEmpty.classList.add('hidden');

  sessions.forEach(session => {
    const item = document.createElement('div');
    item.className = 'history-item';

    const header = document.createElement('div');
    header.className = 'history-item-header';

    const meta = document.createElement('div');
    meta.className = 'history-item-meta';

    const modeBadge = document.createElement('span');
    modeBadge.className = 'history-mode-badge';
    modeBadge.textContent = session.mode === 'questions' ? t.history_mode_q : t.history_mode_def;

    const timeEl = document.createElement('span');
    timeEl.className = 'history-time';
    timeEl.textContent = formatRelativeTime(session.timestamp);

    const countEl = document.createElement('span');
    countEl.className = 'history-count';
    countEl.textContent = t.history_cards(session.cards?.length || 0);

    meta.append(modeBadge, timeEl, countEl);

    const openBtn = document.createElement('button');
    openBtn.className = 'btn-history-open';
    openBtn.textContent = t.history_open;
    openBtn.addEventListener('click', () => {
      sendSW({ type: 'RESTORE_SESSION', id: session.id });
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className   = 'btn-history-delete';
    deleteBtn.title       = 'Удалить';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', async e => {
      e.stopPropagation();
      const data    = await chrome.storage.local.get({ session_history: [] });
      const updated = (data.session_history || []).filter(s => s.id !== session.id);
      await chrome.storage.local.set({ session_history: updated });
      renderHistory(updated);
    });

    header.append(meta, openBtn, deleteBtn);

    const preview = document.createElement('div');
    preview.className = 'history-preview';
    preview.textContent = session.text_preview || '';

    item.append(header, preview);
    els.historyList.appendChild(item);
  });
}

// ── Card filter ────────────────────────────────────────────────────────────
els.cardFilterInput.addEventListener('input', () => {
  filterText = els.cardFilterInput.value.toLowerCase().trim();
  applyCardFilter();
});

function applyCardFilter() {
  els.cardsList.querySelectorAll('.card-row').forEach(row => {
    const i = Number(row.dataset.index);
    const card = cards[i];
    if (!card) return;
    const matches = !filterText ||
      card.front.toLowerCase().includes(filterText) ||
      card.back.toLowerCase().includes(filterText);
    row.classList.toggle('hidden', !matches);
  });
  updateAddButton();
}

// ── Cards rendering ────────────────────────────────────────────────────────
function renderCards(isStyled = false) {
  currentStyled = isStyled;
  els.cardsCountLabel.textContent = t.cards_found(cards.length);
  els.cardsList.innerHTML         = '';
  els.chkSelectAll.checked        = true;
  els.cardsError.classList.add('hidden');
  cards.forEach((card, i) => els.cardsList.appendChild(buildCardRow(card, i, isStyled)));
  updateAddButton();
  requestAnimationFrame(() => els.cardsList.querySelectorAll('.card-textarea').forEach(autoResize));
}

function buildCardRow(card, i, isStyled = false) {
  const row = document.createElement('div');
  row.className    = 'card-row';
  row.dataset.index = i;
  row.draggable    = true;
  if (card.collapsed) row.classList.add('collapsed');

  // ── Drag-and-drop ──
  row.addEventListener('dragstart', e => {
    dragIndex = i;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(i));
    setTimeout(() => row.classList.add('dragging'), 0);
  });
  row.addEventListener('dragend', () => {
    row.classList.remove('dragging');
    els.cardsList.querySelectorAll('.card-row').forEach(r => r.classList.remove('drag-over'));
  });
  row.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (i !== dragIndex) {
      els.cardsList.querySelectorAll('.card-row').forEach(r => r.classList.remove('drag-over'));
      row.classList.add('drag-over');
    }
  });
  row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
  row.addEventListener('drop', e => {
    e.preventDefault();
    row.classList.remove('drag-over');
    const from = dragIndex;
    const to   = i;
    if (from !== to && from >= 0) {
      pushUndo();
      const [moved] = cards.splice(from, 1);
      cards.splice(to, 0, moved);
      syncCardsNow();
      renderCards(currentStyled);
    }
  });

  // ── Drag handle ──
  const handle = document.createElement('div');
  handle.className = 'drag-handle';
  handle.textContent = '⠿';
  handle.draggable = false;

  // ── Checkbox ──
  const chk = document.createElement('input');
  chk.type      = 'checkbox';
  chk.className = 'card-checkbox';
  chk.checked   = card.checked !== false;
  chk.addEventListener('change', () => { cards[i].checked = chk.checked; syncCardsNow(); updateAddButton(); });

  // ── Card fields ──
  const fields = document.createElement('div');
  fields.className = 'card-fields';

  const frontTA = makeTextarea(card.front, t.card_front);
  frontTA.dataset.field = 'front';
  frontTA.addEventListener('focus', () => pushUndo());
  frontTA.addEventListener('input', () => { cards[i].front = frontTA.value; autoResize(frontTA); syncCards(); });

  const divider = document.createElement('div');
  divider.className   = 'card-divider';
  divider.textContent = t.card_divider;

  let backEl;
  if (isStyled) {
    backEl = document.createElement('div');
    backEl.className       = 'card-html';
    backEl.contentEditable = 'true';
    backEl.dataset.field   = 'back';
    backEl.innerHTML       = card.back;
    backEl.addEventListener('focus', () => pushUndo());
    backEl.addEventListener('input', () => { cards[i].back = backEl.innerHTML; syncCards(); });
  } else {
    backEl = makeTextarea(card.back, t.card_back);
    backEl.dataset.field = 'back';
    backEl.addEventListener('focus', () => pushUndo());
    backEl.addEventListener('input', () => { cards[i].back = backEl.value; autoResize(backEl); syncCards(); });
  }

  fields.append(frontTA, divider, backEl);

  // ── Action buttons ──
  const actions = document.createElement('div');
  actions.className = 'card-actions';

  // Collapse button — icons switched via CSS (.icon-exp / .icon-col)
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'btn-card-action btn-collapse';
  collapseBtn.title     = card.collapsed ? 'Показать ответ' : 'Скрыть ответ';
  collapseBtn.innerHTML =
    '<svg class="icon-exp" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>' +
    '<svg class="icon-col" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  collapseBtn.addEventListener('click', () => {
    const collapsed = row.classList.toggle('collapsed');
    cards[i].collapsed = collapsed;
    collapseBtn.title = collapsed ? 'Показать ответ' : 'Скрыть ответ';
    syncCardsNow();
  });

  // Flip preview button
  const flipBtn = document.createElement('button');
  flipBtn.className = 'btn-card-action btn-flip';
  flipBtn.title     = t.card_flip_title;
  flipBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  flipBtn.addEventListener('click', () => openFlipModal(cards[i], isStyled));

  // Copy button
  const copyBtn = document.createElement('button');
  copyBtn.className = 'btn-card-action btn-copy';
  copyBtn.title     = t.card_copy_title;
  copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  copyBtn.addEventListener('click', async () => {
    const c = cards[i];
    const text = `${c.front}\n---\n${c.back.replace(/<[^>]+>/g, '')}`;
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.classList.add('copied');
      setTimeout(() => copyBtn.classList.remove('copied'), 1200);
    } catch (_) {}
  });

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'btn-card-action btn-delete';
  delBtn.title     = t.card_delete_title;
  delBtn.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  delBtn.addEventListener('click', () => { pushUndo(); cards.splice(i, 1); syncCardsNow(); renderCards(currentStyled); });

  actions.append(collapseBtn, flipBtn, copyBtn, delBtn);

  const headerGap = document.createElement('div');
  headerGap.className = 'card-header-gap';
  const header = document.createElement('div');
  header.className = 'card-header';
  header.append(handle, chk, headerGap, actions);

  row.append(header, fields);
  return row;
}

function makeTextarea(value, placeholder) {
  const ta       = document.createElement('textarea');
  ta.className   = 'card-textarea';
  ta.value       = value;
  ta.placeholder = placeholder;
  ta.rows        = 1;
  return ta;
}

function autoResize(ta) {
  ta.style.height = '0';
  ta.style.height = ta.scrollHeight + 'px';
}

// ── Card flip modal ────────────────────────────────────────────────────────
function openFlipModal(card, isStyled) {
  els.flipFront.textContent = card.front;
  if (isStyled) {
    els.flipBack.innerHTML = card.back;
  } else {
    els.flipBack.textContent = card.back;
  }
  els.flipModal.classList.remove('hidden');
}

function closeFlipModal() {
  els.flipModal.classList.add('hidden');
}

els.btnFlipClose.addEventListener('click', closeFlipModal);
els.flipBackdrop.addEventListener('click', closeFlipModal);

// ── Select-all ─────────────────────────────────────────────────────────────
els.chkSelectAll.addEventListener('change', () => {
  const checked = els.chkSelectAll.checked;
  els.cardsList.querySelectorAll('.card-row:not(.hidden)').forEach(row => {
    const cb = row.querySelector('.card-checkbox');
    if (cb) cb.checked = checked;
    const idx = Number(row.dataset.index);
    if (cards[idx]) cards[idx].checked = checked;
  });
  syncCardsNow();
  updateAddButton();
});

function getSelectedRows() {
  return [...els.cardsList.querySelectorAll('.card-row')]
    .filter(row => !row.classList.contains('hidden') && row.querySelector('.card-checkbox')?.checked);
}

function updateAddButton() {
  const n   = getSelectedRows().length;
  const all = [...els.cardsList.querySelectorAll('.card-row:not(.hidden)')].length;
  // Don't enable add button during streaming
  const isStreaming = !els.streamingBar.classList.contains('hidden');
  els.btnAddAnki.disabled    = n === 0 || isStreaming;
  els.btnAddAnki.textContent = isStreaming ? t.streaming_text : t.btn_add(n);
  els.chkSelectAll.indeterminate = n > 0 && n < all;
  els.chkSelectAll.checked       = n === all && all > 0;
}

// ── Add to Anki ────────────────────────────────────────────────────────────
els.btnAddAnki.addEventListener('click', async () => {
  const deck = settings.anki_deck || 'Default';
  const sessionTags = (els.tagsInput.value.trim()).split(/\s+/).filter(Boolean);

  try {
    await ankiAction('deckNames', {});
  } catch (_) {
    els.cardsError.textContent = t.err_anki;
    els.cardsError.classList.remove('hidden');
    return;
  }

  els.cardsError.classList.add('hidden');
  els.btnAddAnki.disabled    = true;
  els.btnAddAnki.textContent = t.btn_adding;

  let modelName;
  try {
    modelName = await resolveModel();
  } catch (err) {
    els.cardsError.textContent = err.message;
    els.cardsError.classList.remove('hidden');
    els.btnAddAnki.disabled    = false;
    els.btnAddAnki.textContent = t.btn_add(getSelectedRows().length);
    return;
  }

  const selectedRows = getSelectedRows();
  const hasStyled = selectedRows.some(r => r.querySelector('[data-field="back"]')?.contentEditable === 'true');
  if (hasStyled) await ensureAnkiStyling(modelName);

  let added = 0;
  for (const row of selectedRows) {
    const i    = Number(row.dataset.index);
    const card = cards[i];
    if (!card) continue;

    const frontEl     = row.querySelector('[data-field="front"]');
    const backEl      = row.querySelector('[data-field="back"]');
    const front       = frontEl?.value?.trim() || card.front;
    const isStyledBack = backEl?.contentEditable === 'true';
    const rawBack     = isStyledBack
      ? (backEl?.innerHTML?.trim() || card.back)
      : (backEl?.value?.trim()     || card.back);
    const back        = isStyledBack ? `<div class="ac-styled">${rawBack}</div>` : rawBack;

    try {
      await ankiAction('addNote', {
        note: {
          deckName:  deck,
          modelName,
          fields:    { Front: front, Back: back },
          options:   { allowDuplicate: false },
          tags:      sessionTags,
        },
      });
      added++;
    } catch (err) {
      const msg = String(err.message || err);
      if (msg.toLowerCase().includes('duplicate')) {
        row.classList.add('duplicate');
        addBadge(row, 'duplicate', t.card_duplicate);
      } else {
        row.classList.add('error-card');
        addBadge(row, 'error', t.card_err_badge);
      }
    }
  }

  sendSW({ type: 'CLEAR' });
  els.successText.textContent = t.success_added(added);
  els.successSub.textContent  = t.success_deck(deck);
  showView('success');
});

function addBadge(row, type, label) {
  const existing = row.querySelector('.card-badge');
  if (existing) existing.remove();
  const badge       = document.createElement('div');
  badge.className   = `card-badge ${type}`;
  badge.textContent = label;
  row.querySelector('.card-fields')?.appendChild(badge);
}

// ── Download as .txt ──────────────────────────────────────────────────────
els.btnDownload.addEventListener('click', () => {
  const rows = getSelectedRows();
  if (!rows.length) return;

  const lines = rows.map(row => {
    const i     = Number(row.dataset.index);
    const card  = cards[i];
    if (!card) return null;
    const frontEl = row.querySelector('[data-field="front"]');
    const backEl  = row.querySelector('[data-field="back"]');
    const front   = (frontEl?.value?.trim() || card.front).replace(/\t/g, ' ').replace(/\r?\n/g, ' ');
    const back    = backEl?.contentEditable === 'true'
      ? (backEl?.innerHTML?.trim() || card.back)
      : (backEl?.value?.trim() || card.back).replace(/\r?\n/g, '<br>');
    return `${front}\t${back}`;
  }).filter(Boolean);

  const deck    = settings.anki_deck || 'Default';
  const tags    = (els.tagsInput.value.trim()).split(/\s+/).filter(Boolean);
  const tagLine = tags.length ? `\n#tags:${tags.join(' ')}` : '';
  const content = `#separator:Tab\n#html:true\n#deck:${deck}${tagLine}\n` + lines.join('\n');
  const blob    = new Blob(['﻿' + content], { type: 'text/plain;charset=utf-8' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href        = url;
  a.download    = `anki-cards-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// ── Anki styled CSS injection ──────────────────────────────────────────────
const AC_STYLED_MARKER = '/* anki-clipper-styled */';
const AC_STYLED_CSS = `
.ac-styled { line-height: 1.65; }
.ac-styled b, .ac-styled strong { color: #7c3aed; font-weight: 700; }
.ac-styled em { color: #059669; font-style: italic; }
.ac-styled code { background: rgba(124,58,237,0.12); border: 1px solid rgba(124,58,237,0.28); border-radius: 4px; padding: 1px 5px; font-family: 'Consolas','Courier New',monospace; font-size: 0.88em; color: #6d28d9; }
.ac-styled pre { background: #1e1e2e; border: 1px solid rgba(124,58,237,0.25); border-radius: 8px; padding: 10px 14px; overflow-x: auto; margin: 8px 0; }
.ac-styled pre code { background: none; border: none; padding: 0; color: #cdd6f4; font-size: 0.9em; }
.ac-styled ul, .ac-styled ol { padding-left: 20px; margin: 6px 0; }
.ac-styled li { margin: 3px 0; }
.ac-styled blockquote { border-left: 3px solid #7c3aed; padding: 4px 0 4px 12px; color: inherit; opacity: 0.8; margin: 8px 0; font-style: italic; }`;

async function ensureAnkiStyling(modelName) {
  try {
    const result = await ankiAction('modelStyling', { modelName });
    const css = result?.css || '';
    if (!css.includes(AC_STYLED_MARKER)) {
      await ankiAction('updateModelStyling', {
        model: { name: modelName, css: css + '\n' + AC_STYLED_MARKER + AC_STYLED_CSS },
      });
    }
  } catch (_) {}
}

// ── Model auto-detection ───────────────────────────────────────────────────
async function resolveModel() {
  if (settings.anki_model) {
    try {
      await ankiAction('modelFieldNames', { modelName: settings.anki_model });
      return settings.anki_model;
    } catch (_) {}
  }
  const models = await ankiAction('modelNames', {});
  for (const model of models) {
    try {
      const fields = await ankiAction('modelFieldNames', { modelName: model });
      if (fields.includes('Front') && fields.includes('Back')) {
        settings.anki_model = model;
        chrome.storage.sync.set({ anki_model: model });
        return model;
      }
    } catch (_) {}
  }
  throw new Error(t.err_no_model);
}

// ── AnkiConnect ────────────────────────────────────────────────────────────
async function ankiAction(action, params) {
  const resp = await fetch('http://localhost:8765', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, version: 6, params }),
  }).catch(() => { throw new Error(t.err_connect); });
  const data = await resp.json();
  if (data.error) throw new Error(data.error);
  return data.result;
}

// ── Deck picker ────────────────────────────────────────────────────────────
function selectDeck(deckName) {
  settings.anki_deck = deckName;
  chrome.storage.sync.set({ anki_deck: deckName });
  const label = `${t.deck_prefix} ${deckName}`;
  els.deckSubtitle.textContent      = label;
  els.deckSubtitleCards.textContent = label;
  els.deckPickerWrap.classList.add('hidden');
  els.deckPickerWrapCards.classList.add('hidden');
}

async function openDeckPicker(wrap, select, status) {
  if (!wrap.classList.contains('hidden')) { wrap.classList.add('hidden'); return; }

  status.textContent = t.deck_loading;
  status.className   = 'deck-picker-status';
  select.innerHTML   = '';
  wrap.classList.remove('hidden');

  try {
    const resp = await fetch('http://localhost:8765', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deckNames', version: 6, params: {} }),
    });
    const data = await resp.json();
    if (data.error) throw new Error(data.error);

    const decks   = [...(data.result || [])].sort((a, b) => a.localeCompare(b));
    const current = settings.anki_deck || 'Default';
    decks.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name; opt.textContent = name;
      if (name === current) opt.selected = true;
      select.appendChild(opt);
    });
    status.textContent = '';
  } catch (_) {
    status.textContent = t.deck_unavail;
    status.className   = 'deck-picker-status status-err';
    select.innerHTML   =
      `<option value="${settings.anki_deck || 'Default'}">${settings.anki_deck || 'Default'}</option>`;
  }
}

els.btnDeckPick.addEventListener('click', () =>
  openDeckPicker(els.deckPickerWrap, els.deckPickerSelect, els.deckPickerStatus));

els.btnDeckPickCards.addEventListener('click', () =>
  openDeckPicker(els.deckPickerWrapCards, els.deckPickerSelectCards, els.deckPickerStatusCards));

els.deckPickerSelect.addEventListener('change', () => selectDeck(els.deckPickerSelect.value));
els.deckPickerSelectCards.addEventListener('change', () => selectDeck(els.deckPickerSelectCards.value));

document.addEventListener('click', e => {
  if (!els.deckPickerWrap.contains(e.target) && e.target !== els.btnDeckPick)
    els.deckPickerWrap.classList.add('hidden');
  if (!els.deckPickerWrapCards.contains(e.target) && e.target !== els.btnDeckPickCards)
    els.deckPickerWrapCards.classList.add('hidden');
});

// ── Keyboard shortcuts ─────────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const isCtrl = e.ctrlKey || e.metaKey;

  if (e.key === 'Escape') {
    if (!els.flipModal.classList.contains('hidden')) { closeFlipModal(); return; }
    if (!views.text.classList.contains('hidden'))   { els.btnTextBack.click(); return; }
    if (!views.slider.classList.contains('hidden')) { els.btnSliderBack.click(); return; }
    if (!views.cards.classList.contains('hidden'))  { els.btnBack.click(); return; }
    if (!views.history.classList.contains('hidden')) { els.btnHistoryBack.click(); return; }
  }

  if (isCtrl && e.key === 'Enter') {
    if (!views.text.classList.contains('hidden') && !els.btnAnalyze.disabled) {
      e.preventDefault(); els.btnAnalyze.click(); return;
    }
    if (!views.slider.classList.contains('hidden')) {
      e.preventDefault(); els.btnGenerate.click(); return;
    }
  }

  if (isCtrl && e.key === 'z' && !views.cards.classList.contains('hidden')) {
    e.preventDefault(); applyUndo(); return;
  }
});

// ── Navigation ─────────────────────────────────────────────────────────────
els.btnOptions.addEventListener('click', () => chrome.runtime.openOptionsPage());
els.btnBack.addEventListener('click', () => showView('idle'));

els.btnRestart.addEventListener('click', () => {
  cards = [];
  sendSW({ type: 'CLEAR' });
  showView('idle');
  hideWarning();
  checkConnections();
});

els.btnAgain.addEventListener('click', () => {
  cards = [];
  sendSW({ type: 'CLEAR' });
  showView('idle');
  hideWarning();
  checkConnections();
});

els.btnRetry.addEventListener('click', () => {
  sendSW({ type: 'CLEAR' });
  if (lastJobText) openTextEditor(lastJobText);
  else showView('idle');
});

els.btnErrorBack.addEventListener('click', () => {
  sendSW({ type: 'CLEAR' });
  showView('idle');
  checkConnections();
});

// ── Error display ──────────────────────────────────────────────────────────
function showError(msg, raw) {
  els.errorText.textContent = msg;
  if (raw) {
    els.errorRaw.textContent = raw;
    els.errorRaw.classList.remove('hidden');
  } else {
    els.errorRaw.classList.add('hidden');
  }
  showView('error');
}

// ── Boot ───────────────────────────────────────────────────────────────────
init();
