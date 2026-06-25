import asyncio
import httpx
import json
import time

API_URL_ANALYZE = "http://127.0.0.1:8000/api/v1/analyze"
API_URL_CHAT = "http://127.0.0.1:8000/api/v1/chat"

QUERY = "¿Qué frameworks tenemos para mejora y eficiencia de un almacén industrial textil?"

async def validate_analyze_graph():
    print("="*50)
    print("🚀 FASE 1: Enviando petición al Grafo (Analyze Endpoint)")
    print(f"Pregunta: {QUERY}")
    print("="*50)
    
    start_time = time.time()
    
    payload = {
        "task": QUERY,
        "context": {"source": "validation_script"}
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(API_URL_ANALYZE, json=payload)
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                print(f"[OK] Respuesta recibida en {elapsed:.2f}s")
                print("\n🔍 TRAZA DEL GRAFO Y AGENTES:")
                
                node_history = data.get("node_history", [])
                for idx, node in enumerate(node_history):
                    print(f"  Paso {idx+1}: Nodo -> {node.get('node', 'unknown')}")
                
                print(f"\nRuta final tomada: {data.get('route')}")
                print(f"Confianza: {data.get('confidence')}")
                print(f"Errores reportados en el grafo: {data.get('errors', [])}")
                
                print("\n🧠 RESPUESTA DEL LLM:")
                print(data.get("response"))
                
                print("\n🔍 LLM ASIGNADO:")
                sources = data.get("sources", [])
                print(f"Fuentes generativas usadas: {sources}")
                print("Revisar los logs del backend para identificar exactamente el modelo de Groq/Gemma invocado.")
                
            else:
                print(f"[ERROR] Código de estado: {response.status_code}")
                print(response.text)
                
    except Exception as e:
        print(f"[ERROR DE CONEXIÓN] {str(e)}")
        print("Asegúrate de que el backend de Evangelista esté corriendo localmente en el puerto 8000.")

async def validate_chat_rag():
    print("\n" + "="*50)
    print("🚀 FASE 2: Enviando petición al AI Chat (RAG Orchestrator)")
    print(f"Pregunta: {QUERY}")
    print("="*50)
    
    start_time = time.time()
    
    payload = {
        "message": QUERY,
        "agent_name": "consultant",
        "eva_mode": "client"
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(API_URL_CHAT, json=payload)
            elapsed = time.time() - start_time
            
            if response.status_code == 200:
                data = response.json()
                print(f"[OK] Respuesta recibida en {elapsed:.2f}s")
                print("\n🔍 ESTADO DEL RAG Y VAULT:")
                print(f"Status del RAG: {data.get('rag_status')}")
                print(f"Relevancia promedio: {data.get('avg_relevance')}")
                print(f"Retriever usado: {data.get('retriever_used')}")
                
                print("\n🧠 RESPUESTA DEL LLM:")
                print(data.get("message"))
                
                print("\n🔍 LLM ASIGNADO Y AGENTE:")
                print(f"Agente invocado: {data.get('agent_used')}")
                
            else:
                print(f"[ERROR] Código de estado: {response.status_code}")
                print(response.text)
                
    except Exception as e:
        print(f"[ERROR DE CONEXIÓN] {str(e)}")

async def main():
    await validate_analyze_graph()
    await validate_chat_rag()

if __name__ == "__main__":
    asyncio.run(main())
