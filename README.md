# 🌍 Universal QR Scanner для Telegram

Универсальное приложение для сканирования QR-кодов, работающее на **всех устройствах** - iPhone, Samsung, POCO, Realme и других.

## ✨ Особенности:
- 📱 **Универсальная совместимость** - работает на iPhone, Samsung, POCO, Realme
- 🔄 **Двойной механизм сканирования** - Native BarcodeDetector + ZXing fallback
- 🔗 **Интеграция с n8n** - через Telegram Web App API + webhook
- 💰 **Готовый платежный интерфейс** - кнопка "Оплатить"
- 📄 **Полная документация** - пошаговые инструкции

## 🚀 Live Demo
**https://qr-scanner-tg.netlify.app**

## 📱 Поддерживаемые устройства:
- ✅ **iPhone/iOS** - Safari, Chrome (ZXing)
- ✅ **Samsung** - Native BarcodeDetector
- ✅ **Realme** - Native BarcodeDetector  
- ✅ **POCO/MIUI** - ZXing + оптимизация
- ✅ **Все Android** - автовыбор метода

## 🚀 Использование:
1. Откройте бота в Telegram
2. Нажмите кнопку меню "QR Scanner v3"
3. Разрешите доступ к камере
4. Наведите на QR-код
5. Нажмите "📤 Отправить в n8n бота"

## 🔧 Быстрая настройка:

### Telegram бот:
```
Команда: /setmenubutton
URL: https://qr-tg-alfagen12.netlify.app?v=3.0.0
```

### n8n workflow:
- � [**Полная инструкция n8n**](./N8N_SETUP_COMPLETE.md) - детальная настройка
- ⚡ [**Быстрая настройка n8n**](./N8N_QUICK_SETUP.md) - за 5 минут
- 📱 [**Настройка Telegram**](./TELEGRAM_SETUP.md) - обновление бота

## �📡 Live версия:
**https://qr-tg-alfagen12.netlify.app?v=3.0.0**

---

### 📚 Документация:
- [N8N_SETUP_COMPLETE.md](./N8N_SETUP_COMPLETE.md) - Полная настройка n8n workflow
- [N8N_QUICK_SETUP.md](./N8N_QUICK_SETUP.md) - Быстрый старт за 5 минут  
- [TELEGRAM_SETUP.md](./TELEGRAM_SETUP.md) - Настройка Telegram бота

### 🔧 Техническая информация:
- BarcodeDetector API для нативного распознавания
- Отдельные файлы для лучшей производительности
- Принудительная очистка кеша v3.0.0
- Автоматическое закрытие после отправки данных
