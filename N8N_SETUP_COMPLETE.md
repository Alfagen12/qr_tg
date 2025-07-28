# 🔧 Настройка n8n для QR Scanner Web App

Пошаговая инструкция по настройке n8n workflow для получения данных от QR сканера через Telegram Web App.

---

## 📋 **Требования:**

- Работающий n8n инстанс
- Telegram бот с токеном
- QR Scanner Web App развернут и настроен в @BotFather

---

## 🚀 **Создание Workflow в n8n:**

### Шаг 1: Создайте новый Workflow
1. Откройте n8n
2. Нажмите **"New workflow"**
3. Назовите: `QR Scanner Handler`

### Шаг 2: Добавьте Telegram Trigger

#### Нода: **Telegram Trigger**
```
1. Перетащите ноду "Telegram Trigger" на канвас
2. Настройте параметры:
   - Credential: создайте новую или выберите существующую
   - Bot Token: ваш токен бота от @BotFather
   - Updates: выберите следующие типы:
     ☑️ message
     ☑️ web_app_data
     ☑️ callback_query (опционально)
```

#### Создание Credential для Telegram:
```
1. Нажмите "Create New Credential"
2. Выберите "Telegram Bot API"
3. Введите:
   - Access Token: токен от @BotFather (например: 123456789:AABBccdd...)
4. Нажмите "Save"
```

---

## 🔀 **Обработка данных:**

### Шаг 3: Добавьте Switch Node

#### Нода: **Switch**
```
Назначение: Разделение обычных сообщений и Web App данных

Настройки:
- Mode: "Expression"
- Value 1: {{ $json.web_app_data ? 'web_app' : 'message' }}

Routes:
- Route 1: "web_app" (для данных от QR сканера)
- Route 2: "message" (для обычных сообщений)
```

### Шаг 4A: Обработка Web App данных (QR коды)

#### Нода: **Function** (после route "web_app")
```javascript
// Извлекаем данные QR сканера
const webAppData = $input.first().json.web_app_data;
const chatId = $input.first().json.from.id;
const userId = $input.first().json.from.id;
const userName = $input.first().json.from.first_name || 'Unknown';
const userUsername = $input.first().json.from.username || 'no_username';

let qrText = '';
let qrData = {};

if (webAppData && webAppData.data) {
  try {
    // Пробуем распарсить как JSON (если отправляется сложный объект)
    qrData = JSON.parse(webAppData.data);
    qrText = qrData.text || qrData.value || qrData.qrText || webAppData.data;
  } catch {
    // Если не JSON, то это простой текст QR-кода
    qrText = webAppData.data;
  }
}

// Возвращаем обработанные данные
return {
  chatId: chatId,
  userId: userId,
  userName: userName,
  userUsername: userUsername,
  qrText: qrText,
  qrData: qrData,
  originalWebAppData: webAppData,
  timestamp: new Date().toISOString(),
  source: 'qr_scanner_webapp'
};
```

### Шаг 4B: Обработка обычных сообщений

#### Нода: **Function** (после route "message")
```javascript
// Обработка обычных текстовых сообщений
const message = $input.first().json.message;
const chatId = message.chat.id;
const userId = message.from.id;
const userName = message.from.first_name || 'Unknown';
const messageText = message.text || '';

return {
  chatId: chatId,
  userId: userId,
  userName: userName,
  messageText: messageText,
  timestamp: new Date().toISOString(),
  source: 'regular_message'
};
```

---

## 📤 **Отправка ответов:**

### Шаг 5A: Ответ на QR-код

#### Нода: **Telegram** (Send Message)
```
Подключите после Function ноды для web_app

Настройки:
- Operation: "Send Message"
- Chat ID: {{ $json.chatId }}
- Text: ✅ QR-код получен: {{ $json.qrText }}

Дополнительные опции:
- Parse Mode: "HTML" или "Markdown"
- Disable Notification: false
```

#### Альтернативный ответ с кнопками:
```
Text: ✅ QR-код получен: {{ $json.qrText }}

Что дальше?

Reply Markup:
{
  "inline_keyboard": [
    [
      {"text": "🔍 Обработать", "callback_data": "process_{{ $json.qrText }}"},
      {"text": "💾 Сохранить", "callback_data": "save_{{ $json.qrText }}"}
    ],
    [
      {"text": "📊 Статистика", "callback_data": "stats"}
    ]
  ]
}
```

### Шаг 5B: Ответ на обычное сообщение

#### Нода: **Telegram** (Send Message)
```
Chat ID: {{ $json.chatId }}
Text: 👋 Привет! Используйте QR Scanner для сканирования кодов.

Нажмите кнопку меню ниже, чтобы открыть сканер.
```

---

## 💾 **Сохранение данных (опционально):**

### Шаг 6: Добавьте базу данных

