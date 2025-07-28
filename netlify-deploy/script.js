// QR Scanner v2.1.0 - Build: 2025-01-28T18:31:00Z
console.log('🚀 QR Scanner v2.1.0 загружен!', new Date().toISOString());

class QRScanner {
    constructor() {
        this.video = document.getElementById('videoElement');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stream = null;
        this.isScanning = false;
        this.cameras = [];
        this.currentCameraIndex = 0;
        this.scanInterval = null;
        
        // Элементы интерфейса
        this.startBtn = document.getElementById('startScan');
        this.stopBtn = document.getElementById('stopScan');
        this.switchBtn = document.getElementById('switchCamera');
        this.checkPermissionsBtn = document.getElementById('checkPermissions');
        this.requestPermissionsBtn = document.getElementById('requestPermissions');
        this.resultDiv = document.getElementById('result');
        this.resultText = document.getElementById('resultText');
        this.statusDiv = document.getElementById('status');
        this.errorDiv = document.getElementById('error');
        this.copyBtn = document.getElementById('copyResult');
        this.shareBtn = document.getElementById('shareResult');
        this.sendToBotBtn = document.getElementById('sendToBot');
        
        this.initEventListeners();
        this.initTelegram();
        this.checkBarcodeDetectorSupport();
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startScanning());
        this.stopBtn.addEventListener('click', () => this.stopScanning());
        this.switchBtn.addEventListener('click', () => this.switchCamera());
        this.checkPermissionsBtn.addEventListener('click', () => this.checkCameraPermissions());
        this.requestPermissionsBtn.addEventListener('click', () => this.requestCameraPermissions());
        this.copyBtn.addEventListener('click', () => this.copyResult());
        this.shareBtn.addEventListener('click', () => this.shareResult());
        this.sendToBotBtn.addEventListener('click', () => this.sendResultToBot());
    }
    
    initTelegram() {
        // Инициализация Telegram Web App
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            
            // Настройка темы
            document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
            document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#707579');
            document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
            document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
            document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color || '#f1f1f1');
        }
    }
    
    async requestCameraPermissions() {
        try {
            this.showStatus('Запрос доступа к камере...');
            
            // Простой запрос доступа к камере
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: 640,
                    height: 480
                } 
            });
            
            // Если получили доступ, сразу останавливаем поток
            stream.getTracks().forEach(track => track.stop());
            
            this.showStatus('✅ Доступ к камере получен! Теперь можно начинать сканирование.');
            this.hideError();
            
        } catch (error) {
            console.error('Ошибка запроса разрешений:', error);
            
            if (error.name === 'NotAllowedError') {
                this.showError('❌ Доступ к камере отклонен. Инструкция для разрешения:\n\n📱 На мобильном: Настройки Telegram → Конфиденциальность → Камера → Разрешить\n\n💻 В браузере: нажмите на иконку 🔒 или 📷 рядом с адресом сайта');
            } else {
                this.showError(`Ошибка: ${error.message}`);
            }
        }
    }
    
    async checkCameraPermissions() {
        try {
            this.showStatus('Проверка разрешений камеры...');
            
            // Проверяем доступность API
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showError('API камеры не поддерживается. Обновите Telegram или используйте современный браузер.');
                return;
            }
            
            // Определяем платформу
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            
            this.showStatus(`Устройство: ${isMobile ? 'Мобильное' : 'Десктоп'} ${isIOS ? '(iOS)' : isAndroid ? '(Android)' : ''}`);
            
            // Проверяем разрешения (не все браузеры поддерживают)
            if (navigator.permissions && !isIOS) {
                try {
                    const permission = await navigator.permissions.query({ name: 'camera' });
                    this.showStatus(`Статус разрешения камеры: ${permission.state}`);
                    
                    if (permission.state === 'denied') {
                        if (isMobile) {
                            this.showError('Доступ к камере запрещен. Откройте настройки Telegram → Конфиденциальность и безопасность → Камера → Разрешить.');
                        } else {
                            this.showError('Доступ к камере запрещен. Измените настройки в браузере или нажмите на иконку камеры в адресной строке.');
                        }
                        return;
                    }
                } catch (permError) {
                    console.log('Permissions API недоступен:', permError);
                }
            }
            
            // Проверяем доступные камеры
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(device => device.kind === 'videoinput');
            
            if (cameras.length === 0) {
                this.showError('Камеры не найдены. Убедитесь, что камера не заблокирована и не используется другим приложением.');
                return;
            }
            
            // Проверяем Telegram WebApp специфические особенности
            if (window.Telegram && window.Telegram.WebApp) {
                const tg = window.Telegram.WebApp;
                this.showStatus(`✅ Telegram WebApp активен. Версия: ${tg.version || 'неизвестно'}`);
                
                if (tg.platform === 'ios' || tg.platform === 'android') {
                    this.showStatus(`Платформа: ${tg.platform}. Найдено камер: ${cameras.length}`);
                }
            }
            
            this.showStatus(`✅ Найдено камер: ${cameras.length}. Разрешения в порядке. ${isMobile ? 'Убедитесь что разрешили камеру в настройках Telegram!' : 'Можно начинать сканирование!'}`);
            this.hideError();
            
        } catch (error) {
            console.error('Ошибка проверки разрешений:', error);
            this.showError(`Ошибка проверки: ${error.message}. Попробуйте обновить Telegram или перезапустить приложение.`);
        }
    }
    
    checkBarcodeDetectorSupport() {
        if (!('BarcodeDetector' in window)) {
            this.showError('BarcodeDetector API не поддерживается в вашем браузере. Попробуйте использовать Chrome или Edge.');
            this.startBtn.disabled = true;
            return false;
        }
        return true;
    }
    
    async getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.cameras = devices.filter(device => device.kind === 'videoinput');
            
            if (this.cameras.length > 1) {
                this.switchBtn.disabled = false;
            }
            
            return this.cameras.length > 0;
        } catch (error) {
            console.error('Ошибка получения списка камер:', error);
            return false;
        }
    }
    
    async startScanning() {
        if (!this.checkBarcodeDetectorSupport()) return;
        
        try {
            this.showStatus('Инициализация камеры...');
            
            // Получаем список камер
            const hasCameras = await this.getCameras();
            if (!hasCameras) {
                this.showError('Камеры не найдены');
                return;
            }
            
            // Определяем мобильное устройство
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            // Настройки для мобильных устройств
            let constraints;
            if (isMobile) {
                // Для мобильных устройств используем более простые настройки
                constraints = {
                    video: {
                        facingMode: { ideal: 'environment' }, // Предпочитаем заднюю камеру
                        width: { ideal: 640 },
                        height: { ideal: 480 }
                    }
                };
            } else {
                // Для десктопа более продвинутые настройки
                constraints = {
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 640, max: 1280 },
                        height: { ideal: 480, max: 720 }
                    }
                };
            }
            
            // Пробуем разные варианты доступа к камере
            try {
                this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (error) {
                console.log('Основная камера недоступна, пробуем альтернативы:', error);
                
                if (isMobile) {
                    // Для мобильных: пробуем переднюю камеру
                    try {
                        constraints.video.facingMode = { ideal: 'user' };
                        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
                    } catch (error2) {
                        // Последняя попытка - любая камера
                        constraints = { video: { width: 640, height: 480 } };
                        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
                    }
                } else {
                    // Для десктопа: упрощаем настройки
                    constraints = { video: true };
                    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
                }
            }
            
            this.video.srcObject = this.stream;
            
            // Ждем загрузки видео
            await new Promise((resolve, reject) => {
                this.video.onloadedmetadata = () => {
                    // Принудительно запускаем видео на мобильных
                    this.video.play().then(resolve).catch(reject);
                };
                this.video.onerror = reject;
                
                // Таймаут на случай проблем
                setTimeout(() => reject(new Error('Таймаут загрузки видео')), 10000);
            });
            
            // Настраиваем canvas
            this.canvas.width = this.video.videoWidth || 640;
            this.canvas.height = this.video.videoHeight || 480;
            
            // Инициализируем BarcodeDetector
            this.barcodeDetector = new BarcodeDetector({
                formats: ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'code_93', 'codabar', 'itf', 'upc_a', 'upc_e']
            });
            
            this.isScanning = true;
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
            this.switchBtn.disabled = this.cameras.length <= 1;
            
            this.showStatus('Сканирование активно. Наведите камеру на QR-код.');
            this.hideError();
            this.hideResult();
            
            // Добавляем класс анимации
            document.querySelector('.scan-frame').classList.add('scanning');
            
            // Начинаем сканирование
            this.startDetection();
            
        } catch (error) {
            console.error('Ошибка запуска камеры:', error);
            let errorMessage = 'Ошибка доступа к камере';
            
            if (error.name === 'NotAllowedError') {
                errorMessage = 'Доступ к камере запрещен. В Telegram: Настройки → Конфиденциальность → Камера → Разрешить для Telegram.';
            } else if (error.name === 'NotFoundError') {
                errorMessage = 'Камера не найдена. Убедитесь, что устройство имеет камеру.';
            } else if (error.name === 'NotReadableError') {
                errorMessage = 'Камера занята другим приложением. Закройте другие приложения с камерой и попробуйте снова.';
            } else if (error.name === 'OverconstrainedError') {
                errorMessage = 'Запрошенные параметры камеры не поддерживаются. Попробуйте обновить приложение Telegram.';
            } else if (error.name === 'NotSupportedError') {
                errorMessage = 'Доступ к камере не поддерживается в данной версии Telegram. Обновите приложение.';
            } else if (error.message.includes('Таймаут')) {
                errorMessage = 'Камера долго инициализируется. Попробуйте еще раз или перезапустите Telegram.';
            } else {
                errorMessage = `Ошибка камеры: ${error.message}`;
            }
            
            this.showError(errorMessage);
            
            // Показываем специальные советы для мобильных
            if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                this.showStatus('📱 Советы для мобильного: 1) Разрешите камеру в настройках Telegram 2) Обновите Telegram до последней версии 3) Перезапустите приложение 4) Попробуйте кнопку "Проверить разрешения"');
            } else {
                this.showStatus('💡 Советы: 1) Разрешите доступ к камере 2) Используйте HTTPS 3) Попробуйте Chrome/Edge 4) Закройте другие приложения с камерой');
            }
        }
    }
    
    stopScanning() {
        this.isScanning = false;
        
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.video.srcObject = null;
        
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.switchBtn.disabled = true;
        
        document.querySelector('.scan-frame').classList.remove('scanning');
        
        this.showStatus('Сканирование остановлено');
    }
    
    async switchCamera() {
        if (this.cameras.length <= 1) return;
        
        this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameras.length;
        
        if (this.isScanning) {
            this.stopScanning();
            await new Promise(resolve => setTimeout(resolve, 100));
            this.startScanning();
        }
    }
    
    startDetection() {
        if (!this.isScanning) return;
        
        this.scanInterval = setInterval(async () => {
            if (!this.isScanning || this.video.videoWidth === 0) return;
            
            try {
                // Копируем кадр из видео в canvas
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                
                // Детектируем штрихкоды
                const barcodes = await this.barcodeDetector.detect(this.canvas);
                
                if (barcodes.length > 0) {
                    const barcode = barcodes[0];
                    this.onBarcodeDetected(barcode);
                }
            } catch (error) {
                console.error('Ошибка детекции:', error);
            }
        }, 100); // Сканируем каждые 100мс
    }
    
    onBarcodeDetected(barcode) {
        this.stopScanning();
        
        // Вибрация при успешном сканировании (если поддерживается)
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        // Показываем результат
        this.showResult(barcode.rawValue, barcode.format);
        
        // Отправляем данные в Telegram для n8n
        this.sendToTelegramN8N(barcode.rawValue, barcode.format);
    }
    
    showResult(value, format) {
        this.resultText.textContent = value;
        this.resultDiv.style.display = 'block';
        // Убираем сложный статус, показываем просто результат
    }
    
    hideResult() {
        this.resultDiv.style.display = 'none';
    }

    sendResultToBot() {
        const text = this.resultText.textContent;
        if (text) {
            console.log('📤 sendResultToBot called with text:', text);
            
            if (window.Telegram && window.Telegram.WebApp) {
                const tg = window.Telegram.WebApp;
                
                // Создаем сообщение для отправки
                const message = `QR-код: ${text}`;
                
                try {
                    // Способ 1: sendData (может не работать если бот не настроен)
                    tg.sendData(text);
                    console.log('✅ Data sent via sendData');
                    
                    // Способ 2: Копируем в буфер и показываем инструкцию
                    navigator.clipboard.writeText(text).then(() => {
                        this.showStatus(`✅ Текст "${text}" скопирован в буфер обмена! Теперь:\n1. Перейдите в чат с ботом\n2. Вставьте текст (Ctrl+V)\n3. Отправьте сообщение`);
                    }).catch(() => {
                        this.showStatus(`📝 Отправьте этот текст боту: ${text}`);
                    });
                    
                    // Способ 3: Попытка открыть чат (ОТКЛЮЧЕНО - вызывает диалог поделиться)
                    // setTimeout(() => {
                    //     const telegramUrl = `tg://msg?text=${encodeURIComponent(message)}`;
                    //     window.open(telegramUrl, '_blank');
                    //     console.log('📱 Attempted to open Telegram with message');
                    // }, 500);
                    
                } catch (error) {
                    console.error('❌ Error in sendResultToBot:', error);
                    
                    // Fallback - просто копируем текст
                    navigator.clipboard.writeText(text).then(() => {
                        this.showStatus(`� Ошибка отправки. Текст скопирован в буфер: "${text}". Вставьте его в чат с ботом.`);
                    }).catch(() => {
                        this.showStatus(`❌ Ошибка. Скопируйте текст вручную: ${text}`);
                    });
                }
            } else {
                // Вне Telegram - просто копируем
                navigator.clipboard.writeText(text).then(() => {
                    this.showStatus(`📋 Текст скопирован: "${text}"`);
                }).catch(() => {
                    this.showStatus(`📝 Скопируйте текст: ${text}`);
                });
            }
        } else {
            this.showStatus('❌ Нет данных для отправки');
        }
    }
    
    sendToTelegramN8N(value, format) {
        console.log('🚀 sendToTelegramN8N called with:', { value, format });
        
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            console.log('📱 Telegram WebApp available');
            
            // Простейший способ - показать кнопку для отправки сообщения в чат
            tg.MainButton.setText('📤 Отправить в чат');
            tg.MainButton.color = '#2481cc';
            tg.MainButton.textColor = '#ffffff';
            tg.MainButton.show();
            
            // Очищаем предыдущие обработчики
            tg.MainButton.offClick();
            
            // При нажатии на кнопку - отправляем сообщение в чат
            tg.MainButton.onClick(() => {
                console.log('🎯 MainButton clicked, sending message to chat');
                
                // Отправляем сообщение прямо в чат через Telegram API
                const message = `QR-код: ${value}`;
                
                // Используем Telegram схему для отправки сообщения
                const telegramUrl = `tg://msg?text=${encodeURIComponent(message)}`;
                
                try {
                    // Попытка 1: через sendData
                    tg.sendData(value);
                    console.log('📤 Sent via sendData:', value);
                    
                    // Попытка 2: открыть диалог отправки сообщения
                    window.open(telegramUrl, '_blank');
                    console.log('� Opened Telegram message dialog');
                    
                    this.showStatus(`✅ Сообщение "${value}" готово к отправке!`);
                    
                    // Скрываем кнопку и закрываем приложение
                    tg.MainButton.hide();
                    setTimeout(() => {
                        tg.close();
                    }, 2000);
                    
                } catch (error) {
                    console.error('❌ Error:', error);
                    
                    // Fallback - просто копируем в буфер обмена
                    navigator.clipboard.writeText(value).then(() => {
                        this.showStatus(`📋 Текст "${value}" скопирован в буфер обмена. Вставьте его в чат с ботом.`);
                    }).catch(() => {
                        this.showStatus(`📝 Отправьте этот текст боту: ${value}`);
                    });
                }
            });
            
            // Показываем инструкцию
            this.showStatus(`✅ QR-код распознан! Нажмите "Отправить в чат" для отправки боту.`);
            
        } else {
            console.log('❌ Telegram WebApp недоступен. QR текст:', value);
            this.showStatus('⚠️ Приложение работает вне Telegram. Распознанный текст: ' + value);
        }
    }

    sendToTelegram(value, format) {
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            
            // Отправляем данные боту
            tg.sendData(JSON.stringify({
                action: 'qr_scanned',
                value: value,
                format: format,
                timestamp: Date.now()
            }));
            
            // Показываем кнопку "Закрыть"
            tg.MainButton.setText('Отправить результат');
            tg.MainButton.show();
            tg.MainButton.onClick(() => {
                tg.sendData(JSON.stringify({
                    action: 'send_result',
                    value: value,
                    format: format
                }));
                tg.close();
            });
        }
    }
    
    showStatus(message) {
        this.statusDiv.textContent = message;
        this.statusDiv.style.display = 'block';
    }
    
    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
    }
    
    hideError() {
        this.errorDiv.style.display = 'none';
    }
    
    // Новый метод для отправки через n8n webhook
    async sendToN8NWebhook(qrText, format) {
        // Замените на ваш реальный URL webhook в n8n
        const webhookUrl = 'https://codanetn8n.ru/webhook/04a25c25-4aa8-4688-b395-a1681641552b';
        
        const data = {
            qr_text: qrText,
            format: format,
            timestamp: new Date().toISOString(),
            user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || null,
            username: window.Telegram?.WebApp?.initDataUnsafe?.user?.username || null,
            first_name: window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || null
        };
        
        try {
            console.log('📤 Sending to n8n webhook:', data);
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                console.log('✅ Data sent to n8n webhook successfully');
                return true;
            } else {
                console.error('❌ n8n webhook responded with:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('❌ Error sending to n8n webhook:', error);
        }
        return false;
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new QRScanner();
});

// Обработка состояния приложения
window.addEventListener('beforeunload', () => {
    if (window.qrScanner && window.qrScanner.isScanning) {
        window.qrScanner.stopScanning();
    }
});

// Экспорт для глобального доступа
window.QRScanner = QRScanner;
