from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import os
import tempfile
from services.gemini import transcribe_audio
from services.rag import get_rag_response
from database import get_supabase

router = APIRouter()

@router.post("/transcribe")
async def transcribe_voice(audio: UploadFile = File(...), session_id: str = Form(...)):
    """
    Transcribe audio to text using Google Gemini API
    """
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
            content = await audio.read()
            tmp_file.write(content)
            tmp_path = tmp_file.name
        
        try:
            # Transcribe audio using Gemini
            transcribed_text = transcribe_audio(tmp_path)
            
            if not transcribed_text:
                raise HTTPException(status_code=400, detail="Could not transcribe audio")
            
            # Get RAG-based response (context-aware only)
            response, sources = await get_rag_response(transcribed_text)
            
            # Save voice interaction to database
            try:
                supabase = get_supabase()
                supabase.table("voice_interactions").insert({
                    "session_id": session_id,
                    "user_input": transcribed_text,
                    "bot_response": response,
                    "sources_used": sources,
                    "interaction_type": "voice"
                }).execute()
            except Exception as db_error:
                print(f"Database logging failed: {db_error}")
            
            return JSONResponse({
                "transcribed_text": transcribed_text,
                "response": response,
                "sources": sources,
                "session_id": session_id,
                "status": "success"
            })
        finally:
            # Clean up temp file
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
    
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        raise HTTPException(status_code=500, detail=f"Transcription error: {str(e)}")
