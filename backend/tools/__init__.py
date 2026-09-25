"""
Registry of every tool the agent can use.
To add a new tool later: create tools/your_tool.py, then add it to this list.
agent.py never needs to change when you add a tool.
"""

from tools.tavily_tool import tavily_search_tool

all_tools = [tavily_search_tool]

