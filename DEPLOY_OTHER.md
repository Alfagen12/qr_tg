# Развертывание на Surge.sh

## Пошаговая инструкция:

### 1. Установка Surge CLI

```bash
npm install -g surge
```

### 2. Развертывание

```bash
cd d:\Projects\web_qr_tg

# Первое развертывание
surge

# Следуйте инструкциям:
# - Email: ваш email
# - Password: создайте пароль
# - Project path: (нажмите Enter)
# - Domain: telegram-qr-scanner.surge.sh (или свой)
```

### 3. Обновление

```bash
# Для последующих обновлений
surge --domain telegram-qr-scanner.surge.sh
```

### Преимущества Surge:

- ✅ Очень быстрое развертывание
- ✅ Простота использования
- ✅ Бесплатный SSL
- ✅ Поддержка собственных доменов

---

# Развертывание на Firebase Hosting

## Пошаговая инструкция:

### 1. Установка Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Инициализация проекта

```bash
cd d:\Projects\web_qr_tg
firebase login
firebase init hosting

# Настройки:
# - Use existing project или Create new project
# - Public directory: . (текущая папка)
# - Single-page app: No
# - Set up automatic builds: No
```

### 3. Развертывание

```bash
firebase deploy
```

### Получение URL:

После деплоя получите URL вида:
`https://your-project-id.web.app`
