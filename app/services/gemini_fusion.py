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
    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        raise RuntimeError(f"Gemini API error: {str(e)}")
