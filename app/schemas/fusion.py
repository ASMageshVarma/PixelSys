from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class FusionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    sensor_ids: List[int] = Field(..., min_length=1, max_length=10)
    fusion_config: Optional[Dict[str, Any]] = {}

class FusionResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str]
    status: str
    sensor_ids: List[int]
    fused_data: Optional[Dict[str, Any]]
    fusion_result: Optional[str]
    created_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True