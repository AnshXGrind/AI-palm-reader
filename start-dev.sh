#!/bin/bash
# Quick Start Script for AI Palm Reader (macOS/Linux)

echo ""
echo "=================================================="
echo "  🔮 AI PALM READER - Development Quick Start"
echo "=================================================="
echo ""

# Check if python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.10+"
    exit 1
fi

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Python and Node.js found"
echo ""
echo "📋 Setting up virtual environment..."

# Create backend venv if it doesn't exist
if [ ! -d "backend/.venv" ]; then
    echo "Creating backend virtual environment..."
    cd backend
    python3 -m venv .venv
    cd ..
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

echo ""
echo "📦 Installing dependencies..."

# Install backend dependencies
echo "Installing backend dependencies (this may take a minute)..."
cd backend
source .venv/bin/activate
pip install -q -r requirements/dev.txt
cd ..

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies (this may take a minute)..."
    cd frontend
    npm install --silent
    cd ..
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "=================================================="
echo "  ✨ Setup Complete!"
echo "=================================================="
echo ""
echo "🚀 Starting development servers..."
echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   Docs:     http://localhost:8000/docs"
echo ""

# Start backend in background
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
cd ..

# Start frontend
cd frontend
npm run dev
