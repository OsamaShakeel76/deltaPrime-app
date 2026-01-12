from fastapi import APIRouter, HTTPException
from models import ServiceInquiry
from database import get_supabase

router = APIRouter()

@router.post("/services/quote")
async def submit_service_inquiry(inquiry: ServiceInquiry):
    """
    Handle service inquiry/quote requests
    """
    supabase = get_supabase()
    
    try:
        # Save service inquiry
        result = supabase.table("service_inquiries").insert({
            "name": inquiry.name,
            "email": inquiry.email,
            "service_type": inquiry.service_type,
            "message": inquiry.message
        }).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save service inquiry")
        
        # Save email with service interest
        try:
            supabase.table("user_emails").upsert({
                "email": inquiry.email,
                "source": "service_inquiry",
                "service_interest": inquiry.service_type
            }).execute()
        except Exception as e:
            print(f"Error saving email: {e}")
        
        return {
            "success": True,
            "inquiry_id": result.data[0]["id"],
            "message": "Thank you! We'll contact you within 24 hours."
        }
        
    except Exception as e:
        print(f"Service inquiry error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process service inquiry")

