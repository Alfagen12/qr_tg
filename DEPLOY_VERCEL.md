# Развертывание на Vercel

## Пошаговая инструкция:

### 1. Развертывание через CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# В папке проекта
cd d:\Projects\web_qr_tg
vercel

# Следуйте инструкциям:
# - Set up and deploy? Y
# - Which scope? (выберите ваш аккаунт)
# - Link to existing project? N
# - What's your project's name? telegram-qr-scanner
# - In which directory? ./
# - Override settings? N
```

### 2. Развертывание через Web интерфейс

1. Перейдите на [vercel.com](https://vercel.com)
2. Зарегистрируйтесь через GitHub
3. Нажмите "New Project"
4. Импортируйте ваш Git репозиторий
5. Настройки оставьте по умолчанию
6. Нажмите "Deploy"

### 3. Получение URL

После деплоя получите URL вида:
`https://telegram-qr-scanner.vercel.app`

### Преимущества Vercel:

- ✅ Быстрый CDN
- ✅ Автоматические превью для Pull Request
- ✅ Интеграция с Git
- ✅ Аналитика производительности
