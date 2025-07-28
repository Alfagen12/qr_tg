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
        this.resultDiv = document.getElementById('result');
        this.resultText = document.getElementById('resultText');
        this.statusDiv = document.getElementById('status');
        this.errorDiv = document.getElementById('error');
        this.copyBtn = document.getElementById('copyResult');
        this.shareBtn = document.getElementById('shareResult');
        
        this.initEventListeners();
        this.initTelegram();
        this.checkBarcodeDetectorSupport();
    }
    
    initEventListeners() {
        this.startBtn.addEventListener('click', () => this.startScanning());
        this.stopBtn.addEventListener('click', () => this.stopScanning());
        this.switchBtn.addEventListener('click', () => this.switchCamera());
        this.copyBtn.addEventListener('click', () => this.copyResult());
        this.shareBtn.addEventListener('click', () => this.shareResult());
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
            
            // Запрашиваем доступ к камере
            const constraints = {
                video: {
                    facingMode: this.currentCameraIndex === 0 ? 'environment' : 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            // Если есть конкретная камера, используем её ID
            if (this.cameras[this.currentCameraIndex]) {
                constraints.video.deviceId = { exact: this.cameras[this.currentCameraIndex].deviceId };
                delete constraints.video.facingMode;
            }
            
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            await new Promise((resolve) => {
                this.video.onloadedmetadata = resolve;
            });
            
            // Настраиваем canvas
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
            
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
            if (error.name === 'NotAllowedError') {
                this.showError('Доступ к камере запрещен. Разрешите использование камеры в настройках браузера.');
            } else if (error.name === 'NotFoundError') {
                this.showError('Камера не найдена');
            } else {
                this.showError('Ошибка доступа к камере: ' + error.message);
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
        
        // Отправляем данные в Telegram
        this.sendToTelegram(barcode.rawValue, barcode.format);
    }
    
    showResult(value, format) {
        this.resultText.textContent = value;
        this.resultDiv.style.display = 'block';
        this.showStatus(`QR-код успешно отсканирован! Формат: ${format}`);
    }
    
    hideResult() {
        this.resultDiv.style.display = 'none';
    }
    
    async copyResult() {
        const text = this.resultText.textContent;
        try {
            await navigator.clipboard.writeText(text);
            this.showStatus('Результат скопирован в буфер обмена');
        } catch (error) {
            console.error('Ошибка копирования:', error);
            this.showError('Не удалось скопировать текст');
        }
    }
    
    shareResult() {
        const text = this.resultText.textContent;
        
        if (navigator.share) {
            navigator.share({
                title: 'QR Scanner Result',
                text: text
            }).catch(error => console.error('Ошибка sharing:', error));
        } else {
            // Fallback: копируем в буфер
            this.copyResult();
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
