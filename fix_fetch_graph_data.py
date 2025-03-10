import pandas as pd
import random
import re

def convert_to_sigma_format_fixed(graph_data, entity_counts, min_occurrence=5):
    # Filtrujemy encje, które występują co najmniej min_occurrence razy
    frequent_entities = {entity: count for entity, count in entity_counts.items() if count >= min_occurrence}
    
    # Przygotowujemy struktury danych
    nodes = []
    edges = []
    cluster_map = {}
    tag_map = {}
    entity_relations = {}
    colors = ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab"]
    
    # Zbieramy najpierw wszystkie relacje
    for graph in graph_data:
        if not 'relations' in graph or not isinstance(graph['relations'], pd.DataFrame):
            continue
            
        if not 'source_entity' in graph['relations'].columns or not 'target_entity' in graph['relations'].columns:
            continue
        
        for _, relation in graph['relations'].iterrows():
            if pd.isna(relation['source_entity']) or pd.isna(relation['target_entity']):
                continue
                
            source = relation['source_entity']
            target = relation['target_entity']
            
            # Pomijamy relacje, których encje nie spełniają kryterium częstości
            if source not in frequent_entities or target not in frequent_entities:
                continue
            
            # Zapisujemy relację dla źródłowej encji
            if source not in entity_relations:
                entity_relations[source] = []
                
            # Dodajemy do listy relacji, jeśli nie istnieje taka sama
            relationship_description = relation['relationship_description'] if 'relationship_description' in relation and pd.notna(relation['relationship_description']) else ""
            relationship_strength = 0
            
            try:
                if 'relationship_strength' in relation and pd.notna(relation['relationship_strength']):
                    relationship_strength = float(relation['relationship_strength'])
            except (ValueError, TypeError):
                pass
                
            new_relation = {
                "source": source,
                "target": target,
                "description": relationship_description,
                "strength": relationship_strength
            }
            
            # Sprawdzamy, czy relacja już istnieje
            if not any(r["source"] == source and r["target"] == target and r["description"] == relationship_description for r in entity_relations[source]):
                entity_relations[source].append(new_relation)
            
            # Dodajemy odwrotną relację dla docelowej encji
            if target not in entity_relations:
                entity_relations[target] = []
                
            # Dodajemy odwrotną relację dla docelowej encji
            reverse_relation = {
                "source": target,
                "target": source,
                "description": relationship_description,
                "strength": relationship_strength,
                "is_reverse": True  # Oznaczamy, że jest to relacja odwrotna
            }
            
            # Sprawdzamy, czy relacja już istnieje
            if not any(r["source"] == target and r["target"] == source and r["description"] == relationship_description for r in entity_relations[target]):
                entity_relations[target].append(reverse_relation)
    
    # Zbieramy wszystkie encje
    for graph in graph_data:
        if not 'entities' in graph or not isinstance(graph['entities'], pd.DataFrame) or 'entity_name' not in graph['entities'].columns:
            continue
            
        if not 'relations' in graph or not isinstance(graph['relations'], pd.DataFrame):
            continue
            
        # Dodajemy encje
        for _, entity in graph['entities'].iterrows():
            entity_name = entity['entity_name']
            
            # Pomijamy encje, które występują rzadziej niż min_occurrence
            if entity_name not in frequent_entities:
                continue
            
            # Pobieramy typ encji (tylko jeden) - POPRAWKA: używamy wartości z kolumny entity_type
            entity_type = ""
            if 'entity_type' in entity and pd.notna(entity['entity_type']):
                entity_type = entity['entity_type'].strip() if isinstance(entity['entity_type'], str) else ""
            
            # Pobieramy kategorie encji (może być wiele)
            categories = []
            if 'entity_category' in entity and pd.notna(entity['entity_category']):
                categories = [cat.strip() for cat in entity['entity_category'].split(',')] if isinstance(entity['entity_category'], str) else []
            
            # Jeśli nie ma kategorii, używamy typu jako kategorii
            if not categories and entity_type:
                categories = [entity_type]
            
            # Usuwamy kategorię "AI" z listy kategorii
            categories = [cat for cat in categories if cat != "AI"]
            
            # Jeśli po usunięciu "AI" nie ma żadnych kategorii, dodajemy "Unknown"
            if not categories:
                categories = ["Unknown"]
            
            # Używamy pierwszej kategorii jako tagu
            tag = categories[0] if categories else "Unknown"
            
            # Upraszczamy tag do jednej kategorii (bez spacji i podkategorii)
            simple_tag = tag.split()[0] if ' ' in tag else tag
            
            # Tworzymy klaster na podstawie wszystkich kategorii
            # Jeśli jest więcej niż jedna kategoria, używamy wszystkich
            cluster = ", ".join(categories) if categories else "Unknown"
            
            # Sprawdzamy, czy ta encja już istnieje w nodes
            existing_node_index = next((i for i, node in enumerate(nodes) if node['key'] == entity_name), None)
            
            if existing_node_index is None:
                # Przypisujemy kolor do klastra, jeśli jeszcze nie istnieje
                if cluster not in cluster_map:
                    color_index = len(cluster_map) % len(colors)
                    cluster_map[cluster] = {
                        "key": cluster,
                        "color": colors[color_index],
                        "clusterLabel": cluster
                    }
                
                # Przypisujemy obraz do tagu, jeśli jeszcze nie istnieje
                if simple_tag not in tag_map:
                    # Mapowanie typów na obrazy
                    tag_images = {
                        "AI": "technology.svg",
                        "Person": "person.svg",
                        "Organization": "organization.svg",
                        "Company": "company.svg",
                        "Tool": "tool.svg",
                        "Application": "technology.svg",
                        "Platform": "technology.svg",
                        "Service": "technology.svg",
                        "Online": "tool.svg",
                        "Community": "organization.svg",
                        "Social": "organization.svg",
                        "News": "organization.svg"
                    }
                    
                    # Wybieramy domyślny obraz
                    image = "unknown.svg"
                    
                    # Szukamy odpowiedniego obrazu na podstawie słów kluczowych w tagu
                    for key, img in tag_images.items():
                        if key.lower() in simple_tag.lower():
                            image = img
                            break
                    
                    tag_map[simple_tag] = {
                        "key": simple_tag,
                        "image": image
                    }
                
                # Obliczamy scoring na podstawie liczby wystąpień
                score = min(1.0, entity_counts[entity_name] / 20)  # Normalizacja, max 1.0
                
                # Przygotowujemy tablicę definicji
                definitions = []
                if 'entity_definition' in entity and pd.notna(entity['entity_definition']) and entity['entity_definition']:
                    # Bezpieczna konwersja entity_strength na liczbę lub wartość domyślna
                    try:
                        if 'entity_strength' in entity and pd.notna(entity['entity_strength']):
                            strength = float(entity['entity_strength'])
                        else:
                            strength = 50.0
                    except (ValueError, TypeError):
                        strength = 50.0
                        
                    definitions.append({
                        "text": entity['entity_definition'],
                        "strength": strength
                    })
                
                # Pobieramy relacje dla tej encji
                relations = entity_relations.get(entity_name, [])
                
                # Dodajemy encję jako węzeł - POPRAWKA: używamy entity_type zamiast tag
                nodes.append({
                    "key": entity_name,
                    "label": entity_name,
                    "tag": simple_tag,
                    "URL": "",
                    "cluster": cluster,
                    "x": random.uniform(-1000, 1000),  # Losowe współrzędne początkowe
                    "y": random.uniform(-1000, 1000),
                    "score": score,
                    "categories": ", ".join(categories) if categories else "Unknown",  # Używamy wszystkich zebranych kategorii
                    "entity_type": entity_type,  # POPRAWKA: używamy wartości z kolumny entity_type
                    "definitions": definitions,
                    "relations": relations
                })
            else:
                # Encja już istnieje, dodajemy nową definicję jeśli istnieje
                if 'entity_definition' in entity and pd.notna(entity['entity_definition']) and entity['entity_definition']:
                    # Bezpieczna konwersja entity_strength na liczbę lub wartość domyślna
                    try:
                        if 'entity_strength' in entity and pd.notna(entity['entity_strength']):
                            strength = float(entity['entity_strength'])
                        else:
                            strength = 50.0
                    except (ValueError, TypeError):
                        strength = 50.0
                    
                    # Dodajemy nową definicję do istniejących
                    definition = {
                        "text": entity['entity_definition'],
                        "strength": strength
                    }
                    
                    # Sprawdzamy czy już mamy taką definicję
                    if "definitions" not in nodes[existing_node_index]:
                        nodes[existing_node_index]["definitions"] = []
                    
                    # Dodajemy tylko jeśli nie ma duplikatu
                    if not any(d["text"] == definition["text"] for d in nodes[existing_node_index]["definitions"]):
                        nodes[existing_node_index]["definitions"].append(definition)
    
    # Dodajemy krawędzie
    edge_keys = set()  # Zbiór do śledzenia unikalnych krawędzi
    
    for graph in graph_data:
        if not 'relations' in graph or not isinstance(graph['relations'], pd.DataFrame):
            continue
            
        if not 'source_entity' in graph['relations'].columns or not 'target_entity' in graph['relations'].columns:
            continue
        
        for _, relation in graph['relations'].iterrows():
            if pd.isna(relation['source_entity']) or pd.isna(relation['target_entity']):
                continue
                
            source = relation['source_entity']
            target = relation['target_entity']
            
            # Pomijamy krawędzie, których encje nie spełniają kryterium częstości
            if source not in frequent_entities or target not in frequent_entities:
                continue
            
            # Tworzymy unikalny klucz dla krawędzi
            edge_key = f"{source}|{target}"
            
            # Sprawdzamy czy ta krawędź już istnieje
            if edge_key not in edge_keys:
                edges.append([source, target])
                edge_keys.add(edge_key)
    
    # Tworzymy wynikowy JSON
    result = {
        "nodes": nodes,
        "edges": edges,
        "clusters": list(cluster_map.values()),
        "tags": list(tag_map.values())
    }
    
    return result

# Komentarz wyjaśniający problem i rozwiązanie
"""
Problem:
W oryginalnym kodzie, wartość entity_type w węźle była ustawiana na pierwszą kategorię z entity_category,
zamiast na wartość z kolumny entity_type z pliku CSV.

Rozwiązanie:
Poprawiona funkcja convert_to_sigma_format_fixed używa wartości z kolumny entity_type jako entity_type węzła,
co pozwala na prawidłowe filtrowanie węzłów w panelu typów.

Aby naprawić istniejące dane, można użyć skryptu fix_entity_types.py, który ręcznie poprawia entity_type
dla znanych węzłów w pliku JSON.
""" 