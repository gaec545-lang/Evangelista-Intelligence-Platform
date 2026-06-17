with open("Backend/src/retrieval/query_engine.py", "r") as f:
    content = f.read()

content = content.replace("from src.retrieval.filters import build_client_filter, (", "from src.retrieval.filters import build_client_filter\nfrom src.retrieval.filters import (")

with open("Backend/src/retrieval/query_engine.py", "w") as f:
    f.write(content)
