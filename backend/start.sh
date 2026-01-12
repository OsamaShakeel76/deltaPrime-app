#!/bin/bash
# Start script for backend server

# Activate virtual environment
source venv/bin/activate

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

