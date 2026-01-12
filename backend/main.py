from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import CORS_ORIGINS
from routes import contact, chat, services

# Create FastAPI app
app = FastAPI(
    title="DeltaPrime AI Solutions API",
    description="Backend API for DeltaPrime AI Solutions website",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(contact.router, prefix="/api", tags=["Contact"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(services.router, prefix="/api", tags=["Services"])

@app.get("/")
def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "DeltaPrime AI Solutions API is running",
        "version": "1.0.0"
    }

@app.get("/api/health")
def api_health():
    """API health check"""
    return {
        "status": "healthy",
        "endpoints": {
            "contact": "/api/contact",
            "chat": "/api/chat",
            "services": "/api/services/quote"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

