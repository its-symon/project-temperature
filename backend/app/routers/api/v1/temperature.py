from typing import List
from fastapi import APIRouter, HTTPException, Depends, status, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.db import get_db
from app.models.user import User
from app.models.temperature import Temperature
from app.schemas.temperature import TemperatureCreate, TemperatureOut
from app.dependencies import get_current_user
from app.middleware.rate_limiter import temperature_rate_limiter

router = APIRouter()

@router.get("/", response_model=List[TemperatureOut], status_code=status.HTTP_200_OK)
def get_temperature(
    skip: int = 0, limit: int = 10,
    db: Session = Depends(get_db),
    _: bool = Depends(temperature_rate_limiter),
    current_user: User = Depends(get_current_user)
):
    try:
        temperatures = (db.query(Temperature).order_by(Temperature.timestamp.desc()).offset(skip).limit(limit).all())
        if not temperatures:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No temperature data found."
            )
        return temperatures
    except SQLAlchemyError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching temperatures."
        )

@router.post("/", response_model=TemperatureOut, status_code=status.HTTP_201_CREATED)
def create_temperature(
    temp_data: TemperatureCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        temperature = Temperature(
            temperature=temp_data.temperature,
            unit=temp_data.unit
        )
        db.add(temperature)
        db.commit()
        db.refresh(temperature)
        return temperature
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save temperature data."
        )