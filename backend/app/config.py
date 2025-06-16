# backend/app/config.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Fix for Docker context — make sure we're pointing to root .env
BASE_DIR = Path(__file__).resolve().parent.parent.parent  # from backend/app -> project_gizan
load_dotenv(dotenv_path=BASE_DIR / ".env")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

print(f"Loaded SECRET_KEY: {SECRET_KEY}")
