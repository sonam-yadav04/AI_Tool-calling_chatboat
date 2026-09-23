 
from typing import Literal
from pydantic import BaseModel

class ChatMessage(BaseModel):
    role:Literal["user","assistant"]
    content:str

class ChatRequest(BaseModel):
    message:str
    history: list[ChatMessage]

#to validate repsonse function server side
class ChatResponse(BaseModel):
    reply:str   
    used_tool:bool=False

