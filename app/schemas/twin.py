from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ChatTurn(BaseModel):
    sender: str  # "user" | "twin"
    text: str


class TwinChatRequest(BaseModel):
    message: str
    profile: Dict[str, Any] = {}
    history: List[ChatTurn] = []


class TwinChatResponse(BaseModel):
    reply: str
    quick_replies: List[str] = []
    source: str  # "gemini" | "demo_mode" | "fallback"


class TwinInsightsRequest(BaseModel):
    profile: Dict[str, Any] = {}


class InsightCard(BaseModel):
    icon: str
    title: str
    detail: str
    tag: str


class TwinInsightsResponse(BaseModel):
    insights: List[InsightCard]
    source: str  # "gemini" | "demo_mode" | "fallback"
