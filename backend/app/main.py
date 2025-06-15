from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.routers.api.v1 import auth, temperature
from app.utils.scheduler import scheduler
import redis.asyncio as redis

app = FastAPI()

api_v1_prefix = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start Redis
    redis_client = redis.from_url("redis://localhost", encoding="utf-8", decode_responses=True)
    app.state.redis = redis_client

    # No middleware needed for Option 1 - rate limiting is handled in dependencies

    # Start scheduler
    if not scheduler.running:
        print("Starting scheduler...")
        scheduler.start()

    yield

    # Clean up
    await redis_client.close()
    print("Redis connection closed.")

# Set the lifespan
app.router.lifespan_context = lifespan

app.include_router(auth.router, prefix=f"{api_v1_prefix}/auth")
app.include_router(temperature.router, prefix=f"{api_v1_prefix}/temperature")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Temperature Monitoring API!"}

# from app.db import Base, engine
# from app.models import User, Temperature 

# def create_table():
#     print("Creating tables...")
#     Base.metadata.create_all(bind=engine)
#     print("Tables created.")

# if __name__ == "__main__":
#     create_table()
