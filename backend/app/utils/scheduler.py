import asyncio
from app.services.connection_manager import manager
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.temperature import Temperature
import random  

def insert_temperature():
    db: Session = SessionLocal()
    try:
        celsius_temp = round(random.uniform(15, 45), 2)
        fahrenheit_temp = round((celsius_temp * 9 / 5) + 32, 2)

        celsius_entry = Temperature(temperature=celsius_temp, unit="celsius")
        fahrenheit_entry = Temperature(temperature=fahrenheit_temp, unit="fahrenheit")

        db.add(celsius_entry)
        db.add(fahrenheit_entry)
        db.commit()
        db.refresh(celsius_entry)
        db.refresh(fahrenheit_entry)

        print(f"Inserted Celsius: {celsius_temp} °C")
        print(f"Inserted Fahrenheit: {fahrenheit_temp} °F")

        celsius_data = {
            "temperature": celsius_entry.temperature,
            "unit": celsius_entry.unit,
            "timestamp": celsius_entry.timestamp.isoformat()
        }

        fahrenheit_data = {
            "temperature": fahrenheit_entry.temperature,
            "unit": fahrenheit_entry.unit,
            "timestamp": fahrenheit_entry.timestamp.isoformat()
        }

        asyncio.run(manager.broadcast(celsius_data))
        asyncio.run(manager.broadcast(fahrenheit_data))

    except Exception as e:
        db.rollback()
        print("Error inserting temperature:", e)
    finally:
        db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(insert_temperature, "interval", seconds=2)
scheduler.start()
