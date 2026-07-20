from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.fusion import FusionSession
from app.models.sensor import SensorData
from app.schemas.fusion import FusionCreate, FusionResponse
from app.core.dependencies import get_current_user
from app.services.gemini_fusion import fuse_sensor_data

router = APIRouter(prefix="/fusion", tags=["fusion"])

@router.post("/fuse", response_model=FusionResponse)
async def process_fusion(
    fusion_in: FusionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    session = FusionSession(
        user_id=current_user.id,
        name=fusion_in.name,
        description=fusion_in.description,
        sensor_ids=fusion_in.sensor_ids,
        fusion_config=fusion_in.fusion_config or {},
        status="processing"
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    sensor_data = {}
    for sensor_id in fusion_in.sensor_ids:
        latest = db.query(SensorData).filter(SensorData.sensor_id == sensor_id).order_by(SensorData.timestamp.desc()).first()
        if latest:
            sensor_data[f"sensor_{sensor_id}"] = latest.raw_data

    try:
        insight = await fuse_sensor_data(sensor_data)
        session.status = "completed"
        session.fusion_result = insight
        session.fused_data = sensor_data
        session.completed_at = datetime.utcnow()
        db.commit()
        db.refresh(session)
        return session
    except Exception as e:
        session.status = "failed"
        db.commit()
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"Fusion error: {e}")

@router.get("/sessions", response_model=List[FusionResponse])
def list_sessions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(FusionSession).filter(FusionSession.user_id == current_user.id).order_by(FusionSession.created_at.desc()).all()