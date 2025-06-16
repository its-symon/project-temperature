from fastapi import FastAPI
from contextlib import asynccontextmanager

from app.db import Base, engine
from app.models import User, Temperature
from app.routers.api.v1 import auth, temperature
from app.routers.api.v1 import websocket
from app.utils.scheduler import scheduler
from app.middleware.cors import setup_cors
import redis.asyncio as redis

app = FastAPI()

setup_cors(app)

api_v1_prefix = "/api/v1"


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables at startup
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    # Start Redis
    # local
    # redis_client = redis.from_url("redis://localhost", encoding="utf-8", decode_responses=True)
    # docker
    redis_client = redis.from_url("redis://redis:6379", encoding="utf-8", decode_responses=True)

    app.state.redis = redis_client

    # Start scheduler
    if not scheduler.running:
        print("Starting scheduler...")
        scheduler.start()

    yield

    # Clean up
    await redis_client.close()
    print("Redis connection closed.")


app.router.lifespan_context = lifespan

app.include_router(websocket.router)
app.include_router(auth.router, prefix=f"{api_v1_prefix}/auth")
app.include_router(temperature.router, prefix=f"{api_v1_prefix}/temperature")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Temperature Monitoring API!"}
