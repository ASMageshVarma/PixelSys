from google import genai
from app.config import settings

# Initialize the Gemini GenAI client
client = genai.Client(api_key=settings.GEMINI_API_KEY)

def fuse_sensor_data(sensor_payload: dict) -> str:
    prompt = (
        "You are an expert in campus student opportunity matching and digital twin telemetry. "
        "Analyze and fuse the following student profile, interests, and schedule data to generate "
        "personalized, high-value recommendations and tips:\n\n"
        f"{sensor_payload}"
    )
    
    # Check if the API key is a placeholder or empty
    if settings.GEMINI_API_KEY == "AIzaSyYourGeminiApiKeyHere" or not settings.GEMINI_API_KEY.strip():
        return (
            "🚀 [TwinFusion AI Demo Mode]\n\n"
            "Hey Tarun! Looking at your Monday schedule, you have a 2-hour gap between Python Coding Lab "
            "(ends at 12:00 PM) and Engineering Mathematics (starts at 2:00 PM).\n\n"
            "Since you marked 'AI' and 'Python' as core interests, you should check out the GDSC (Google Developer Student Club) "
            "member induction happening in Tech Block-II at 12:30 PM today. It fits your gap perfectly and directly supports your "
            "ambition to 'Win the Google Student Hackathon'!"
        )

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        # Fallback to mock data instead of throwing a 502/500 error that triggers browser CORS blocks
        return (
            f"🚀 [TwinFusion AI Fallback Mode - Gemini API error: {str(e)}]\n\n"
            "Hello Tarun! Fused your CS schedule and interest profile. You have a 2-hour block on Monday at 12:00 PM. "
            "We recommend joining the local Google Developer coding circle session in Lab 3 to prepare for your Hackathon targets."
        )
