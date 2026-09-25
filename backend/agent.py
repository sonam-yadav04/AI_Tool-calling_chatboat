from langchain_groq import ChatGroq
from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from tools import all_tools
from config import GROQ_API_KEY

llm = ChatGroq(
    model= "openai/gpt-oss-20b",
    groq_api_key= GROQ_API_KEY,
    temperature= 0.2,
   
)

prompt = ChatPromptTemplate.from_messages(
    [
      ("system", "You are a helpful assistant with access to a web search tool. "
           "When you use search results, base your answer ONLY on what the "
           "tool returns — do not supplement with your own prior knowledge "
           "about dates or figures, since your training data may be outdated. "
           "If the search results don't include a clear date, say so explicitly "
           "rather than guessing."),
       MessagesPlaceholder(variable_name="chat_history"),
       ("human","{input}"),
       MessagesPlaceholder(variable_name="agent_scratchpad")
    ]
)

agent = create_tool_calling_agent(llm=llm,tools=all_tools,prompt=prompt)

agent_excutor = AgentExecutor(
    agent= agent,
    tools=all_tools,
    verbose=True,
    max_iterations=5,
    return_intermediate_steps=True,
)

def _to_history(history:list[dict])->list:
    converted =  []
    for msg in history:
        if msg["role"] == "user":
            converted.append(HumanMessage(content=msg["content"]))
        else:

            converted.append(AIMessage(content=msg["content"]))
    return converted

def run_agent(user_input:str, history:list[dict])->dict:
    result = agent_excutor.invoke(
        {
            "input": user_input,
            "chat_history": _to_history(history),
        }
    )
    used_tools =len(result.get("intermediate_steps",[])) >0

    return {
        "reply":result["output"],
        "used_tool":used_tools
        
    }
    
    


