from pydantic import BaseModel, ConfigDict
import datetime
from app.models.temperature import TemperatureUnit  

class TemperatureCreate(BaseModel):
    temperature: float
    unit: TemperatureUnit

class TemperatureOut(TemperatureCreate):
    id: int
    timestamp: datetime.datetime

    class Config:
        from_attributes = True
