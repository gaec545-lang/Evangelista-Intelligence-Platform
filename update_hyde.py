import re

with open("Backend/src/retrieval/hyde_retriever.py", "r") as f:
    content = f.read()

content = content.replace("from .filters import build_agent_filter", "from .filters import build_agent_filter, build_client_filter, combine_filters")

content = re.sub(
    r'(async def retrieve\(\s*self,\s*query: str,\s*agent_name: str,)',
    r'\1\n        client_id: str,',
    content
)

content = re.sub(
    r'(agent_filter = build_agent_filter\(agent_name\))',
    r'\1\n            client_filter = build_client_filter(client_id)\n            combined_filter = combine_filters(agent_filter, client_filter)',
    content
)

content = content.replace("query_filter=agent_filter,", "query_filter=combined_filter,")

with open("Backend/src/retrieval/hyde_retriever.py", "w") as f:
    f.write(content)
