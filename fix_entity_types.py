import json
import os

# Ścieżka do pliku JSON
json_file_path = 'packages/demo/public/ai_news_dataset.json'

# Sprawdzamy, czy plik JSON istnieje
if not os.path.exists(json_file_path):
    print(f"Plik {json_file_path} nie istnieje!")
    exit(1)

# Wczytujemy dane z pliku JSON
with open(json_file_path) as f:
    data = json.load(f)

print(f"Wczytano {len(data['nodes'])} węzłów z pliku JSON")

# Naprawiamy entity_type w węzłach
fixed_nodes = 0
for node in data['nodes']:
    # Sprawdzamy, czy węzeł ma pole entity_type
    if 'entity_type' in node:
        # Obecnie entity_type jest ustawiony na pierwszą kategorię z entity_category
        # Powinien być ustawiony na wartość z kolumny entity_type z CSV
        
        # W tym przypadku musimy ręcznie naprawić entity_type dla znanych węzłów
        if node['label'] == 'Artificial Intelligence':
            node['entity_type'] = 'Concept'
            fixed_nodes += 1
        elif node['label'] == 'Generative AI':
            node['entity_type'] = 'Model'
            fixed_nodes += 1
        elif node['label'] == 'Large Language Models':
            node['entity_type'] = 'Model'
            fixed_nodes += 1
        elif node['label'] == 'Machine Learning':
            node['entity_type'] = 'Field'
            fixed_nodes += 1
        elif node['label'] == 'Computer Vision':
            node['entity_type'] = 'Field'
            fixed_nodes += 1
        elif node['label'] == 'Digital Twins':
            node['entity_type'] = 'Technology'
            fixed_nodes += 1
        elif node['label'] == '3D Modeling':
            node['entity_type'] = 'Technology'
            fixed_nodes += 1
        elif node['label'] == 'Data Capture':
            node['entity_type'] = 'Method'
            fixed_nodes += 1
        elif node['label'] == 'AEC':
            node['entity_type'] = 'Field'
            fixed_nodes += 1
        elif node['label'] == 'Urban Planning':
            node['entity_type'] = 'Field'
            fixed_nodes += 1
        elif node['label'] == 'Facility Management':
            node['entity_type'] = 'Field'
            fixed_nodes += 1
        elif node['label'] == '5G':
            node['entity_type'] = 'Technology'
            fixed_nodes += 1
        elif node['label'] == 'IoT Sensors':
            node['entity_type'] = 'Technology'
            fixed_nodes += 1
        elif node['label'] == 'Data Centers':
            node['entity_type'] = 'Location'
            fixed_nodes += 1
        elif node['label'] == 'Energy Industry':
            node['entity_type'] = 'Field'
            fixed_nodes += 1
        elif node['label'] == 'Singapore':
            node['entity_type'] = 'Location'
            fixed_nodes += 1
        elif node['label'] == 'Mediterranean':
            node['entity_type'] = 'Location'
            fixed_nodes += 1
        elif node['label'] == 'Matt Collins':
            node['entity_type'] = 'Person'
            fixed_nodes += 1
        elif node['label'] == 'Geo Week':
            node['entity_type'] = 'Event'
            fixed_nodes += 1
        elif node['label'] == 'Diversified Communications':
            node['entity_type'] = 'Organization'
            fixed_nodes += 1
        elif node['label'] == 'AI Age':
            node['entity_type'] = 'Concept'
            fixed_nodes += 1

print(f"Naprawiono {fixed_nodes} węzłów")

# Zapisujemy poprawione dane do pliku JSON
with open(json_file_path, 'w') as f:
    json.dump(data, f, indent=2)

print(f"Zapisano poprawione dane do pliku {json_file_path}")
print("Teraz uruchom ponownie aplikację, aby zobaczyć poprawione typy encji w panelu typów") 