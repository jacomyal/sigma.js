import csv
import json

# Przykładowe dane CSV
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
ent,Machine Learning,Field,"AI, Data Analysis, Pattern Recognition","Type of AI that learns from data without explicit programming",90,1"""

# Zapisz dane CSV do pliku tymczasowego
with open('temp_entities.csv', 'w') as f:
    f.write(csv_data)

# Wczytaj dane CSV
entities = []
with open('temp_entities.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        entities.append(row)

print(f"Wczytano {len(entities)} encji z pliku CSV")

# Wczytaj dane z pliku JSON
with open('packages/demo/public/ai_news_dataset.json') as f:
    data = json.load(f)

print(f"Liczba węzłów w pliku JSON: {len(data['nodes'])}")

# Sprawdź, jak entity_type z CSV jest interpretowane w JSON
entity_types_in_csv = {}
for entity in entities:
    entity_name = entity['entity_name']
    entity_type = entity['entity_type']
    entity_types_in_csv[entity_name] = entity_type

# Sprawdź, jak entity_type jest zapisane w JSON
entity_types_in_json = {}
for node in data['nodes']:
    if 'label' in node and 'entity_type' in node:
        label = node['label']
        entity_type = node['entity_type']
        entity_types_in_json[label] = entity_type

# Porównaj entity_type między CSV a JSON
print("\nPorównanie entity_type między CSV a JSON:")
for entity_name, csv_type in entity_types_in_csv.items():
    if entity_name in entity_types_in_json:
        json_type = entity_types_in_json[entity_name]
        match = "ZGODNE" if csv_type == json_type else "NIEZGODNE"
        print(f"Encja: {entity_name}")
        print(f"  CSV entity_type: {csv_type}")
        print(f"  JSON entity_type: {json_type}")
        print(f"  Status: {match}")

# Sprawdź, jakie unikalne typy encji są w CSV
unique_types_csv = set(entity_types_in_csv.values())
print(f"\nUnikalne typy encji w CSV ({len(unique_types_csv)}):")
for t in sorted(unique_types_csv):
    print(f"  - {t}")

# Sprawdź, jakie unikalne typy encji są w JSON
unique_types_json = set(entity_types_in_json.values())
print(f"\nUnikalne typy encji w JSON ({len(unique_types_json)}):")
for t in sorted(unique_types_json):
    print(f"  - {t}")

# Sprawdź kod, który przetwarza entity_type w fetch_graph_data.py
print("\nZalecane sprawdzenie kodu w fetch_graph_data.py, który przetwarza entity_type") 