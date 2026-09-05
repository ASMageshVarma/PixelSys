from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.profile import TwinProfile
from app.schemas.profile import ProfileUpsert, ProfileResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])


def _to_response(p: TwinProfile) -> dict:
    return {
        "name": p.name,
        "department": p.department,
        "year": p.year,
        "section": p.section,
        "careerGoal": p.career_goal,
        "interests": p.interests or [],
        "clubs": p.clubs or [],
        "skills": p.skills or [],
        "helpPreferences": p.help_preferences or [],
        "timetable": p.timetable or [],
        "updated_at": p.updated_at,
    }


@router.post("/me", response_model=ProfileResponse)
def upsert_profile(
    profile_in: ProfileUpsert,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create or update the current user's Digital Twin profile (called after onboarding)."""
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()
    if profile is None:
        profile = TwinProfile(user_id=current_user.id)
        db.add(profile)

    profile.name = profile_in.name
    profile.department = profile_in.department
    profile.year = profile_in.year
    profile.section = profile_in.section
    profile.career_goal = profile_in.careerGoal
    profile.interests = profile_in.interests
    profile.clubs = profile_in.clubs
    profile.skills = profile_in.skills
    profile.help_preferences = profile_in.helpPreferences
    if profile_in.timetable is not None:
        profile.timetable = profile_in.timetable

    db.commit()
    db.refresh(profile)
    return _to_response(profile)


@router.get("/me", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch the current user's persisted Digital Twin profile, if it exists."""
    profile = db.query(TwinProfile).filter(TwinProfile.user_id == current_user.id).first()
    if profile is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No twin profile found for this user yet")
    return _to_response(profile)
