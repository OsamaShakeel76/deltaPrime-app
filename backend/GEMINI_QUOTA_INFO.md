# Gemini API Quota Issue

## Current Status

Your Gemini API key is **working correctly**, but the **free tier quota has been exhausted**.

## Error Details

The API is returning:
- `429 ResourceExhausted`
- Quota exceeded for free tier
- Daily/minute limits reached

## Solutions

### Option 1: Wait for Quota Reset
- Free tier quotas reset daily
- Wait 24 hours and try again
- Check quota status at: https://ai.dev/rate-limit

### Option 2: Use a Different API Key
- Create a new API key at: https://aistudio.google.com/app/apikey
- Update `GEMINI_API_KEY` in `backend/.env`

### Option 3: Upgrade to Paid Plan
- Visit: https://ai.google.dev/pricing
- Paid plans have higher quotas

### Option 4: Use Alternative Model
The code now tries multiple models:
- `gemini-flash-latest` (most available)
- `gemini-2.0-flash-lite` (lighter, may have different quotas)
- `gemini-2.0-flash`
- `gemini-pro-latest`

## Current Model Configuration

The backend automatically tries different models if one fails. Check backend logs to see which model is being used.

## Testing

To test if quota has reset:
```bash
cd backend
source venv/bin/activate
python -c "
import google.generativeai as genai
from config import GEMINI_API_KEY
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-flash-latest')
response = model.generate_content('Hello')
print(response.text)
"
```

## Note

The chatbot will show a user-friendly message when quota is exceeded, directing users to contact directly.



