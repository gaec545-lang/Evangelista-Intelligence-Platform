.PHONY: setup qdrant ingest search test watch stats

setup:
	pip install -r requirements.txt
	ollama pull nomic-embed-text
	docker compose up -d

qdrant:
	docker compose up -d qdrant

ingest:
	python -m cli.ingest --vault-path ./evangelista-vault

search:
	python -m cli.search "$(q)" --agent $(agent)

test:
	pytest tests/ -v

watch:
	python -m cli.ingest --vault-path ./evangelista-vault --watch

stats:
	python -m cli.ingest --stats
