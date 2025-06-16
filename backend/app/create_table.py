from app.db import Base, engine
from app.models.user import User
from app.models.temperature import Temperature

def create_tables():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

if __name__ == "__main__":
    create_tables()
