# Ручное обновление Netlify (если нужно)

## Если автодеплой не сработал:

### Вариант 1 - Trigger Deploy в Netlify:
1. Зайдите в Netlify Dashboard
2. Выберите ваш сайт
3. Deploys → Trigger deploy → Deploy site

### Вариант 2 - Пересоздать deploy hook:
1. Site settings → Build & deploy → Build hooks
2. Add build hook → название: "GitHub Update"
3. Скопируйте URL
4. Вставьте в GitHub webhook

### Вариант 3 - Проверить настройки:
1. Site settings → Build & deploy → Continuous deployment
2. Repository должен быть: Alfagen12/qr_tg
3. Branch: main
4. Build command: пустое (для статических файлов)
5. Publish directory: . (корень)

## Файлы готовы для ручной загрузки:
В папке `netlify-deploy/` находятся готовые файлы:
- index.html (с мобильными улучшениями)
- script.js (с поддержкой Telegram WebApp)
- styles.css (адаптивные стили)

Можно просто перетащить эти 3 файла на страницу Netlify Deploy.
