"""
Telegram бот для QR Scanner Web App
Требует: pip install python-telegram-bot
"""

import json
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

# Замените на ваш токен бота
BOT_TOKEN = "YOUR_BOT_TOKEN_HERE"

# URL вашего веб-приложения (замените на реальный)
WEB_APP_URL = "https://your-domain.com"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /start"""
    user = update.effective_user
    
    # Создаем Web App кнопку
    web_app = WebAppInfo(url=WEB_APP_URL)
    keyboard = [
        [InlineKeyboardButton("📷 Открыть QR Scanner", web_app=web_app)]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_message = (
        f"Привет, {user.first_name}! 👋\n\n"
        "Это QR Scanner бот. Нажмите кнопку ниже, чтобы открыть сканер:\n\n"
        "🔹 Сканируйте QR-коды и штрихкоды\n"
        "🔹 Поддержка различных форматов\n"
        "🔹 Быстрое распознавание\n"
        "🔹 Копирование и отправка результатов"
    )
    
    await update.message.reply_text(
        welcome_message,
        reply_markup=reply_markup
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /help"""
    help_text = (
        "🤖 *QR Scanner Bot - Помощь*\n\n"
        "Доступные команды:\n"
        "/start - Запустить бота и открыть сканер\n"
        "/help - Показать эту справку\n"
        "/scan - Открыть QR сканер\n\n"
        "📱 *Как использовать:*\n"
        "1. Нажмите кнопку 'Открыть QR Scanner'\n"
        "2. Разрешите доступ к камере\n"
        "3. Наведите камеру на QR-код\n"
        "4. Результат автоматически отправится в чат\n\n"
        "🔧 *Поддерживаемые форматы:*\n"
        "• QR Code\n"
        "• EAN-13, EAN-8\n"
        "• Code 128, Code 39\n"
        "• UPC-A, UPC-E\n"
        "• И другие\n\n"
        "❓ Если у вас проблемы, попробуйте:\n"
        "• Обновить браузер\n"
        "• Проверить доступ к камере\n"
        "• Использовать Chrome или Edge"
    )
    
    await update.message.reply_text(
        help_text,
        parse_mode='Markdown'
    )

async def scan_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /scan"""
    web_app = WebAppInfo(url=WEB_APP_URL)
    keyboard = [
        [InlineKeyboardButton("📷 Открыть QR Scanner", web_app=web_app)]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "📷 Нажмите кнопку для запуска QR сканера:",
        reply_markup=reply_markup
    )

async def handle_web_app_data(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик данных от Web App"""
    try:
        # Получаем данные от веб-приложения
        data = json.loads(update.effective_message.web_app_data.data)
        user = update.effective_user
        
        logging.info(f"Получены данные от {user.first_name}: {data}")
        
        if data.get('action') == 'qr_scanned':
            # Обработка отсканированного QR-кода
            value = data.get('value', '')
            format_type = data.get('format', 'Unknown')
            timestamp = data.get('timestamp', '')
            
            # Определяем тип содержимого
            content_type = detect_content_type(value)
            
            response_message = (
                f"✅ *QR-код успешно отсканирован!*\n\n"
                f"📄 *Содержимое:*\n`{value}`\n\n"
                f"🏷️ *Формат:* {format_type}\n"
                f"📂 *Тип:* {content_type}\n"
                f"🕐 *Время:* {format_timestamp(timestamp)}"
            )
            
            # Создаем кнопки для дополнительных действий
            keyboard = []
            
            if content_type == "URL":
                keyboard.append([InlineKeyboardButton("🌐 Открыть ссылку", url=value)])
            elif content_type == "Email":
                keyboard.append([InlineKeyboardButton("📧 Написать email", url=f"mailto:{value}")])
            elif content_type == "Phone":
                keyboard.append([InlineKeyboardButton("📞 Позвонить", url=f"tel:{value}")])
            
            # Кнопка для нового сканирования
            web_app = WebAppInfo(url=WEB_APP_URL)
            keyboard.append([InlineKeyboardButton("📷 Сканировать еще", web_app=web_app)])
            
            reply_markup = InlineKeyboardMarkup(keyboard) if keyboard else None
            
            await update.effective_message.reply_text(
                response_message,
                parse_mode='Markdown',
                reply_markup=reply_markup
            )
            
        elif data.get('action') == 'send_result':
            # Дополнительная обработка при отправке результата
            await update.effective_message.reply_text(
                "📋 Результат сохранен! Спасибо за использование QR Scanner."
            )
            
    except json.JSONDecodeError:
        logging.error("Ошибка декодирования JSON данных")
        await update.effective_message.reply_text(
            "❌ Ошибка обработки данных. Попробуйте еще раз."
        )
    except Exception as e:
        logging.error(f"Ошибка обработки Web App данных: {e}")
        await update.effective_message.reply_text(
            "❌ Произошла ошибка. Попробуйте еще раз."
        )

def detect_content_type(content: str) -> str:
    """Определяет тип содержимого QR-кода"""
    content = content.lower().strip()
    
    if content.startswith(('http://', 'https://', 'www.')):
        return "URL"
    elif '@' in content and '.' in content:
        return "Email"
    elif content.startswith(('tel:', '+')) or content.replace('+', '').replace('-', '').replace(' ', '').isdigit():
        return "Phone"
    elif content.startswith('wifi:'):
        return "WiFi"
    elif content.startswith('geo:'):
        return "Location"
    elif content.startswith('smsto:'):
        return "SMS"
    elif content.startswith('mailto:'):
        return "Email"
    elif len(content) == 13 and content.isdigit():
        return "EAN-13"
    elif len(content) == 8 and content.isdigit():
        return "EAN-8"
    elif content.isdigit():
        return "Number"
    else:
        return "Text"

def format_timestamp(timestamp):
    """Форматирует timestamp в читаемый вид"""
    try:
        import datetime
        dt = datetime.datetime.fromtimestamp(int(timestamp) / 1000)
        return dt.strftime("%H:%M:%S")
    except:
        return "Unknown"

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик ошибок"""
    logging.error(f"Update {update} caused error {context.error}")

def main() -> None:
    """Запуск бота"""
    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("❌ Ошибка: Установите BOT_TOKEN в коде!")
        return
    
    if WEB_APP_URL == "https://your-domain.com":
        print("⚠️  Предупреждение: Установите правильный WEB_APP_URL!")
    
    # Создаем приложение
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Добавляем обработчики
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("scan", scan_command))
    application.add_handler(MessageHandler(filters.StatusUpdate.WEB_APP_DATA, handle_web_app_data))
    
    # Добавляем обработчик ошибок
    application.add_error_handler(error_handler)
    
    print("🚀 Бот запущен! Нажмите Ctrl+C для остановки.")
    
    # Запускаем бота
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
