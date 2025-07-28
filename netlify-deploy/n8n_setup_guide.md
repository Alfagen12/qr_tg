# n8n Workflow для QR Scanner Bot

## Нода 1: Telegram Trigger
- Тип: Telegram Trigger
- Настройки:
  - Bot Token: ваш токен бота
  - Updates: выберите "message" и "web_app_data"

## Нода 2: Switch (проверка типа данных)
- Тип: Switch
- Условия:
  - Режим: "Expression"
  - Value 1: `{{ $json.web_app_data ? 'web_app' : 'message' }}`
  - Route 1: "web_app" 
  - Route 2: "message"

## Нода 3A: Обработка Web App данных
- Тип: Function
- Код:
```javascript
// Получаем данные от Web App
const webAppData = $input.first().json.web_app_data;
const chatId = $input.first().json.from.id;

let qrText = '';

if (webAppData) {
  // Проверяем, это JSON или простой текст
  try {
    const parsedData = JSON.parse(webAppData.data);
    qrText = parsedData.text || parsedData.value || webAppData.data;
  } catch {
    // Если не JSON, то это простой текст
    qrText = webAppData.data;
  }
}

return {
  chatId: chatId,
  qrText: qrText,
  originalData: webAppData
};
```

## Нода 4: Отправка ответа
- Тип: Telegram
- Operation: Send Message
- Chat ID: `{{ $json.chatId }}`
- Text: `✅ QR-код получен: {{ $json.qrText }}`

## Нода 5: Дальнейшая обработка QR-кода
- Здесь вы можете добавить логику для:
  - Сохранения в базу данных
  - Проверки URL
  - Отправки в другие системы
  - И т.д.
