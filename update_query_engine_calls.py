import re

with open("Backend/src/retrieval/query_engine.py", "r") as f:
    content = f.read()

content = re.sub(
    r'(chunks = await hyde\.retrieve\(query, agent_name, top_k\))',
    r'chunks = await hyde.retrieve(query, agent_name, client_id, top_k)',
    content
)

content = re.sub(
    r'(chunks = await hybrid\.retrieve\(query, agent_name, top_k\))',
    r'chunks = await hybrid.retrieve(query, agent_name, client_id, top_k)',
    content
)

with open("Backend/src/retrieval/query_engine.py", "w") as f:
    f.write(content)
