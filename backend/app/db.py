from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Local
# SQLALCHEMY_DATABASE_URL = "postgresql://postgres:12345@localhost:5432/temperature_db"
# Docker
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:12345@db:5432/temperature_db"


engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10,
    max_overflow=10,
    pool_timeout=20,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
