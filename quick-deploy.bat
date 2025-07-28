@echo off
echo 🚀 Быстрое развертывание QR Scanner на бесплатном хостинге
echo.

:menu
echo Выберите способ развертывания:
echo 1. GitHub Pages (рекомендуется)
echo 2. Netlify (простой drag & drop)
echo 3. Vercel (быстрый CLI)
echo 4. Surge.sh (мгновенный деплой)
echo 5. Показать инструкции
echo 0. Выход
echo.

set /p choice=Введите номер (0-5): 

if "%choice%"=="1" goto github
if "%choice%"=="2" goto netlify
if "%choice%"=="3" goto vercel
if "%choice%"=="4" goto surge
if "%choice%"=="5" goto instructions
if "%choice%"=="0" exit /b
goto menu

:github
echo.
echo 📚 GitHub Pages развертывание:
echo.
echo 1. Создайте репозиторий на GitHub: https://github.com/new
echo 2. Выполните команды:
echo.
echo    git init
echo    git add .
echo    git commit -m "Initial commit"
echo    git branch -M main
echo    git remote add origin https://github.com/USERNAME/REPO.git
echo    git push -u origin main
echo.
echo 3. В настройках репозитория включите Pages
echo 4. Ваш URL: https://USERNAME.github.io/REPO/
echo.
pause
goto menu

:netlify
echo.
echo 🌐 Netlify развертывание:
echo.
echo Вариант 1 - Drag & Drop:
echo 1. Откройте https://netlify.com
echo 2. Перетащите папку проекта в браузер
echo 3. Получите URL типа: https://amazing-name.netlify.app
echo.
echo Вариант 2 - Через Git:
echo 1. Загрузите код на GitHub (см. пункт 1)
echo 2. На Netlify: New site from Git
echo 3. Выберите ваш репозиторий
echo.
pause
goto menu

:vercel
echo.
echo ⚡ Vercel развертывание:
echo.
echo Установите Vercel CLI и выполните:
echo    npm i -g vercel
echo    vercel
echo.
echo Или через web: https://vercel.com/new
echo.
pause
goto menu

:surge
echo.
echo 🌊 Surge.sh развертывание:
echo.
echo Установите Surge и выполните:
echo    npm install -g surge
echo    surge
echo.
echo Выберите домен типа: telegram-qr-scanner.surge.sh
echo.
pause
goto menu

:instructions
echo.
echo 📖 Подробные инструкции смотрите в файлах:
echo - DEPLOY_GITHUB.md
echo - DEPLOY_NETLIFY.md  
echo - DEPLOY_VERCEL.md
echo - DEPLOY_OTHER.md
echo.
pause
goto menu
