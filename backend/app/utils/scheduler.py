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
        unit = random.choice(["celsius", "fahrenheit"])

        if unit == "celsius":
            temp_value = round(random.uniform(15, 45), 2)
        else:  # fahrenheit
            temp_value = round(random.uniform(59, 113), 2)

        temp = Temperature(temperature=temp_value, unit=unit)
        db.add(temp)
        db.commit()
        db.refresh(temp)

        print(f"Inserted temperature: {temp_value} {unit}")

        data = {
            "temperature": temp_value,
            "unit": unit,
            "timestamp": temp.timestamp.isoformat()
        }

        asyncio.run(manager.broadcast(data))

    except Exception as e:
        print("Error inserting temperature:", e)
    finally:
        db.close()

scheduler = BackgroundScheduler()
scheduler.add_job(insert_temperature, "interval", seconds=20)
scheduler.start()
