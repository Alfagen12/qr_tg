// QR Scanner v3.3.1 - Universal Fixed version
console.log('🚀 QR Scanner v3.3.1 Universal загружен!', new Date().toISOString());

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
        
        // Универсальная поддержка
        this.useNativeAPI = false;
        this.useZXing = false;
        this.zxingReader = null;
        this.lastResult = null;
        
        // Детекция устройства
        this.deviceInfo = this.detectDevice();
        
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
        this.sendToBotBtn = document.getElementById('sendToBot');
        
        this.initEventListeners();
        this.initTelegram();
        this.initializeScanner();
    }
    
    detectDevice() {
        const ua = navigator.userAgent;
        const device = {
            isIOS: /iPad|iPhone|iPod/.test(ua),
            isPOCO: /POCO|MIUI|Xiaomi/i.test(ua),
            isSamsung: /Samsung/i.test(ua),
            isRealme: /RMX|Realme/i.test(ua),
            isAndroid: /Android/i.test(ua),
            browser: this.detectBrowser(),
            version: this.getOSVersion()
        };
        
        console.log('📱 Device detected:', device);
        return device;
    }
    
    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }
    
    getOSVersion() {
        const ua = navigator.userAgent;
        const match = ua.match(/(?:Android|iPhone OS|iPad OS)\s([\d_\.]+)/);
        return match ? match[1].replace(/_/g, '.') : 'Unknown';
    }
    
    async initializeScanner() {
        console.log('🔍 Initializing universal QR scanner...');
        
        // Проверяем нативную поддержку BarcodeDetector
        if ('BarcodeDetector' in window) {
            console.log('✅ Native BarcodeDetector available');
            this.useNativeAPI = true;
            await this.checkBarcodeDetectorSupport();
        } else {
            console.log('⚠️ BarcodeDetector not available, loading ZXing...');
            await this.loadZXing();
        }
        
        this.showDeviceInfo();
    }
    
    async loadZXing() {
        try {
            console.log('📦 Loading ZXing library...');
            
            // Создаем и загружаем скрипт ZXing
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@zxing/library@latest/umd/index.min.js';
            document.head.appendChild(script);
            
            await new Promise((resolve, reject) => {
                script.onload = resolve;
                script.onerror = reject;
            });
            
            // Инициализируем ZXing reader
            this.zxingReader = new ZXing.BrowserQRCodeReader();
            this.useZXing = true;
            
            console.log('✅ ZXing library loaded successfully');
            this.showStatus('📱 Универсальный сканер готов (ZXing)');
            
        } catch (error) {
            console.error('❌ Failed to load ZXing:', error);
            this.showError('Не удалось загрузить библиотеку сканирования');
        }
    }
    
    showDeviceInfo() {
        const info = document.createElement('div');
        info.className = 'device-info';
        info.innerHTML = `
            <div style="background: #e3f2fd; border: 1px solid #90caf9; padding: 10px; margin: 10px; border-radius: 8px; font-size: 12px;">
                <strong>📱 Устройство:</strong> ${this.deviceInfo.isPOCO ? 'POCO/MIUI' : this.deviceInfo.isIOS ? 'iPhone/iPad' : this.deviceInfo.isSamsung ? 'Samsung' : this.deviceInfo.isRealme ? 'Realme' : 'Android'}<br>
                <strong>🌐 Браузер:</strong> ${this.deviceInfo.browser}<br>
                <strong>🔍 Сканер:</strong> ${this.useNativeAPI ? 'Native BarcodeDetector' : 'ZXing Universal'}
            </div>
        `;
        document.body.insertBefore(info, document.body.firstChild);
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startScanning());
        this.stopBtn.addEventListener('click', () => this.stopScanning());
        this.switchBtn.addEventListener('click', () => this.switchCamera());
        this.checkPermissionsBtn.addEventListener('click', () => this.checkCameraPermissions());
        this.requestPermissionsBtn.addEventListener('click', () => this.requestCameraPermissions());
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
                this.showError('❌ Доступ к камере отклонен. Инструкция для разрешения:\\n\\n📱 На мобильном: Настройки Telegram → Конфиденциальность → Камера → Разрешить\\n\\n💻 В браузере: нажмите на иконку 🔒 или 📷 рядом с адресом сайта');
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
            
            // Простая проверка доступа
            const devices = await navigator.mediaDevices.enumerateDevices();
            const cameras = devices.filter(device => device.kind === 'videoinput');
            
            if (cameras.length === 0) {
                this.showError('Камера не найдена');
                return;
            }
            
            this.showStatus(`📷 Найдено камер: ${cameras.length}`);
            this.hideError();
            
        } catch (error) {
            console.error('Ошибка проверки разрешений:', error);
            this.showError(`Ошибка проверки камеры: ${error.message}`);
        }
    }
    
    checkBarcodeDetectorSupport() {
        try {
            if ('BarcodeDetector' in window) {
                this.barcodeDetector = new BarcodeDetector({
                    formats: ['qr_code', 'ean_13', 'code_128', 'data_matrix']
                });
                this.showStatus('✅ BarcodeDetector API поддерживается');
                console.log('✅ BarcodeDetector инициализирован');
            } else {
                this.showStatus('⚠️ BarcodeDetector не поддерживается, используется ZXing');
            }
        } catch (error) {
            console.error('Ошибка инициализации BarcodeDetector:', error);
            this.showError('Ошибка инициализации сканера');
        }
    }
    
    async getCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.cameras = devices.filter(device => device.kind === 'videoinput');
            console.log('📷 Найдено камер:', this.cameras.length);
            
            if (this.cameras.length > 1) {
                this.switchBtn.style.display = 'inline-block';
            }
            
            return this.cameras;
        } catch (error) {
            console.error('Ошибка получения списка камер:', error);
            return [];
        }
    }
    
    async startScanning() {
        try {
            console.log('📷 Starting QR scanning...');
            this.showStatus('Запуск сканирования...');
            
            if (this.isScanning) {
                console.log('⚠️ Scanning already in progress');
                return;
            }
            
            // Получаем список камер
            await this.getCameras();
            
            // Настройки камеры в зависимости от устройства
            const constraints = this.deviceInfo.isPOCO ? {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    frameRate: { ideal: 15, max: 30 }
                }
            } : {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            console.log('📷 Camera constraints:', constraints);
            
            // Запрашиваем доступ к камере
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            // Подключаем поток к видео
            this.video.srcObject = this.stream;
            this.video.style.display = 'block';
            
            // Ждем загрузки видео
            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    this.video.play();
                    resolve();
                };
            });
            
            // Настраиваем canvas
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
            // Запускаем сканирование
            this.isScanning = true;
            this.startBtn.style.display = 'none';
            this.stopBtn.style.display = 'inline-block';
            
            this.showStatus('📷 Сканирование активно. Наведите на QR-код.');
            this.hideError();
            
            // Запускаем детекцию
            this.startDetection();
            
        } catch (error) {
            console.error('❌ Error starting camera:', error);
            this.handleCameraError(error);
        }
    }
    
    handleCameraError(error) {
        let errorMessage = '❌ Ошибка доступа к камере';
        let suggestions = [];
        
        if (error.name === 'NotAllowedError') {
            errorMessage = '🚫 Доступ к камере запрещен';
            suggestions = [
                'Разрешите доступ к камере в настройках браузера',
                'На POCO: Настройки → Приложения → Telegram → Разрешения → Камера',
                'Перезапустите Telegram после изменения разрешений'
            ];
        } else if (error.name === 'NotFoundError') {
            errorMessage = '📷 Камера не найдена';
            suggestions = [
                'Проверьте, что камера не используется другим приложением',
                'Перезапустите телефон'
            ];
        } else if (error.name === 'NotSupportedError') {
            errorMessage = '⚠️ Браузер не поддерживается';
            suggestions = [
                'Обновите Telegram до последней версии',
                'Попробуйте открыть в Chrome браузере'
            ];
        }
        
        this.showError(errorMessage + (suggestions.length ? '\\n\\n' + suggestions.join('\\n') : ''));
        this.isScanning = false;
        this.startBtn.style.display = 'inline-block';
        this.stopBtn.style.display = 'none';
    }
    
    stopScanning() {
        console.log('🛑 Stopping QR scanning...');
        
        this.isScanning = false;
        
        if (this.scanInterval) {
            clearInterval(this.scanInterval);
            this.scanInterval = null;
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.zxingReader) {
            try {
                this.zxingReader.reset();
            } catch (e) {
                console.log('ZXing reset error (ignored):', e);
            }
        }
        
        this.video.style.display = 'none';
        this.startBtn.style.display = 'inline-block';
        this.stopBtn.style.display = 'none';
        
        this.showStatus('📷 Сканирование остановлено');
    }
    
    async switchCamera() {
        if (this.cameras.length <= 1) return;
        
        this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameras.length;
        
        if (this.isScanning) {
            this.stopScanning();
            await new Promise(resolve => setTimeout(resolve, 500));
            this.startScanning();
        }
    }
    
    startDetection() {
        if (!this.isScanning) return;
        
        if (this.useNativeAPI && this.barcodeDetector) {
            this.startNativeDetection();
        } else if (this.useZXing) {
            this.startZXingDetection();
        } else {
            // Fallback - попробуем снова загрузить ZXing
            this.loadZXing().then(() => {
                if (this.isScanning) {
                    this.startZXingDetection();
                }
            });
        }
    }
    
    startNativeDetection() {
        this.scanInterval = setInterval(async () => {
            if (!this.isScanning || this.video.videoWidth === 0) return;
            
            try {
                this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                const barcodes = await this.barcodeDetector.detect(this.canvas);
                
                if (barcodes.length > 0) {
                    const barcode = barcodes[0];
                    this.onBarcodeDetected({ rawValue: barcode.rawValue, format: barcode.format });
                }
            } catch (error) {
                console.error('❌ Native detection error:', error);
            }
        }, 100);
    }
    
    async startZXingDetection() {
        try {
            console.log('🔍 Starting ZXing detection...');
            
            if (!this.zxingReader) {
                console.error('❌ ZXing reader not initialized');
                return;
            }
            
            // Используем ZXing для непрерывного сканирования
            this.scanInterval = setInterval(async () => {
                if (!this.isScanning || this.video.videoWidth === 0) return;
                
                try {
                    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
                    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                    
                    const result = await this.zxingReader.decodeFromImageData(imageData);
                    if (result) {
                        this.onBarcodeDetected({ 
                            rawValue: result.getText(), 
                            format: result.getBarcodeFormat() 
                        });
                    }
                } catch (scanError) {
                    // Тихо игнорируем ошибки сканирования (нет QR-кода в кадре)
                }
            }, 300); // Сканируем каждые 300мс для ZXing
            
        } catch (error) {
            console.error('❌ ZXing detection error:', error);
        }
    }
    
    onBarcodeDetected(barcode) {
        this.stopScanning();
        
        // Вибрация при успешном сканировании (если поддерживается)
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        
        console.log('✅ QR detected:', barcode.rawValue, 'Format:', barcode.format);
        
        // Показываем результат
        this.showResult(barcode.rawValue, barcode.format || 'qr_code');
    }
    
    showResult(value, format) {
        this.lastResult = { value, format };
        this.resultText.textContent = value;
        this.resultDiv.style.display = 'block';
        
        console.log('📋 QR результат:', value);
    }
    
    hideResult() {
        this.resultDiv.style.display = 'none';
    }
    
    sendResultToBot() {
        if (!this.lastResult) {
            this.showError('Нет данных для отправки');
            return;
        }
        
        const text = this.lastResult.value;
        
        // Отправляем через оба способа для надежности
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            try {
                tg.sendData(text);
                console.log('✅ Sent via tg.sendData');
            } catch (error) {
                console.error('❌ Error with tg.sendData:', error);
            }
        }
        
        // Дублируем через webhook
        this.sendToN8NWebhook(text, 'qr_code');
        
        this.showStatus(`💰 Платеж "${text}" обработан!`);
        
        // Автоматически закрываем приложение через 2 секунды
        if (window.Telegram && window.Telegram.WebApp) {
            setTimeout(() => {
                window.Telegram.WebApp.close();
            }, 2000);
        }
    }
    
    showStatus(message) {
        this.statusDiv.textContent = message;
        this.statusDiv.style.display = 'block';
    }
    
    showError(message) {
        this.errorDiv.innerHTML = message.replace(/\\n/g, '<br>');
        this.errorDiv.style.display = 'block';
    }
    
    hideError() {
        this.errorDiv.style.display = 'none';
    }
    
    async sendToN8NWebhook(qrText, format) {
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
            console.log('📡 Webhook URL:', webhookUrl);
            
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('🔄 Response status:', response.status);
            
            const responseText = await response.text();
            console.log('📨 Response body:', responseText);
            
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
    console.log('🚀 Initializing QR Scanner...');
    window.qrScanner = new QRScanner();
});
