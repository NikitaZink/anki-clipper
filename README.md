# Anki Clipper — расширение для браузера

Создавай карточки Anki из буфера обмена с помощью AI (Groq или Ollama).

## Требования

| Компонент | Что нужно |
|---|---|
| Браузер | Yandex Browser / Chrome / любой Chromium |
| Anki | [anki.tenderleaf.org](https://apps.ankiweb.net/) |
| AnkiConnect | Плагин с кодом **2055492159** |
| AI | Groq API-ключ **или** локальная Ollama |

## Установка расширения

1. Распакуй архив или склонируй репозиторий в любую папку.
2. Открой браузер → `browser://extensions` (или `chrome://extensions`).
3. Включи **Режим разработчика** (переключатель в правом верхнем углу).
4. Нажми **Загрузить распакованное расширение** и выбери папку проекта (ту, где лежит `manifest.json`).
5. Иконка расширения появится в панели.

## Настройка

### Groq (облачный AI)

1. Зайди на [console.groq.com](https://console.groq.com) → API Keys → создай ключ.
2. Открой настройки расширения (иконка шестерёнки в попапе).
3. Выбери провайдер **Groq**, вставь ключ, сохрани.

### Ollama (локальный AI)

1. Установи [Ollama](https://ollama.com) и скачай модель:
   ```
   ollama pull qwen2.5:14b
   ```

2. **Обязательно**: разреши запросы от браузерного расширения, задав переменную окружения `OLLAMA_ORIGINS`.

   **Windows — через PowerShell (от администратора), затем перезапусти Ollama:**
   ```powershell
   [System.Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "Machine")
   ```

   **Или вручную:** Панель управления → Система → Дополнительные параметры системы → Переменные среды → Создать системную переменную:
   - Имя: `OLLAMA_ORIGINS`
   - Значение: `*`

   Без этого Ollama вернёт **403 Forbidden** на все запросы от расширения.

3. Запусти Ollama (по умолчанию слушает `http://localhost:11434`).
4. В настройках расширения выбери **Ollama**, при необходимости измени адрес и модель.

### AnkiConnect

1. Открой Anki → Инструменты → Дополнения → Получить дополнения.
2. Введи код: `2055492155` (или `2055492159` — проверь на сайте).
3. Перезапусти Anki.
4. **Обязательно**: настрой CORS для браузерного расширения.
   Anki → Инструменты → Дополнения → выбери AnkiConnect → **Настройка** и добавь `"*"` в `webCorsOriginList`:
   ```json
   {
       "webCorsOriginList": ["http://localhost", "*"]
   }
   ```
   Без этого запросы от расширения будут блокироваться браузером.
5. Перезапусти Anki после изменения настроек.
6. Anki должна быть запущена при использовании расширения.

### Автозапуск Anki при входе в систему

Чтобы AnkiConnect всегда был доступен без ручного запуска Anki, настройте автозапуск при старте системы.

#### Windows — Планировщик задач

**Вручную:**
1. Открой «Планировщик заданий» (`taskschd.msc`)
2. Действие → Создать задачу
3. Вкладка **Триггеры** → Создать → При входе в систему
4. Вкладка **Действия** → Создать → Программа: путь к `anki.exe`
5. Вкладка **Общие** → поставь галочку **«Запускать с наивысшими правами»**

**Автоматически через PowerShell (запусти от имени администратора):**
```powershell
# Путь к Anki — замени, если установлена в другое место
$ankiExe = "$env:LOCALAPPDATA\Programs\Anki\anki.exe"
# Альтернативный путь (системная установка): "C:\Program Files\Anki\anki.exe"

$action   = New-ScheduledTaskAction -Execute $ankiExe
$trigger  = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit 0 -AllowStartIfOnBatteries
Register-ScheduledTask -TaskName "AnkiAutostart" `
    -Action $action -Trigger $trigger -Settings $settings `
    -RunLevel Highest -Force
```

**Удалить задачу:**
```powershell
Unregister-ScheduledTask -TaskName "AnkiAutostart" -Confirm:$false
```

---

#### macOS — Объекты входа

**Вручную:**
Системные настройки → Основные → Объекты входа → нажми «+» и выбери `Anki.app`

**Автоматически через терминал:**
```bash
osascript -e 'tell application "System Events" to make login item at end with properties {path:"/Applications/Anki.app", hidden:false}'
```

Параметр `hidden:false` означает, что Anki откроется в обычном режиме (AnkiConnect работает всегда — окно можно свернуть вручную).

**Удалить из автозапуска:**
```bash
osascript -e 'tell application "System Events" to delete login item "Anki"'
```

---

> **Примечание:** Anki не поддерживает режим без окна (`--no-gui`). При автозапуске её главное окно откроется как обычно — можно сразу свернуть или убрать в трей. AnkiConnect работает в фоне независимо от видимости окна.

## Использование

1. Выдели и скопируй (Ctrl+C) текст на любой странице.
2. Нажми на иконку расширения.
3. Нажми **«Взять из буфера обмена»**.
4. Дождись анализа — появится список карточек.
5. Отредактируй или удали ненужные карточки.
6. Нажми **«Добавить выбранные»** — карточки уйдут в Anki.

## Структура файлов

```
anki-clipper/
├── manifest.json
├── background/
│   └── service-worker.js
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── options/
│   ├── options.html
│   └── options.js
└── README.md
```

## Устранение неполадок

| Проблема | Решение |
|---|---|
| «Не удалось прочитать буфер обмена» | Разреши доступ к буферу обмена в настройках расширения |
| «Groq API вернул 401» | Проверь API-ключ в настройках |
| «Не удалось подключиться к AnkiConnect» | Убедись, что Anki запущена, плагин установлен, и `"*"` добавлен в `webCorsOriginList`. Настрой автозапуск Anki (см. раздел выше) |
| «Ollama вернула 403 Forbidden» | Задай `OLLAMA_ORIGINS=*` в системных переменных окружения и перезапусти Ollama |
| «Не удалось подключиться к Ollama» | Убедись, что Ollama запущена (`ollama serve`) |
| AI вернул пустой массив | Текст слишком короткий или без полезного содержания |
