# 🎉 QR Scanner Web App - Stable v3.2.1

## ✅ Стабильная версия - протестирована на реальных устройствах

### 🚀 Функционал:
- **QR-сканер** с нативным BarcodeDetector API
- **Упрощенный интерфейс** с одной кнопкой "� Оплатить"
- **Двойная отправка данных**:
  - В Telegram бота через `tg.sendData()`
  - В n8n через webhook POST запрос
- **Детальное логирование** для отладки
- **Кэш-контроль** с версионированием v3.0.0
- **Автоматический деплой** на Netlify

### 🔗 Ссылки:
- **Live URL**: https://qr-scanner-tg.netlify.app
- **GitHub**: https://github.com/Alfagen12/qr_tg
- **n8n Webhook**: https://codanetn8n.ru/webhook/04a25c25-4aa8-4688-b395-a1681641552b

### 🛠️ Настройки n8n webhook:
```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "04a25c25-4aa8-4688-b395-a1681641552b",
    "options": {}
  },
  "type": "n8n-nodes-base.webhook",
  "typeVersion": 2
}
```

### 📊 Структура данных:
```json
{
  "qr_text": "содержимое QR-кода",
  "format": "qr_code", 
  "timestamp": "2025-01-28T10:00:00.000Z",
  "user_id": 123456789,
  "username": "username",
  "first_name": "Имя"
}
```

### 🔄 Как использовать:
1. Откройте Web App в Telegram
2. Отсканируйте QR-код
3. Нажмите "� Оплатить"
4. Данные автоматически отправятся в n8n workflow

### ✅ Протестировано:
- ✅ **Samsung (Android)** - QR сканирование работает отлично
- ✅ **Realme (Android)** - QR сканирование работает отлично
- ✅ Telegram Web App интеграция
- ✅ n8n webhook получает данные
- ✅ Деплой на Netlify
- ✅ Кэш очистка в Telegram

### ⚠️ Известные ограничения:
- ❌ **iPhone/iOS** - Safari не поддерживает BarcodeDetector API
- ⚠️ **POCO/MIUI** - возможны проблемы с разрешениями камеры
- ⚠️ **Старые устройства** - требуется современный браузер

### 📝 Версии:
- v3.0.0 - Базовая интеграция
- v3.1.0-production - Готовая к использованию версия
- v3.2.0-payment - Обновленный UI с кнопкой "Оплатить"
- v3.2.1-stable - **Стабильная версия (протестирована Samsung, Realme)**

---
*Создано: 29 января 2025*
*Статус: ✅ STABLE - протестировано Samsung, Realme*
