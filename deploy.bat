@echo off
echo 🚀 Развертывание QR Scanner Bot...

REM Проверяем наличие Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не найден. Установите Python 3.8+
    pause
    exit /b 1
)

REM Создаем виртуальное окружение
if not exist "venv" (
    echo 📦 Создание виртуального окружения...
    python -m venv venv
)

REM Активируем виртуальное окружение
echo 🔄 Активация виртуального окружения...
call venv\Scripts\activate.bat

REM Устанавливаем зависимости
echo 📥 Установка зависимостей...
pip install -r requirements.txt

REM Проверяем конфигурацию
if not exist ".env" (
    echo ⚙️  Создание файла конфигурации...
    copy .env.example .env
    echo ❗ Отредактируйте файл .env с вашими настройками!
)

echo.
echo ✅ Развертывание завершено!
echo.
echo 📝 Следующие шаги:
echo 1. Отредактируйте файл .env с вашим BOT_TOKEN и WEB_APP_URL
echo 2. Запустите веб-сервер: npm run dev
echo 3. Запустите бота: python telegram_bot.py
echo.
echo 🌐 Для тестирования локально используйте ngrok:
echo    ngrok http 3000
echo.
pause
