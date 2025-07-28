# Развертывание на GitHub Pages

## Пошаговая инструкция:

### 1. Создание репозитория на GitHub

1. Перейдите на [GitHub.com](https://github.com)
2. Нажмите "New repository"
3. Назовите репозиторий: `telegram-qr-scanner`
4. Отметьте "Public"
5. Нажмите "Create repository"

### 2. Загрузка файлов

В терминале выполните:

```bash
cd d:\Projects\web_qr_tg
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/telegram-qr-scanner.git
git push -u origin main
```

### 3. Настройка GitHub Pages

1. В репозитории перейдите в Settings
2. Найдите раздел "Pages"
3. В Source выберите "Deploy from a branch"
4. Выберите branch: "main"
5. Folder: "/ (root)"
6. Нажмите "Save"

### 4. Получение URL

Ваше приложение будет доступно по адресу:
`https://YOUR_USERNAME.github.io/telegram-qr-scanner/`

### 5. Обновление бота

В @BotFather обновите Web App URL на полученный адрес.

---

## Важно для работы камеры:

GitHub Pages автоматически предоставляет HTTPS, что необходимо для работы камеры и BarcodeDetector API.
