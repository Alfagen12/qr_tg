# Альтернативная настройка через HTTP Webhook

## Если основной способ не работает, используйте HTTP Request

### 1. Добавьте в Web App отправку через HTTP:

```javascript
// В script.js добавьте альтернативный метод отправки
async function sendToN8NWebhook(qrText) {
    const webhookUrl = 'https://your-n8n-instance.app.n8n.cloud/webhook/qr-scanner';
    
    const data = {
        qr_text: qrText,
        timestamp: new Date().toISOString(),
        user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
        username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username
    };
    
    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            console.log('Data sent to n8n successfully');
            return true;
        }
    } catch (error) {
        console.error('Error sending to n8n:', error);
    }
    return false;
}
```

### 2. В n8n создайте HTTP Webhook:

- **Нода:** Webhook
- **HTTP Method:** POST
- **Path:** qr-scanner
- **Response Mode:** Respond Immediately

### 3. Обработка данных:

```javascript
// Function нода в n8n
const qrText = $json.body.qr_text;
const userId = $json.body.user_id;
const timestamp = $json.body.timestamp;

// Отправляем пользователю подтверждение через Telegram API
return {
    chatId: userId,
    message: `✅ QR-код получен: ${qrText}`,
    qrData: qrText
};
```
