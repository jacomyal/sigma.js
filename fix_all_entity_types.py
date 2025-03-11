import json
import os
import csv
from io import StringIO

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

# Tworzymy przykładowy plik CSV na podstawie danych z zapytania
csv_data = """type,entity_name,entity_type,entity_category,entity_definition,entity_strength,entity_occurrence
ent,AI Age,Concept,"AI, History, Future","Era defined by the dominant influence of artificial intelligence",75,1
ent,Artificial Intelligence,Concept,"AI, Technology, Innovation","Technology being promoted as a transformative force",100,7
ent,AEC,Field,"Architecture, Engineering, Construction","Sectors including architecture, engineering, and construction",80,2
ent,Urban Planning,Field,"Urban Development, Smart Cities","Planning and development of urban areas",70,2
ent,Facility Management,Field,"Building Operations, Infrastructure","Management of buildings and facilities",70,2
ent,Digital Twins,Technology,"3D Modeling, Data Capture, Simulation","Virtual representations of physical assets or systems",95,14
ent,3D Modeling,Technology,"Visualization, Design, Geospatial","Creating three-dimensional representations of objects or environments",85,2
ent,Data Capture,Method,"Data Collection, Geospatial, Reality Capture","Process of collecting data from the real world",80,2
ent,5G,Technology,"Connectivity, Telecommunications","Fifth generation of wireless technology",75,1
ent,IoT Sensors,Technology,"Internet of Things, Data Collection","Sensors connected to the internet for data collection",85,1
ent,Generative AI,Model,"AI, Content Creation, Machine Learning","Type of AI that generates new content",90,1
ent,Large Language Models,Model,"AI, Natural Language Processing, Machine Learning","AI models that process and generate human language",92,3
ent,Computer Vision,Field,"AI, Image Recognition, Machine Learning","Field of AI that enables computers to see and interpret images",85,1
ent,Machine Learning,Field,"AI, Data Analysis, Pattern Recognition","Type of AI that learns from data without explicit programming",90,1
ent,Data Centers,Location,"Infrastructure, Computing","Facilities housing computer systems and associated components",80,2
ent,Energy Industry,Field,"Energy, Utilities, Sustainability","Industry focused on the production and distribution of energy",75,1
ent,Singapore,Location,"Urban Planning, Smart Cities","City-state known for advanced urban planning and technology",70,1
ent,Mediterranean,Location,"Geography, Regional Planning","Region where digital twin simulations are being used for energy planning",65,1
ent,Matt Collins,Person,"Content Creation, Journalism","Content Specialist at Geo Week",60,2
ent,Geo Week,Event,"Geospatial, Technology, Conference","Conference focused on geospatial technologies",70,7
ent,Diversified Communications,Organization,"Media, Events","Company owning Geo Week and other events",65,2"""

# Parsujemy dane CSV
csv_reader = csv.DictReader(StringIO(csv_data))
entity_types_map = {}
for row in csv_reader:
    entity_name = row['entity_name']
    entity_type = row['entity_type']
    entity_types_map[entity_name] = entity_type

# Lista poprawnych typów encji
valid_entity_types = ["Technology", "Field", "Concept", "Model", "Method", "Location", "Person", "Event", "Organization", "Company", "Service", "Platform", "Tool", "Language", "Framework"]

# Naprawiamy entity_type w węzłach
fixed_nodes = 0
for node in data['nodes']:
    # Sprawdzamy, czy węzeł ma pole entity_type
    if 'entity_type' in node:
        label = node['label']
        
        # Sprawdzamy, czy mamy mapowanie dla tej encji w CSV
        if label in entity_types_map:
            correct_entity_type = entity_types_map[label]
            if node['entity_type'] != correct_entity_type:
                node['entity_type'] = correct_entity_type
                fixed_nodes += 1
                print(f"Naprawiono entity_type dla '{label}': {node['entity_type']} -> {correct_entity_type}")
        # Jeśli nie ma w CSV, sprawdzamy czy obecny typ jest poprawny
        else:
            current_type = node['entity_type']
            if current_type in valid_entity_types:
                print(f"Zachowano entity_type dla '{label}': {current_type}")
            else:
                # Jeśli typ jest niepoprawny, ustawiamy na "Unknown"
                node['entity_type'] = "Unknown"
                fixed_nodes += 1
                print(f"Naprawiono entity_type dla '{label}' (nieznany): {current_type} -> Unknown")

print(f"\nNaprawiono {fixed_nodes} węzłów")

# Zapisujemy poprawione dane do pliku JSON
with open(json_file_path, 'w') as f:
    json.dump(data, f, indent=6)

print(f"Zapisano poprawione dane do pliku {json_file_path}")
print("Teraz uruchom ponownie aplikację, aby zobaczyć poprawione typy encji w panelu typów") 