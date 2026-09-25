
// This is the shared shape that keeps frontend in sync with your FastAPI schemas.py.

export type MessageRole = "user" | "assistant"

export type ChatMessage = {
    role: MessageRole;
    content: string;
};

export type ChatRequest = {
    message: string;
    history?: ChatMessage[];
};

export type ChatResponse = {
    reply: string;
    used_tool: boolean;
};