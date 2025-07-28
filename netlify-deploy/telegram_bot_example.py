"""
Python код для создания кнопки Web App в Telegram боте
Используйте этот код если у вас Python бот, или аналогичный в n8n
"""

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
import telegram

def webAppKeyboard():
    """Создает клавиатуру с кнопкой Web App"""
    keyboard = [
        [InlineKeyboardButton(
            "📱 QR Scanner", 
            web_app=WebAppInfo(url="https://your-netlify-url.netlify.app")
        )]
    ]
    return InlineKeyboardMarkup(keyboard)

# Пример использования в функции отправки сообщения
def send_qr_scanner_button(bot, chat_id):
    bot.send_message(
        chat_id=chat_id,
        text='🔍 Нажмите кнопку ниже для сканирования QR-кода:',
        reply_markup=webAppKeyboard()
    )

# Для n8n используйте аналогичную структуру в ноде "Telegram"
n8n_reply_markup = {
    "inline_keyboard": [
        [
            {
                "text": "📱 QR Scanner",
                "web_app": {
                    "url": "https://your-netlify-url.netlify.app"
                }
            }
        ]
    ]
}
