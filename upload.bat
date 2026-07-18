@echo off
cd /d C:\Users\hamoo\Downloads\sentryscan

git init
git add .
git commit -m "Initial commit: SentryScan website security scanner"
git branch -M main

echo.
echo ============================================
echo الآن ادخل username وكلمة السر بتاعتك GitHub
echo ============================================
echo.

set /p GITHUB_USER="GitHub Username: "
set /p GITHUB_TOKEN="GitHub Token (أو كلمة السر): "

git remote add origin https://%GITHUB_USER%:%GITHUB_TOKEN%@github.com/%GITHUB_USER%/sentryscan.git
git push -u origin main

echo.
echo ✅ تمام! المشروع اتنزّل على GitHub
echo روح: https://github.com/%GITHUB_USER%/sentryscan
pause