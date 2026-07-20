from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    sensor_type = Column(String, nullable=False)
    description = Column(String)
    location = Column(String)
    
    #  Renamed from 'metadata' to 'sensor_metadata' to avoid conflict
    sensor_metadata = Column(JSON, default={}) 
    
    is_active = Column(Boolean, default=True)
    sampling_rate = Column(Float)
    accuracy = Column(Float)
    
    # Updated to use timezone-aware UTC datetime (avoids deprecation warnings)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="sensors")
    data_points = relationship("SensorData", back_populates="sensor", cascade="all, delete-orphan")

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(Integer, ForeignKey("sensors.id"), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    raw_data = Column(JSON, nullable=False)
    quality_score = Column(Float)

    sensor = relationship("Sensor", back_populates="data_points")