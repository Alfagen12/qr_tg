# � ### 🚀 Функционал:
- **Универсальный QR-сканер** работает на всех устройствах
- **Автоматическая детекция** - BarcodeDetector API или ZXing fallback
- **Упрощенный интерфейс** с одной кнопкой "💰 Оплатить"
- **Двойная отправка данных**:
  - В Telegram бота через `tg.sendData()`
  - В n8n через webhook POST запрос
- **Детальное логирование** для отладки
- **Информация об устройстве** в интерфейсе
- **Кэш-контроль** с версионированием v3.3.0
- **Автоматический деплой** на Netlifyr Web App - Universal v3.3.0

## ✅ Универсальная версия - работает на ВСЕХ устройствах

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

### ✅ Универсальная поддержка:
- ✅ **iPhone/iOS** - ZXing библиотека (работает в Safari, Chrome, всех браузерах)
- ✅ **Samsung (Android)** - Native BarcodeDetector + ZXing fallback
- ✅ **Realme (Android)** - Native BarcodeDetector + ZXing fallback  
- ✅ **POCO/MIUI** - ZXing fallback + специальные настройки камеры
- ✅ **Все Android устройства** - автоматический выбор лучшего метода
- ✅ **Все браузеры** - Chrome, Safari, Firefox, Edge
- ✅ Telegram Web App интеграция
- ✅ n8n webhook получает данные
- ✅ Деплой на Netlify
- ✅ Кэш очистка в Telegram

### 🔧 Технические особенности:
- **Автодетекция устройства** - определяет iPhone, Samsung, POCO, Realme
- **Двойной механизм сканирования** - Native API + ZXing fallback
- **Оптимизированные настройки** камеры для каждого типа устройства
- **Автозагрузка библиотек** - ZXing подгружается только при необходимости

### 📝 Версии:
- v3.0.0 - Базовая интеграция
- v3.1.0-production - Готовая к использованию версия
- v3.2.0-payment - Обновленный UI с кнопкой "Оплатить"
- v3.2.1-stable - Стабильная версия (протестирована Samsung, Realme)
- v3.3.0-universal - **Универсальная версия (iPhone, Samsung, POCO, Realme, все устройства)**

---
*Создано: 29 января 2025*
*Статус: 🌍 UNIVERSAL - работает на iPhone, Samsung, POCO, Realme, всех устройствах*
