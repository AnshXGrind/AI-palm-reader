# 🚀 Vercel Deployment Guide - AI Palm Reader

## ⚡ Quick Deploy (Recommended)

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AnshXGrind/AI-palm-reader)

### Option 2: Manual Deploy

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Run Deployment Script**:
   ```bash
   # On Windows
   deploy-vercel.bat
   
   # On Mac/Linux  
   ./deploy-vercel.sh
   ```

3. **Or Deploy Manually**:
   ```bash
   cd frontend
   npm install
   npm run build
   npx vercel --prod
   ```

### Full-Stack Deployment Options

#### Option 1: Separate Deployments
- **Frontend**: Deploy to Vercel/Netlify
- **Backend**: Deploy to Railway/Heroku/DigitalOcean

#### Option 2: Containerized Deployment
- Use Docker to containerize both services
- Deploy to platforms like Railway, Render, or DigitalOcean Apps

## 🔧 Fixing Common Errors

### FUNCTION_INVOCATION_TIMEOUT (504)
- **Cause**: Backend processing takes too long
- **Fix**: Optimize image processing or increase timeout limits

### DEPLOYMENT_NOT_READY_REDIRECTING (303)  
- **Cause**: Deployment still building
- **Fix**: Wait for build to complete

### FUNCTION_PAYLOAD_TOO_LARGE (413)
- **Cause**: Uploaded images are too large
- **Fix**: Add client-side image compression

### DNS_HOSTNAME_NOT_FOUND (502)
- **Cause**: Backend API URL not accessible
- **Fix**: Update API_URL environment variable

## 📝 Environment Variables for Vercel

Set these in your Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
```

## 🐳 Docker Deployment (Alternative)

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
```

## 🚨 Quick Fix for Current Errors

If you're seeing Vercel errors right now:

1. **Check build logs** in Vercel dashboard
2. **Verify all environment variables** are set
3. **Ensure package.json** has correct scripts
4. **Check for large files** (>100MB limit)
5. **Verify API endpoints** are accessible

## 📞 Need Help?

- Check Vercel logs: `vercel logs [deployment-url]`
- Monitor function execution: Vercel Dashboard > Functions tab
- Test locally: `npm run build` should work without errors