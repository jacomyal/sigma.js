import json

with open('packages/demo/public/ai_news_dataset.json') as f:
    data = json.load(f)

print('Przykładowe węzły:')
for i, node in enumerate(data['nodes'][:5]):
    print(f'Węzeł {i+1}:')
    for key, value in node.items():
        print(f'  {key}: {value}')

print('\nSprawdzenie interpretacji entity_type:')
entity_types_mapping = {}
for node in data['nodes']:
    if 'entity_type' in node and node['entity_type']:
        entity_type = node['entity_type']
        label = node.get('label', 'brak etykiety')
        if entity_type not in entity_types_mapping:
            entity_types_mapping[entity_type] = []
        entity_types_mapping[entity_type].append(label)

for entity_type, labels in entity_types_mapping.items():
    print(f'Typ encji: {entity_type}')
    print(f'  Przykładowe encje: {", ".join(labels[:3])}')
    print(f'  Liczba encji: {len(labels)}') 