#### Вариант A: Google Sheets
```
Нода: "Google Sheets"
Operation: "Append"

Данные для записи:
- Timestamp: {{ $json.timestamp }}
- User ID: {{ $json.userId }}
- User Name: {{ $json.userName }}
- QR Text: {{ $json.qrText }}
- Source: {{ $json.source }}
```

#### Вариант B: MySQL/PostgreSQL
```
Нода: "MySQL" или "Postgres"
Operation: "Insert"

SQL Query:
INSERT INTO qr_scans (user_id, user_name, qr_text, timestamp, source)
VALUES ({{ $json.userId }}, '{{ $json.userName }}', '{{ $json.qrText }}', '{{ $json.timestamp }}', '{{ $json.source }}');
```

---

## 🔔 **Уведомления администратору:**

### Шаг 7: Уведомление в админ чат

#### Нода: **Telegram** (Send Message)
```
Chat ID: YOUR_ADMIN_CHAT_ID (ваш ID или ID админ группы)
Text: 🔔 Новый QR-код отсканирован!

👤 Пользователь: {{ $json.userName }} (@{{ $json.userUsername }})
🆔 User ID: {{ $json.userId }}
📱 QR текст: {{ $json.qrText }}
⏰ Время: {{ $json.timestamp }}

Parse Mode: "HTML"
```

---

## 🧪 **Тестирование Workflow:**

### Шаг 8: Активация и тест

1. **Сохраните workflow:** Нажмите Ctrl+S
2. **Активируйте:** Переключите тумблер "Active" в ON
3. **Протестируйте:**
   - Откройте бота в Telegram
   - Нажмите кнопку "QR Scanner v3"
   - Отсканируйте любой QR-код
   - Нажмите "📤 Отправить в n8n бота"
   - Проверьте выполнение в n8n

### Шаг 9: Отладка

В n8n перейдите в **"Executions"** чтобы видеть:
- Входящие данные от Telegram
- Ошибки выполнения
- Логи каждой ноды

---

## 📊 **Структура данных:**

### Что приходит от QR Scanner:
```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 123,
    "from": {
      "id": 987654321,
      "is_bot": false,
      "first_name": "John",
      "username": "john_doe"
    },
    "chat": {
      "id": 987654321,
      "type": "private"
    },
    "date": 1642668123,
    "web_app_data": {
      "data": "https://example.com/qr-content",
      "button_text": "QR Scanner v3"
    }
  }
}
```

### Что получаете после обработки:
```json
{
  "chatId": 987654321,
  "userId": 987654321,
  "userName": "John",
  "userUsername": "john_doe",
  "qrText": "https://example.com/qr-content",
  "timestamp": "2025-01-28T19:00:00.000Z",
  "source": "qr_scanner_webapp"
}
```

---

## ⚙️ **Дополнительные возможности:**

### Обработка разных типов QR-кодов:

#### Function для классификации QR-кодов:
```javascript
const qrText = $json.qrText;
let qrType = 'unknown';
let processedData = {};

// Определяем тип QR-кода
if (qrText.startsWith('http')) {
  qrType = 'url';
  processedData.url = qrText;
} else if (qrText.startsWith('mailto:')) {
  qrType = 'email';
  processedData.email = qrText.replace('mailto:', '');
} else if (qrText.startsWith('tel:')) {
  qrType = 'phone';
  processedData.phone = qrText.replace('tel:', '');
} else if (qrText.includes('WIFI:')) {
  qrType = 'wifi';
  // Парсинг WiFi QR-кода
} else if (/^\d+$/.test(qrText)) {
  qrType = 'number';
  processedData.number = parseInt(qrText);
} else {
  qrType = 'text';
  processedData.text = qrText;
}

return {
  ...($json),
  qrType: qrType,
  processedData: processedData
};
```

---

## 🎯 **Готовый шаблон workflow:**

Импортируйте этот JSON в n8n для быстрого старта:

```json
{
  "name": "QR Scanner Handler",
  "nodes": [
    {
      "parameters": {
        "updates": ["message", "web_app_data"]
      },
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1,
      "position": [240, 300]
    },
    {
      "parameters": {
        "mode": "expression",
        "output": "web_app",
        "expression": "={{ $json.web_app_data ? 'web_app' : 'message' }}"
      },
      "name": "Route Data",
      "type": "n8n-nodes-base.switch",
      "typeVersion": 1,
      "position": [460, 300]
    }
  ],
  "connections": {
    "Telegram Trigger": {
      "main": [["Route Data"]]
    }
  }
}
```

---

## ✅ **Результат:**

После настройки у вас будет:
- ✅ Автоматический прием QR-кодов от Web App
- ✅ Обработка и классификация данных
- ✅ Ответы пользователям
- ✅ Сохранение в базу данных
- ✅ Уведомления администратору

**Готово к производственному использованию!** 🚀
