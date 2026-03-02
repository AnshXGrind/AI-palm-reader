"""
Configuration management for the AI Palm Reader backend.
Loads settings from environment variables with sensible defaults.
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import secrets


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "AI Palm Reader"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1
    
    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ai-palm-reader.vercel.app",
        "*"  # Allow all for development
    ]
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".webp"]
    
    # Mediapipe Settings
    MIN_DETECTION_CONFIDENCE: float = 0.5
    MIN_TRACKING_CONFIDENCE: float = 0.5
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 60
    RATE_LIMIT_PERIOD: int = 60  # seconds
    
    # Redis (optional)
    REDIS_URL: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Create global settings instance
settings = Settings()
