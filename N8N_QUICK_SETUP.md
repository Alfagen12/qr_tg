# 📊 Схема n8n Workflow для QR Scanner

## 🔄 **Визуальная схема:**

```
[Telegram Trigger] 
       ↓
   [Switch Node]
    ↙      ↘
web_app   message
   ↓         ↓
[Process QR] [Handle Message]
   ↓         ↓
[Send Reply] [Send Help]
   ↓
[Save to DB] (опционально)
   ↓
[Notify Admin] (опционально)
```

---

## 🎯 **Быстрая настройка (5 минут):**

### 1. Telegram Trigger
- Updates: `message`, `web_app_data`
- Bot Token: ваш токен

### 2. Switch Node
- Expression: `{{ $json.web_app_data ? 'web_app' : 'message' }}`

### 3. Function (Web App route)
```javascript
const qrText = $input.first().json.web_app_data.data;
const chatId = $input.first().json.from.id;
const userName = $input.first().json.from.first_name;

return {
  chatId,
  userName,
  qrText,
  timestamp: new Date().toISOString()
};
```

### 4. Telegram Send Message
- Chat ID: `{{ $json.chatId }}`
- Text: `✅ QR получен: {{ $json.qrText }}`

---

## 🔧 **Минимальный рабочий вариант:**

Если нужен только базовый функционал:

1. **Telegram Trigger** (web_app_data)
2. **Telegram Send Message** с текстом: 
   ```
   ✅ QR-код: {{ $json.web_app_data.data }}
   ```

**Готово!** Этого достаточно для базовой работы.

---

## 📱 **Тестирование:**

1. Активируйте workflow в n8n
2. Откройте бота в Telegram
3. Нажмите "QR Scanner v3"
4. Отсканируйте QR-код
5. Нажмите "📤 Отправить в n8n бота"
6. Получите ответ от бота

**Время настройки: 5-10 минут** ⚡
