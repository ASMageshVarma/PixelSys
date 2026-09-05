from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    sender = Column(String, nullable=False)  # 'user' | 'twin'
    text = Column(Text, nullable=False)
    source = Column(String, default="gemini")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    owner = relationship("User", backref="chat_messages")


class CampusOpportunity(Base):
    __tablename__ = "campus_opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)  # 'club', 'hackathon', 'workshop', 'internship'
    description = Column(Text, nullable=False)
    location = Column(String, default="Campus Center")
    deadline = Column(String, default="Open")
    match_tags = Column(String, default="")  # comma-separated tags e.g. "Python,AI,Web Development"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
