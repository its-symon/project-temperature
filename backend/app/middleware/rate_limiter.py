from fastapi import HTTPException, Request, Depends
import redis.asyncio as redis
from functools import wraps


async def get_redis_client(request: Request):
    return request.app.state.redis


class RateLimiter:
    def __init__(self, limit: int = 100, window: int = 1):
        self.limit = limit
        self.window = window

    async def __call__(self, request: Request):
        redis_client = await get_redis_client(request)
        client_ip = request.client.host
        key = f"rate_limit:{client_ip}:temperature_get"

        current_count = await redis_client.incr(key)
        if current_count == 1:
            await redis_client.expire(key, self.window)

        if current_count > self.limit:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Maximum {self.limit} requests per {self.window} seconds allowed."
            )

        return True



temperature_rate_limiter = RateLimiter(limit=100, window=1)

