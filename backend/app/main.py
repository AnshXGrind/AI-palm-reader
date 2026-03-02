"""
Main FastAPI application for AI Palm Reader.
Provides endpoints for palm analysis with real ML detection.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time
from typing import Dict, Any

from app.config import settings
from app.core.detector import get_detector
from app.core.interpreter import get_interpreter

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format=settings.LOG_FORMAT
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Health check endpoint
@app.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "version": settings.VERSION,
        "timestamp": time.time()
    }


# Analysis endpoint
@app.post("/analyze")
async def analyze_palm(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Analyze a palm image and return insights.
    
    Args:
        file: Image file (JPEG, PNG, etc.)
        
    Returns:
        Dictionary with analysis results
    """
    try:
        # Validate file type
        file_ext = "." + file.filename.split(".")[-1].lower()
        if file_ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
        
        # Read file
        contents = await file.read()
        
        # Check file size
        if len(contents) > settings.MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {settings.MAX_UPLOAD_SIZE // (1024*1024)}MB"
            )
        
        logger.info(f"Processing image: {file.filename} ({len(contents)} bytes)")
        
        # Detect palm using Mediapipe
        detector = get_detector()
        detection_result = detector.detect_from_bytes(contents)
        
        if not detection_result["success"]:
            raise HTTPException(status_code=400, detail=detection_result["error"])
        
        # Interpret the palm features
        interpreter = get_interpreter()
        interpretation = interpreter.interpret(detection_result["features"])
        
        # Combine results
        response = {
            "success": True,
            "handedness": detection_result["handedness"],
            "confidence": detection_result["confidence"],
            "features": detection_result["features"],
            "interpretation": interpretation,
            "overlay": detection_result["overlay"]
        }
        
        logger.info(f"Analysis complete for {file.filename}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# Root endpoint
@app.get("/")
async def root() -> Dict[str, Any]:
    """API root with information"""
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "endpoints": {
            "analyze": "/analyze (POST)",
            "health": "/health (GET)",
            "docs": "/docs"
        }
    }
