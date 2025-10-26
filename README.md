# 🔮 AI Palm Reader

A modern web application that analyzes palm images using AI to detect lines and generate personality insights. Upload a photo of your palm and get instant mystical analysis with beautiful visualizations.

## ✨ Features

- **AI-Powered Analysis**: Advanced computer vision detects palm lines using OpenCV
- **Beautiful Web Interface**: Modern glassmorphism design with responsive layout
- **Instant Results**: Get your palm reading in seconds with overlay visualizations
- **Mobile Ready**: Optimized for both desktop and mobile devices
- **Privacy Focused**: Images processed locally, never stored or shared

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 with TypeScript
- Modern CSS with glassmorphism effects
- Responsive design for all devices

**Backend:**
- FastAPI (Python) 
- OpenCV for image processing
- Uvicorn ASGI server

**Future Mobile App:**
- React Native with Expo (prepared structure in `/mobile-app/`)

## 🚀 Quick Start

### 1. Backend Setup

```powershell
# Navigate to backend and create virtual environment
cd "D:\github\Astrology\palm reader\backend"
python -m venv .venv

# Activate environment and install dependencies
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Start the API server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: http://localhost:8000

### 2. Frontend Setup

```powershell
# Navigate to frontend directory  
cd "D:\github\Astrology\palm reader\frontend"

# Install dependencies
npm install

# Start development server
npm run dev
```

The website will be available at: http://localhost:3000

### 3. Usage

1. Open http://localhost:3000 in your browser
2. Upload a clear palm photo or drag & drop an image
3. Wait for AI analysis (few seconds)
4. View detected lines and get your personalized reading!

## 📁 Project Structure

```
palm reader/
├── backend/                 # FastAPI backend
│   ├── app.py              # Main API endpoint
│   ├── palm_detector.py    # OpenCV image processing  
│   ├── line_interpreter.py # Rule-based analysis
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js website
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Next.js pages
│   │   └── styles/         # CSS styling
│   ├── package.json       # Node.js dependencies
│   └── tsconfig.json      # TypeScript config
├── mobile-app/             # Future React Native app
│   └── README.md          # Mobile development guide
└── README.md              # This file
```

## 🔧 API Endpoints

**POST /analyze**
- Accepts: Image file (multipart/form-data)
- Returns: JSON with detected lines, interpretation, and overlay image (base64)

Example response:
```json
{
  "lines": [
    {"coords": [x1, y1, x2, y2], "length": 150}
  ],
  "interpretation": "Your palm shows longer, more pronounced lines...", 
  "overlay": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

## 🎨 Features Overview

- **Drag & Drop Upload**: Modern file picker with drag/drop support
- **Real-time Preview**: See your uploaded image before analysis  
- **AI Visualization**: Red line overlays show detected palm features
- **Mystical Readings**: Personality insights based on line analysis
- **Responsive Design**: Works on phones, tablets, and desktops
- **Loading Animations**: Beautiful spinner during processing

## 🚀 Future Enhancements

- **Mediapipe Integration**: More accurate hand/palm detection
- **Advanced ML Models**: Train on palm reading datasets for better accuracy  
- **User Accounts**: Save and compare multiple readings
- **Social Features**: Share readings with friends
- **Mobile App**: Native iOS/Android app with camera integration
- **Premium Features**: Detailed reports, daily insights, compatibility analysis

## 🔮 Mobile App (Coming Soon)

The `/mobile-app/` directory contains the prepared structure for a React Native app with:

- Camera integration for real-time palm capture
- Offline processing capabilities  
- Push notifications for daily readings
- Native sharing and storage features

See `/mobile-app/README.md` for setup instructions.

## 🤝 Contributing

This is a prototype project. Future improvements could include:

1. **Better Computer Vision**: Implement Mediapipe for hand detection
2. **Machine Learning**: Train models on labeled palm datasets
3. **UI/UX Enhancements**: Add animations and better mobile experience
4. **Backend Improvements**: Add caching, rate limiting, user management

## 🚀 Deployment

### ⚡ Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AnshXGrind/AI-palm-reader)

**Or deploy manually:**

```bash
# Windows
deploy-vercel.bat

# Mac/Linux  
./deploy-vercel.sh
```

**Features in Vercel deployment:**
- ✅ Full palm reading functionality with mock AI analysis
- ✅ Beautiful UI with camera capture
- ✅ Serverless API routes (no backend needed)
- ✅ Optimized for production performance

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## �📝 License

This project is for educational and demonstration purposes. Feel free to fork and modify!
