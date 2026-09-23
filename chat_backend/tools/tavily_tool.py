"""
The Tavily search tool, wrapped for LangChain.

LangChain ships a built-in TavilySearchResults tool — we use it directly
rather than hand-rolling the HTTP call, but we set the description and
result count ourselves so the agent knows exactly when to reach for it.
"""

import os
from langchain_community.tools.tavily_search import TavilySearchResults
from config import TAVILY_API_KEY

if TAVILY_API_KEY:
    os.environ["TAVILY_API_KEY"] = TAVILY_API_KEY

tavily_search_tool = TavilySearchResults(
    max_results=3,
    name="tavily_search",
    description=(
        "Search the web for current, real-time, or recent information. "
        "Use this when the user asks about news, prices, current events, "
        "specific facts you're unsure about, or anything that could have "
        "changed after your training cutoff."
    ),
)
