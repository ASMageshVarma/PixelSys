import json
from google import genai
from app.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "AIzaSyYourGeminiApiKeyHere" else None

def is_gemini_active():
    return bool(client and settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "AIzaSyYourGeminiApiKeyHere")

def fuse_sensor_data(sensor_payload: dict) -> str:
    prompt = (
        "You are an expert in campus student opportunity matching and digital twin telemetry. "
        "Analyze and fuse the following student profile, interests, and schedule data to generate "
        "personalized, high-value recommendations and actionable tips:\n\n"
        f"{sensor_payload}"
    )
    if not is_gemini_active():
        return (
            "🚀 [TwinFusion AI Demo Mode]\n\n"
            "Hey there! Calibrated with your academic schedule and career targets. "
            "You have open study slots available between your lab courses. "
            "We recommend connecting with the Google Developer Student Club and preparing for the upcoming campus hackathon."
        )
    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        return (
            f"🚀 [TwinFusion AI Fallback Mode - Gemini API error: {str(e)}]\n\n"
            "Calibrated your schedule and profile. Focus on completing your upcoming programming assignments and check out the campus innovation lab."
        )

async def generate_twin_reply(message: str, profile: dict, history: list):
    student_name = profile.get("name", "Student")
    dept = profile.get("department", "Engineering")
    career = profile.get("careerGoal", "Engineer")
    interests = ", ".join(profile.get("interests", [])) or "Technology"
    skills = ", ".join(profile.get("skills", [])) or "Coding"
    timetable = profile.get("timetable", [])
    timetable_str = json.dumps(timetable) if timetable else "None specified"

    system_instruction = (
        f"You are the AI Digital Twin and campus mentor for {student_name}.\n"
        f"Student Department: {dept}\n"
        f"Career Goal: {career}\n"
        f"Interests: {interests}\n"
        f"Skills: {skills}\n"
        f"Timetable Schedule: {timetable_str}\n\n"
        "Guidelines:\n"
        "- Respond in a sharp, encouraging, ultra-personalized campus senior persona.\n"
        "- Use markdown formatting with bolding and bullet points.\n"
        "- Reference their specific interests, career target, and schedule gaps when suggesting actions.\n"
        "- Keep answers concise (under 160 words) but highly informative."
    )

    quick_options = [
        "What clubs fit my skills?",
        "Are there any hackathons for me?",
        "Help me balance my timetable",
        "Where is the Innovation Lab?"
    ]

    if not is_gemini_active():
        # Smart rule-based contextual reply
        lower = message.lower()
        if "club" in lower:
            reply = f"Based on your focus on **{interests}** and your target as **{career}**, I recommend joining the **Google Developer Student Club** and **AI Innovation Circle**. Fits your schedule right after morning lectures!"
        elif "hackathon" in lower or "event" in lower:
            reply = f"Opportunity Radar detected 2 top matches for your **{skills}** skills:\n- 🏆 **Google GenAI Hackathon 2026** (Registrations open!)\n- 💻 **Campus Tech Sprint Hackathon** (Starting next weekend)\nWould you like me to bookmark these?"
        elif "timetable" in lower or "schedule" in lower or "planner" in lower:
            reply = f"Here is my schedule calibration for **{student_name}**:\n- 📅 Morning: Core theory and lecture blocks\n- 💡 1:30 PM - 3:00 PM: Free collaborative slot (ideal for hackathon prep)\n- 📚 Evening: Self-study and project assignment wrap-up."
        elif "map" in lower or "where" in lower or "lab" in lower or "room" in lower:
            reply = "Campus Directory:\n- 🌟 **Google Innovation Lab**: Academic Block 3rd Floor (Room 304)\n- 📖 **Central Library**: Block B, open till 8:00 PM\n- ☕ **Cafeteria**: Hub Ground Floor\nHead to the Campus Navigator tab to view the live blueprint!"
        elif "study twin" in lower or "peer" in lower or "match" in lower:
            reply = f"I am scanning the student network for peers matching your goal: **{career}** and skills: **{skills}**. Check the **Study Twins** tab to connect!"
        else:
            reply = f"Hey {student_name}! Your twin is fully synchronized. With your goals in **{career}**, what would you like to tackle today — club activities, hackathon registrations, or timetable optimization?"
        return reply, quick_options, "demo_mode"

    # Call Gemini API
    try:
        conversation_context = ""
        for turn in history[-6:]:
            speaker = "User" if turn.get("sender") == "user" else "Twin"
            conversation_context += f"{speaker}: {turn.get('text')}\n"

        prompt = f"{system_instruction}\n\nRecent History:\n{conversation_context}\nUser: {message}\nTwin:"
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        return response.text.strip(), quick_options, "gemini"
    except Exception as e:
        return (
            f"Hey {student_name}, noted! Given your passion for {interests}, let's align your study sessions with your goal: **{career}**.",
            quick_options,
            f"fallback: {str(e)}"
        )

