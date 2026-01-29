import google.generativeai as genai
from config import GEMINI_API_KEY
import os

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use gemini-flash-latest (most available in free tier)
    # Will try other models in generate_response if this fails
    model = genai.GenerativeModel('gemini-flash-latest')
else:
    model = None

async def generate_response(context: str, query: str):
    """
    Generate AI response using Gemini Flash
    """
    if not GEMINI_API_KEY:
        return "AI service is not configured. Please set GEMINI_API_KEY in environment variables."
    
    system_prompt = """You are Delta, the AI assistant for DeltaPrime AI Solutions.
We offer: Web Development, App Development, AI Development, QA Services, and DevOps.

IMPORTANT: If a user wants to schedule a meeting, arrange a call, book an appointment, or discuss their project, 
you should help them schedule a meeting. Ask for their email and preferred time if not provided.

Answer questions based ONLY on the provided context about our services.
If the answer isn't in the context, politely say you don't have that information 
and suggest contacting the team directly at hello@deltaprime.ai or through our contact form.

Be friendly, professional, and concise. Keep responses under 200 words."""

    prompt = f"""{system_prompt}

Context:
{context}

Question: {query}

Answer:"""
    
    # Try different models if one fails
    model_names = ['gemini-flash-latest', 'gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-pro-latest']
    
    for model_name in model_names:
        try:
            current_model = genai.GenerativeModel(model_name)
            response = current_model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.8,
                    "top_k": 40,
                    "max_output_tokens": 512,
                }
            )
            return response.text
        except Exception as e:
            error_str = str(e)
            # If quota exceeded, don't try other models
            if "429" in error_str or "quota" in error_str.lower() or "rate" in error_str.lower() or "ResourceExhausted" in error_str:
                return "I've reached my API quota limit for today. Please try again tomorrow or contact us directly at hello@deltaprime.ai for immediate assistance."
            # If model not found, try next model
            if "NotFound" in error_str or "404" in error_str:
                continue
            # Other errors, try next model
            continue
    
    # All models failed
    return "I'm currently unavailable. Please contact us directly at hello@deltaprime.ai"


def transcribe_audio(audio_path: str):
    """
    Transcribe audio file to text using Gemini API
    """
    if not GEMINI_API_KEY:
        return None
    
    try:
        # Upload the audio file
        audio_file = genai.upload_file(audio_path)
        
        # Use Gemini to transcribe
        model = genai.GenerativeModel('gemini-2.0-flash-lite')
        response = model.generate_content([
            "Please transcribe this audio to text. Return only the transcribed text, nothing else.",
            audio_file
        ])
        
        # Delete the uploaded file
        genai.delete_file(audio_file.name)
        
        return response.text.strip() if response.text else None
    
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return None
