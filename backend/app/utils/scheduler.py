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
        # Generating some random value for the temperatures
        temp_value = round(random.uniform(15, 45), 2)
        unit = "celsius"
        temp = Temperature(temperature=temp_value, unit=unit)
        db.add(temp)
        db.commit()
        print("Inserted temperature:", temp_value)

        data = {
            "temperature" : temp_value,
            "unit": unit,
            "timestamp": temp.timestamp.isoformat()
        }

        asyncio.run(manager.broadcast(data))

    except Exception as e:
        print("Error inserting temperature:", e)
    finally:
        db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(insert_temperature, "interval", minutes=5)
scheduler.start()
