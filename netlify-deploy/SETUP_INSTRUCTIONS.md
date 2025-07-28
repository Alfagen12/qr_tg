# 📋 Пошаговая настройка GitHub Pages

## ⚡ Быстрое решение (рекомендуется):

### 1. Перейдите в настройки репозитория:
🔗 **https://github.com/Alfagen12/qr_tg/settings/pages**

### 2. В разделе "Source":
- Выберите **"Deploy from a branch"**
- Branch: **"gh-pages"** 
- Folder: **"/ (root)"**
- Нажмите **"Save"**

### 3. Дождитесь развертывания:
- Через 1-2 минуты проверьте: **https://alfagen12.github.io/qr_tg/**

---

## 🔧 Если первый способ не работает:

### Альтернатива 1 - Использовать main ветку:
1. В настройках Pages выберите:
   - Source: **"Deploy from a branch"**
   - Branch: **"main"**
   - Folder: **"/ (root)"**

### Альтернатива 2 - Проверить права доступа:
1. Перейдите в Settings > Actions > General
2. Workflow permissions: **"Read and write permissions"**
3. Поставьте галочку: **"Allow GitHub Actions to create and approve pull requests"**

### Альтернатива 3 - Ручное развертывание:
Если ничего не работает, можно использовать другие хостинги:
- **Netlify**: просто перетащите файлы на netlify.com
- **Vercel**: подключите GitHub репозиторий на vercel.com

---

## ✅ Результат:

После настройки ваше приложение будет доступно по адресу:
**https://alfagen12.github.io/qr_tg/**

## 🤖 Настройка Telegram бота:

После того как сайт заработает:
1. Найдите @BotFather в Telegram
2. Отправьте `/setmenubutton`
3. Выберите вашего бота
4. Введите: **"📷 QR Scanner"**
5. URL: **https://alfagen12.github.io/qr_tg/**

---

**Попробуйте первый способ - он должен сработать!**
