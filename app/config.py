from pydantic_settings import BaseSettings
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    APP_NAME: str = "TwinFusionAI"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    API_V1_PREFIX: str = "/api/v1"

    SECRET_KEY: str = "71524002d939078d7ee0c32fcf2f206c703ce0236f19c73ef97fc2ee40a16ef4"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    DATABASE_URL: str = "sqlite:////tmp/twinfusion.db"
    ALLOWED_ORIGINS: List[str] = ["*"]

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_MAX_TOKENS: int = 4096

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
