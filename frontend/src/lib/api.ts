// This is the only file that knows how to talk to FastAPI backend — everything else just calls the function it exports.
import { ChatMessage, ChatRequest, ChatResponse } from "@/types/chat";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendChatMessage(
    message: string,
    history: ChatMessage[]
): Promise<ChatResponse> {
    const RequestBody: ChatRequest = { message, history }

    const resp = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(RequestBody)
    });
    if (!resp.ok) {
        throw new Error(`backend error : ${resp.status}`)
    }
    const data: ChatResponse = await resp.json();
    return data;

};