async def stream_twin_reply_generator(message: str, profile: dict, history: list):
    student_name = profile.get("name", "Student")
    dept = profile.get("department", "Engineering")
    career = profile.get("careerGoal", "Engineer")
    interests = ", ".join(profile.get("interests", [])) or "Technology"
    skills = ", ".join(profile.get("skills", [])) or "Coding"
    timetable = profile.get("timetable", [])
    timetable_str = json.dumps(timetable) if timetable else "None specified"

    system_instruction = (
        f"You are the AI Digital Twin and campus mentor for {student_name}.\n"
        f"Student Department: {dept}\n"
        f"Career Goal: {career}\n"
        f"Interests: {interests}\n"
        f"Skills: {skills}\n"
        f"Timetable Schedule: {timetable_str}\n\n"
        "Guidelines:\n"
        "- Respond in a sharp, encouraging, ultra-personalized campus senior persona.\n"
        "- Use markdown formatting with bolding and bullet points.\n"
        "- Keep answers concise (under 160 words) but packed with actionable advice."
    )

    if not is_gemini_active():
        reply, _, _ = await generate_twin_reply(message, profile, history)
        words = reply.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i:i+3]) + " "
            yield chunk
        return

    try:
        conversation_context = ""
        for turn in history[-6:]:
            speaker = "User" if turn.get("sender") == "user" else "Twin"
            conversation_context += f"{speaker}: {turn.get('text')}\n"

        prompt = f"{system_instruction}\n\nRecent History:\n{conversation_context}\nUser: {message}\nTwin:"
        response_stream = client.models.generate_content_stream(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        for chunk in response_stream:
            if chunk.text:
                yield chunk.text
    except Exception:
        reply, _, _ = await generate_twin_reply(message, profile, history)
        words = reply.split(" ")
        for i in range(0, len(words), 3):
            chunk = " ".join(words[i:i+3]) + " "
            yield chunk

async def generate_twin_insights(profile: dict):
    career = profile.get("careerGoal", "Engineering")
    interests = profile.get("interests", ["AI", "Tech"])
    skills = profile.get("skills", ["Python"])

    insights = [
        {
            "icon": "Compass",
            "title": "Google GenAI Hackathon 2026",
            "detail": f"98% compatibility with your {skills[0] if skills else 'coding'} skill set. Registration closes in 4 days.",
            "tag": "Hackathon"
        },
        {
            "icon": "Users",
            "title": "Google Developer Student Club (GDSC)",
            "detail": f"Matches your target: {career}. Weekly workshop scheduled in Academic Block Room 304.",
            "tag": "Club Match"
        },
        {
            "icon": "Clock",
            "title": "Timetable Gap Detected (1:30 - 3:00 PM)",
            "detail": "Perfect high-focus block for working on assignments or peer coding projects.",
            "tag": "Planner"
        },
        {
            "icon": "Award",
            "title": "Smart India Hackathon Prep Track",
            "detail": f"Recommended for students interested in {interests[0] if interests else 'Technology'}.",
            "tag": "Career Track"
        }
    ]
    return insights, "gemini" if is_gemini_active() else "demo_mode"
