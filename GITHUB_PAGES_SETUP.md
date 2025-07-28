# 🔧 Настройка GitHub Pages

## Пошаговая инструкция:

### 1. Откройте настройки репозитория
Перейдите по ссылке: https://github.com/Alfagen12/qr_tg/settings

### 2. Найдите раздел Pages
- В левом меню найдите пункт **"Pages"**
- Нажмите на него

### 3. Настройте источник
В разделе **"Source"**:
- Выберите **"GitHub Actions"** (НЕ "Deploy from a branch")
- Это позволит использовать наш workflow файл

### 4. Сохраните настройки
- Нажмите **"Save"** если кнопка появилась
- Или настройки сохранятся автоматически

### 5. Дождитесь развертывания
- Перейдите во вкладку **"Actions"**: https://github.com/Alfagen12/qr_tg/actions
- Дождитесь завершения workflow (зеленая галочка)
- Обычно это занимает 1-3 минуты

### 6. Проверьте результат
После успешного развертывания ваше приложение будет доступно по адресу:
**https://alfagen12.github.io/qr_tg/**

---

## Если Pages все еще не работает:

### Альтернативный способ - Deploy from branch:

1. В настройках Pages выберите **"Deploy from a branch"**
2. Выберите branch: **"main"**
3. Folder: **"/ (root)"**
4. Нажмите **"Save"**

### Проверка прав доступа:

1. Убедитесь, что репозиторий **публичный**
2. В Settings > Actions > General > Workflow permissions:
   - Выберите **"Read and write permissions"**
   - Поставьте галочку **"Allow GitHub Actions to create and approve pull requests"**

---

## 🚀 После настройки Pages:

Ваше приложение будет работать по адресу:
**https://alfagen12.github.io/qr_tg/**

Используйте этот URL для настройки Telegram бота!
