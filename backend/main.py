"""
FastAPI app. This file only handles HTTP concerns:
receive request -> validate with schemas -> call the agent -> return response.

All the tool-calling logic lives in agent.py, on purpose.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from schemas import ChatRequest, ChatResponse
from agent import run_agent

app = FastAPI(title="LangChain + Tavily Chatbot API")

# Allows the Next.js dev server (localhost:3000) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        history_dicts = [msg.model_dump() for msg in request.history]
        result = run_agent(request.message, history_dicts)
        return ChatResponse(reply=result["reply"], used_tool=result["used_tool"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))