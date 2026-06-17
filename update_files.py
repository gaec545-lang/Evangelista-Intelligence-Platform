import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    content = re.sub(r'(?m)^last_ingested:.*', 'last_ingested: null', content)
    content = re.sub(r'(?m)^chunk_count:.*', 'chunk_count: null', content)

    content = re.sub(r'#fase-1-foundation|#foundation(?!\S)', '#diagnostico', content, flags=re.IGNORECASE)
    content = re.sub(r'#fase-2-architecture|#architecture(?!\S)', '#diseno-implementacion', content, flags=re.IGNORECASE)
    content = re.sub(r'#fase-3-sentinel|#sentinel(?!\S)', '#transferencia-control', content, flags=re.IGNORECASE)

    parts = content.split('```')
    for i in range(len(parts)):
        if i % 2 == 0:
            sub_parts = parts[i].split('`')
            for j in range(len(sub_parts)):
                if j % 2 == 0:
                    sub_parts[j] = re.sub(r'\bFoundation\b', 'Fase 01 - Diagnóstico', sub_parts[j])
                    sub_parts[j] = re.sub(r'\bArchitecture\b', 'Fase 02 - Diseño e implementación', sub_parts[j])
                    sub_parts[j] = re.sub(r'\bSentinel\b', 'Fase 03 - Transferencia y control', sub_parts[j])
                    
                    sub_parts[j] = re.sub(r'\bfoundation\b', 'fase 01 - diagnóstico', sub_parts[j])
                    sub_parts[j] = re.sub(r'\barchitecture\b', 'fase 02 - diseño e implementación', sub_parts[j])
                    sub_parts[j] = re.sub(r'\bsentinel\b', 'fase 03 - transferencia y control', sub_parts[j])
            parts[i] = '`'.join(sub_parts)
    
    new_content = '```'.join(parts)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

vault_dir = r"e:\Evangelista & Co\Evangelista Intelligence Platform\Evangelista-Obsidian\evangelista-vault"
files_to_process = [
    r"frameworks\data-architecture\ARCH-002-mdm-golden-record.md",
    r"frameworks\data-architecture\ARCH-001-kimball-model.md",
    r"frameworks\data-architecture\ARCH-003-kpi-design-gqm.md",
    r"frameworks\data-architecture\ARCH-004-data-contracts.md",
    r"frameworks\data-architecture\FWK-074-system-integration-patterns.md",
]

monitoreo_dir = os.path.join(vault_dir, r"frameworks\monitoreo-control")
for f in os.listdir(monitoreo_dir):
    if f.endswith('.md'):
        files_to_process.append(os.path.join(r"frameworks\monitoreo-control", f))

for rel_path in files_to_process:
    full_path = os.path.join(vault_dir, rel_path)
    if os.path.exists(full_path):
        process_file(full_path)
    else:
        print(f"File not found: {full_path}")

