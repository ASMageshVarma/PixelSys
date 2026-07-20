from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class FusionSession(Base):
    __tablename__ = "fusion_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="pending")
    sensor_ids = Column(JSON, nullable=False)
    fusion_config = Column(JSON, default={})
    fused_data = Column(JSON)
    fusion_result = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)

    owner = relationship("User", back_populates="fusion_sessions")