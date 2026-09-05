from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ProfileUpsert(BaseModel):
    name: str
    department: Optional[str] = None
    year: Optional[str] = None
    section: Optional[str] = None
    careerGoal: Optional[str] = None
    interests: List[str] = []
    clubs: List[str] = []
    skills: List[str] = []
    helpPreferences: List[str] = []
    timetable: Optional[List[dict]] = []


class ProfileResponse(BaseModel):
    name: str
    department: Optional[str]
    year: Optional[str]
    section: Optional[str]
    careerGoal: Optional[str]
    interests: List[str]
    clubs: List[str]
    skills: List[str]
    helpPreferences: List[str]
    timetable: Optional[List[dict]] = []
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
