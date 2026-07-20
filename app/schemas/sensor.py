from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class SensorBase(BaseModel):
    name: str = Field(..., max_length=100)
    sensor_type: str
    description: Optional[str] = None
    location: Optional[str] = None

class SensorCreate(SensorBase):
    pass

class SensorResponse(SensorBase):
    id: int
    user_id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class SensorDataCreate(BaseModel):
    sensor_id: int
    raw_data: Dict[str, Any]

class SensorDataResponse(BaseModel):
    id: int
    sensor_id: int
    timestamp: datetime
    raw_data: Dict[str, Any]
    
    class Config:
        from_attributes = True