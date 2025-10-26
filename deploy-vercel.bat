@echo off
REM Simple Vercel Deployment Script for AI Palm Reader (Windows)

echo 🔮 Deploying AI Palm Reader to Vercel...

REM Navigate to frontend directory
cd frontend

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the project
echo 🔨 Building project...
npm run build

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
npx vercel --prod

echo ✅ Deployment complete!
echo 🌐 Your AI Palm Reader is now live on Vercel!