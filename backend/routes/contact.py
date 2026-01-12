from fastapi import APIRouter, HTTPException
from models import ContactForm
from database import get_supabase

router = APIRouter()

@router.post("/contact")
async def submit_contact(form: ContactForm):
    """
    Handle contact form submissions
    """
    try:
        supabase = get_supabase()
    except Exception as e:
        print(f"Supabase not configured: {e}")
        # Return success even if database is not configured (for testing)
        return {
            "success": True,
            "id": "test-id",
            "message": "Contact form received (database not configured)"
        }
    
    try:
        # Save contact submission
        result = supabase.table("contact_submissions").insert({
            "name": form.name,
            "email": form.email,
            "message": form.message
        }).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save contact submission")
        
        # Save email to user_emails table (upsert to avoid duplicates)
        try:
            supabase.table("user_emails").upsert({
                "email": form.email,
                "source": "contact_form"
            }).execute()
        except Exception as e:
            print(f"Error saving email: {e}")
            # Continue even if email save fails
        
        return {
            "success": True,
            "id": result.data[0]["id"]
        }
        
    except Exception as e:
        print(f"Contact submission error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process contact submission")

