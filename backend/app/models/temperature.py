from enum import Enum
from sqlalchemy.sql import func
from sqlalchemy import Enum as SqlEnum
from app.db import Base
from sqlalchemy import Column, Integer, Float, DateTime, String


class TemperatureUnit(str, Enum):
    celsius = "celsius"
    fahrenheit = "fahrenheit"


class Temperature(Base):    
    __tablename__ = "temperatures"

    id = Column(Integer, primary_key=True, index=True)
    temperature= Column(Float, nullable=False)
    unit = Column(SqlEnum(TemperatureUnit), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)