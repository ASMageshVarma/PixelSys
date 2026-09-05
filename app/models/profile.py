from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class TwinProfile(Base):
    """The persisted 'Digital Twin' profile fused from onboarding answers."""
    __tablename__ = "twin_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    name = Column(String, nullable=False)
    department = Column(String)
    year = Column(String)
    section = Column(String)

    career_goal = Column(String)
    interests = Column(JSON, default=list)
    clubs = Column(JSON, default=list)
    skills = Column(JSON, default=list)
    help_preferences = Column(JSON, default=list)
    timetable = Column(JSON, default=list)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    owner = relationship("User", backref="twin_profile", uselist=False)
