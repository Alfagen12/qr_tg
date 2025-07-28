#!/bin/bash

# Скрипт быстрого развертывания QR Scanner Bot

echo "🚀 Развертывание QR Scanner Bot..."

# Проверяем наличие Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 не найден. Установите Python 3.8+"
    exit 1
fi

# Создаем виртуальное окружение
if [ ! -d "venv" ]; then
    echo "📦 Создание виртуального окружения..."
    python3 -m venv venv
fi

# Активируем виртуальное окружение
echo "🔄 Активация виртуального окружения..."
source venv/bin/activate

# Устанавливаем зависимости
echo "📥 Установка зависимостей..."
pip install -r requirements.txt

# Проверяем конфигурацию
if [ ! -f ".env" ]; then
    echo "⚙️  Создание файла конфигурации..."
    cp .env.example .env
    echo "❗ Отредактируйте файл .env с вашими настройками!"
fi

echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "📝 Следующие шаги:"
echo "1. Отредактируйте файл .env с вашим BOT_TOKEN и WEB_APP_URL"
echo "2. Запустите веб-сервер: npm run dev"
echo "3. Запустите бота: python telegram_bot.py"
echo ""
echo "🌐 Для тестирования локально используйте ngrok:"
echo "   ngrok http 3000"
echo ""
