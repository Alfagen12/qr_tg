# 🔄 Обновление Web App URL в Telegram

## ✅ Рабочая версия восстановлена!

Восстановлена проверенная рабочая версия приложения:
- Функциональное сканирование QR-кодов через BarcodeDetector API
- Упрощенный интерфейс с одной кнопкой отправки в n8n
- Отдельные файлы для лучшей производительности и отладки
- Версия v3.0.0 с принудительной очисткой кеша

---

## 📱 **ИНСТРУКЦИЯ: Обновите URL в @BotFather**

### Шаг 1: Откройте @BotFather
Найдите @BotFather в Telegram

### Шаг 2: Обновите Web App
```
1. Отправьте: /mybots
2. Выберите вашего бота
3. Нажмите: "Bot Settings"
4. Выберите: "Menu Button"
5. Нажмите: "Configure menu button"
```

### Шаг 3: Установите новый URL с версией
```
Название: QR Scanner v3
URL: https://qr-tg-alfagen12.netlify.app?v=3.0.0
```

### Альтернативный способ:
```
1. Отправьте: /setmenubutton
2. Выберите вашего бота
3. Введите название: QR Scanner v3
4. Введите URL: https://qr-tg-alfagen12.netlify.app?v=3.0.0
```

---

## 🎯 **Как это работает:**

### При использовании:
1. Пользователь открывает бота в Telegram
2. Нажимает кнопку "QR Scanner" (меню бота)
3. Открывается Web App с камерой
4. Сканирует QR-код
5. Нажимает "📤 Отправить в n8n бота"
6. Данные передаются в ваш n8n workflow

### Что получает n8n:
- Простой текст QR-кода через `sendData()`
- Данные приходят в webhook как `web_app_data`

---

## 🔧 **Для настройки n8n workflow:**

### Нода 1: Telegram Trigger
```
- Bot Token: ваш токен
- Updates: ☑️ web_app_data
```

### Нода 2: Function (обработка данных)
```javascript
const qrText = $input.first().json.web_app_data.data;
const chatId = $input.first().json.from.id;

return {
  chatId: chatId,
  qrText: qrText
};
```

### Нода 3: Telegram Send Message
```
- Chat ID: {{ $json.chatId }}
- Text: ✅ QR-код получен: {{ $json.qrText }}
```

---

## 🌐 **Ссылки:**

- **GitHub:** https://github.com/Alfagen12/qr_tg
- **Live приложение:** https://qr-tg-alfagen12.netlify.app?v=3.0.0
- **Для тестирования в браузере:** https://qr-tg-alfagen12.netlify.app
- **Локальное тестирование:** http://localhost:8080

---

## ✨ **Готово к использованию!**

После обновления URL в @BotFather ваши пользователи смогут:
- Сканировать QR-коды через Telegram
- Автоматически отправлять результаты в n8n
- Получать подтверждения от бота

**Простое и надежное решение!** 🚀
