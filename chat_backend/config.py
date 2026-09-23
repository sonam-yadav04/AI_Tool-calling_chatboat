"""
Single place where environment variables are loaded.
Every other file imports from here instead of calling os.getenv directly.
"""

import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

 
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing. Add it to your .env file.")
 
if not TAVILY_API_KEY:
    raise ValueError("TAVILY_API_KEY is missing. Add it to your .env file.")
