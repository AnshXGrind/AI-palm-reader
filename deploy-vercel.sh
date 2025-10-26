#!/bin/bash

# Simple Vercel Deployment Script for AI Palm Reader

echo "🔮 Deploying AI Palm Reader to Vercel..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your AI Palm Reader is now live on Vercel!"