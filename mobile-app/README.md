# Mobile App Structure (React Native / Expo)

This directory is prepared for future mobile app development using React Native with Expo.

## Planned Structure

```
mobile-app/
├── src/
│   ├── components/
│   │   ├── PalmCapture.tsx      # Camera integration for palm photos
│   │   ├── PalmUploader.tsx     # File picker and image handling
│   │   ├── ResultDisplay.tsx    # Analysis results with native styling
│   │   └── LoadingScreen.tsx    # Native loading animations
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Main palm reader interface
│   │   ├── ResultScreen.tsx     # Full-screen results view
│   │   ├── HistoryScreen.tsx    # Saved readings (future feature)
│   │   └── SettingsScreen.tsx   # App preferences
│   ├── services/
│   │   ├── ApiService.ts        # Backend communication
│   │   ├── CameraService.ts     # Camera permissions and capture
│   │   └── StorageService.ts    # Local data persistence
│   └── utils/
│       ├── ImageProcessor.ts    # Local image preprocessing
│       └── Constants.ts         # App configuration
├── assets/                      # Images, fonts, sounds
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
└── README.md                    # Mobile setup instructions
```

## Key Mobile Features to Implement

1. **Camera Integration**
   - Real-time camera preview
   - Palm detection guides/overlay
   - Flash and focus controls
   - Photo quality optimization

2. **Offline Capabilities**
   - Local image processing
   - Cached analysis results
   - Offline reading history

3. **Native Features**
   - Push notifications for daily readings
   - Share results to social media
   - Biometric authentication for privacy
   - Haptic feedback

4. **Performance Optimizations**
   - Image compression before upload
   - Progressive image loading
   - Background processing
   - Memory management

## Setup Commands (Future)

```bash
# Initialize Expo project
npx create-expo-app ai-palm-reader --template blank-typescript

# Install dependencies
npm install @expo/vector-icons expo-camera expo-image-picker expo-sharing

# Development
npx expo start
```

## Backend Integration

The mobile app will use the same FastAPI backend currently running for the web version, with additional considerations for:

- Mobile-optimized image sizes
- Better error handling for network issues
- Authentication/user accounts
- Push notification triggers