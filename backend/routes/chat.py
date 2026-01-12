from fastapi import APIRouter, HTTPException
from models import ChatRequest
from services.rag import get_rag_response
from services.meeting_scheduler import detect_meeting_request, extract_meeting_info, format_meeting_response
from database import get_supabase

router = APIRouter()

@router.post("/chat")
async def chat_message(request: ChatRequest):
    """
    Handle AI chat messages with RAG and meeting scheduling
    """
    try:
        # Check if user wants to schedule a meeting
        if detect_meeting_request(request.message):
            meeting_info = extract_meeting_info(request.message)
            
            # Save meeting request to database (if Supabase configured)
            try:
                supabase = get_supabase()
                supabase.table("meeting_requests").insert({
                    "session_id": request.session_id,
                    "name": meeting_info.get('name'),
                    "email": meeting_info.get('email'),
                    "preferred_date": meeting_info.get('preferred_date'),
                    "preferred_time": meeting_info.get('preferred_time'),
                    "purpose": request.message,
                    "service_interest": meeting_info.get('service_interest'),
                    "status": "pending"
                }).execute()
            except Exception as e:
                print(f"Database not available (meeting request logged): {e}")
            
            # Format meeting response
            response = format_meeting_response(meeting_info, request.message)
            sources = []
        else:
            # Get RAG response for regular questions
            response, sources = await get_rag_response(request.message)
        
        # Try to save messages to database (optional)
        try:
            supabase = get_supabase()
            # Save user message
            supabase.table("chat_messages").insert({
                "session_id": request.session_id,
                "role": "user",
                "content": request.message
            }).execute()
            
            # Save assistant response
            supabase.table("chat_messages").insert({
                "session_id": request.session_id,
                "role": "assistant",
                "content": response
            }).execute()
        except Exception as e:
            print(f"Database not available (chat still works): {e}")
        
        return {
            "response": response,
            "sources": sources,
            "cached": False
        }
        
    except Exception as e:
        print(f"Chat error: {e}")
        return {
            "response": "I encountered an error. Please contact us directly at hello@deltaprime.ai",
            "sources": [],
            "error": "api_error"
        }
