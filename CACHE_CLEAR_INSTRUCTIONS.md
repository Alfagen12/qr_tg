# 🔄 Инструкция по обновлению кеша Telegram Web App

## ✅ Изменения применены (v2.1.0)

Все файлы обновлены с принудительной очисткой кеша:
- Добавлены мета-теги для запрета кеширования
- Версионность всех ресурсов (?v=2.1.0) 
- Обновлен заголовок на "QR Scanner v2"
- Timestamp загрузки в консоли браузера

---

## 📱 **ОБЯЗАТЕЛЬНО: Обновите URL в @BotFather**

### Шаг 1: Найдите @BotFather в Telegram

### Шаг 2: Обновите Web App URL
```
Отправьте: /setmenubutton
Выберите: вашего бота
```

### Шаг 3: Используйте НОВЫЙ URL с версией
```
Старый URL: https://qr-tg-alfagen12.netlify.app
Новый URL: https://qr-tg-alfagen12.netlify.app?v=2.1.0
```

**ВАЖНО:** Параметр `?v=2.1.0` заставит Telegram загрузить новую версию!

---

## 🎯 **Что увидят пользователи после обновления:**

### ✅ Новый интерфейс:
- Заголовок: "QR Scanner v2" 
- При сканировании: "✅ QR-код распознан"
- Одна кнопка: "📤 Отправить в n8n бота"
- Убраны все лишние кнопки и инструкции

### 🔍 Как проверить, что обновление работает:
1. Откройте бота в Telegram
2. Запустите QR сканер
3. В консоли браузера должно быть: `🚀 QR Scanner v2.1.0 загружен!`
4. Заголовок должен показывать "QR Scanner v2"

---

## 🆘 **Если кеш все еще не обновился:**

### Для пользователей:
1. Полностью закройте Telegram
2. Очистите кеш приложения Telegram
3. Перезапустите Telegram  
4. Откройте бота заново

### Альтернативный URL (если проблема остается):
```
https://qr-tg-alfagen12.netlify.app?v=2.1.0&force=true
```

---

## 📋 **Технические детали:**

### Добавленные мета-теги:
```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="version" content="2.1.0">
<meta name="build-time" content="2025-01-28T18:31:00Z">
```

### Версионность файлов:
```html
<script src="https://telegram.org/js/telegram-web-app.js?v=2.1.0"></script>
<link rel="stylesheet" href="styles.css?v=2.1.0">
<script src="script.js?v=2.1.0"></script>
```

---

## 🔗 **Ссылки:**

- **GitHub:** https://github.com/Alfagen12/qr_tg
- **Live версия:** https://qr-tg-alfagen12.netlify.app?v=2.1.0
- **n8n Setup:** [n8n_setup_guide.md](./n8n_setup_guide.md)

---

## ✨ **Результат:**

После обновления URL в @BotFather пользователи увидят чистый интерфейс:
- Простая надпись "QR-код распознан" 
- Одна кнопка для отправки в n8n
- Никаких лишних элементов интерфейса

**Готово к использованию!** 🎉
