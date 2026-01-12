"""
Meeting scheduling service
Detects meeting requests and extracts information
"""
import re
from datetime import datetime
from typing import Optional, Dict

def detect_meeting_request(message: str) -> bool:
    """
    Detect if user wants to schedule a meeting
    """
    meeting_keywords = [
        'meeting', 'schedule', 'book', 'appointment', 'consultation',
        'call', 'discuss', 'talk', 'demo', 'presentation', 'arrange',
        'set up', 'setup', 'organize', 'coordinate', 'plan a meeting'
    ]
    
    message_lower = message.lower()
    return any(keyword in message_lower for keyword in meeting_keywords)

def extract_meeting_info(message: str) -> Dict[str, Optional[str]]:
    """
    Extract meeting information from user message
    """
    info = {
        'name': None,
        'email': None,
        'preferred_date': None,
        'preferred_time': None,
        'purpose': None,
        'service_interest': None
    }
    
    message_lower = message.lower()
    
    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, message)
    if emails:
        info['email'] = emails[0]
    
    # Extract service interest
    services = ['web development', 'app development', 'ai development', 'qa', 'devops', 'web dev', 'app dev', 'ai dev']
    for service in services:
        if service in message_lower:
            info['service_interest'] = service
            break
    
    # Extract date patterns
    date_patterns = [
        r'\b(today|tomorrow|next week|next month)\b',
        r'\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b',
        r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',
    ]
    for pattern in date_patterns:
        matches = re.findall(pattern, message_lower)
        if matches:
            info['preferred_date'] = matches[0]
            break
    
    # Extract time patterns
    time_patterns = [
        r'\b\d{1,2}:\d{2}\s*(am|pm)\b',
        r'\b\d{1,2}\s*(am|pm)\b',
        r'\b(morning|afternoon|evening)\b',
    ]
    for pattern in time_patterns:
        matches = re.findall(pattern, message_lower)
        if matches:
            info['preferred_time'] = matches[0]
            break
    
    return info

def format_meeting_response(meeting_info: Dict, user_message: str) -> str:
    """
    Format a response for meeting scheduling
    """
    response_parts = [
        "I'd be happy to help you schedule a meeting with our team! 📅"
    ]
    
    if meeting_info.get('email'):
        response_parts.append(f"I have your email: {meeting_info['email']}")
    else:
        response_parts.append("To proceed, I'll need your email address.")
    
    if meeting_info.get('service_interest'):
        response_parts.append(f"I see you're interested in {meeting_info['service_interest']}.")
    
    if meeting_info.get('preferred_date') or meeting_info.get('preferred_time'):
        response_parts.append("I've noted your preferred time.")
    
    response_parts.append(
        "\nOur team will contact you within 24 hours to confirm the meeting details. "
        "In the meantime, you can also contact us directly at hello@deltaprime.ai or call +1 (234) 567-890."
    )
    
    return "\n".join(response_parts)

