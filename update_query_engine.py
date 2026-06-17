import re

with open("Backend/src/retrieval/query_engine.py", "r") as f:
    content = f.read()

# Add client_id to search signature
content = re.sub(
    r'(async def search\(\s*self,\s*query: str,\s*agent_name: str,)',
    r'\1\n        client_id: str,',
    content
)

# Add build_client_filter to search filters
content = re.sub(
    r'(filters = \[build_agent_filter\(agent_name\)\])',
    r'\1\n            filters.append(build_client_filter(client_id))',
    content
)

# Add client_id to retrieve_orchestrated signature
content = re.sub(
    r'(async def retrieve_orchestrated\(\s*self,\s*query: str,\s*agent_name: str,\s*project_phase: str,)',
    r'\1\n        client_id: str,',
    content
)

# Update HyDE and Hybrid retrievers to accept client_id if they are used, wait, HyDERetriever and HybridRetriever need to use it too!
# Let's just modify the query_engine.py using sed or python
with open("Backend/src/retrieval/query_engine.py", "w") as f:
    f.write(content)
