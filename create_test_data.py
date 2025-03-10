#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import random
import math
from collections import defaultdict

def create_test_data():
    """
    Tworzy testowe dane grafu z kolorowaniem i grupowaniem według typów encji.
    """
    # Definiujemy typy encji i ich kolory
    entity_types = {
        "Concept": "#4e79a7",
        "Field": "#f28e2c",
        "Technology": "#e15759",
        "Organization": "#76b7b2",
        "Person": "#59a14f",
        "Model": "#edc949",
        "Platform": "#af7aa1",
        "Technique": "#ff9da7",
        "Tool": "#9c755f",
        "Unknown": "#bab0ab"
    }
    
    # Tworzymy strukturę grafu
    graph = {
        "nodes": [],
        "edges": [],
        "clusters": [],
        "tags": []
    }
    
    # Dodajemy klastry (kategorie)
    for category in ["Artificial Intelligence", "Machine Learning", "Natural Language Processing", 
                     "Computer Vision", "Robotics", "Ethics", "Business", "Research", "Hardware", "Software"]:
        graph["clusters"].append({
            "key": category,
            "color": "#cccccc",  # Neutralny kolor, bo kolorujemy po typach
            "clusterLabel": category
        })
    
    # Dodajemy tagi (typy encji)
    for entity_type, color in entity_types.items():
        graph["tags"].append({
            "key": entity_type,
            "image": "default.svg",
            "color": color  # Dodajemy kolor do tagu
        })
    
    # Generujemy węzły
    entities = [
        {"name": "AI", "categories": ["Artificial Intelligence", "Technology"], "type": "Concept"},
        {"name": "Machine Learning", "categories": ["Machine Learning", "Artificial Intelligence"], "type": "Field"},
        {"name": "Deep Learning", "categories": ["Machine Learning", "Neural Networks"], "type": "Technique"},
        {"name": "ChatGPT", "categories": ["Natural Language Processing", "Artificial Intelligence"], "type": "Model"},
        {"name": "GPT-4", "categories": ["Natural Language Processing", "Artificial Intelligence"], "type": "Model"},
        {"name": "OpenAI", "categories": ["Research", "Artificial Intelligence"], "type": "Organization"},
        {"name": "Google", "categories": ["Technology", "Artificial Intelligence"], "type": "Organization"},
        {"name": "Microsoft", "categories": ["Technology", "Software"], "type": "Organization"},
        {"name": "Nvidia", "categories": ["Hardware", "Technology"], "type": "Organization"},
        {"name": "Computer Vision", "categories": ["Computer Vision", "Artificial Intelligence"], "type": "Field"},
        {"name": "Robotics", "categories": ["Robotics", "Hardware"], "type": "Field"},
        {"name": "Ethics in AI", "categories": ["Ethics", "Artificial Intelligence"], "type": "Concept"},
        {"name": "Sam Altman", "categories": ["Business", "Artificial Intelligence"], "type": "Person"},
        {"name": "Elon Musk", "categories": ["Business", "Technology"], "type": "Person"},
        {"name": "TensorFlow", "categories": ["Software", "Machine Learning"], "type": "Tool"},
        {"name": "PyTorch", "categories": ["Software", "Machine Learning"], "type": "Tool"},
        {"name": "DALL-E", "categories": ["Computer Vision", "Natural Language Processing"], "type": "Model"},
        {"name": "Stable Diffusion", "categories": ["Computer Vision", "Artificial Intelligence"], "type": "Model"},
        {"name": "Anthropic", "categories": ["Research", "Ethics"], "type": "Organization"},
        {"name": "Claude", "categories": ["Natural Language Processing", "Ethics"], "type": "Model"}
    ]
    
    # Dodajemy węzły do grafu
    for entity in entities:
        name = entity["name"]
        entity_type = entity["type"]
        categories_str = ", ".join(entity["categories"])
        
        # Tworzymy węzeł
        node = {
            "key": name,
            "label": name,
            "tag": entity_type,
            "entity_type": entity_type,
            "categories": categories_str,
            "color": entity_types.get(entity_type, entity_types["Unknown"]),  # Kolor na podstawie typu encji
            "x": random.random() * 10,
            "y": random.random() * 10,
            "size": 10,
            "score": 1
        }
        
        graph["nodes"].append(node)
    
    # Układamy węzły według typów encji
    arrange_nodes_by_type(graph)
    
    # Zapisujemy dane do pliku
    output_file = "packages/demo/public/test_dataset.json"
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(graph, f, indent=2, ensure_ascii=False)
    
    print(f"Zapisano testowe dane grafu do pliku {output_file}")
    return output_file

def arrange_nodes_by_type(graph_data):
    """
    Układa węzły w przestrzeni według ich typów encji.
    """
    # Grupujemy węzły według typów encji
    type_nodes = {}
    for node in graph_data["nodes"]:
        entity_type = node.get("entity_type", "Unknown")
        # Upewnij się, że entity_type nie jest None ani pustym stringiem
        if not entity_type:
            entity_type = "Unknown"
        
        # Normalizujemy typ encji (usuwamy spacje, konwertujemy na małe litery)
        # aby "Company" i "company" były traktowane jako ten sam typ
        normalized_type = entity_type.strip().lower()
        
        if normalized_type not in type_nodes:
            type_nodes[normalized_type] = []
        type_nodes[normalized_type].append((node, entity_type))  # Zapisujemy oryginalny typ
    
    # Obliczamy liczbę typów i tworzymy układ kołowy
    num_types = len(type_nodes)
    radius = 10
    
    # Dla każdego typu, umieszczamy jego węzły w określonym obszarze
    angle_step = 2 * math.pi / num_types
    for i, (normalized_type, nodes_with_types) in enumerate(type_nodes.items()):
        # Obliczamy środek obszaru dla tego typu
        angle = i * angle_step
        center_x = radius * math.cos(angle)
        center_y = radius * math.sin(angle)
        
        # Rozmieszczamy węzły wokół środka obszaru
        node_radius = 2
        node_angle_step = 2 * math.pi / max(len(nodes_with_types), 1)
        for j, (node, original_type) in enumerate(nodes_with_types):
            node_angle = j * node_angle_step
            node["x"] = center_x + node_radius * math.cos(node_angle)
            node["y"] = center_y + node_radius * math.sin(node_angle)
            
            # Upewniamy się, że węzeł ma poprawny entity_type
            node["entity_type"] = original_type
    
    return graph_data

if __name__ == "__main__":
    # Tworzymy testowe dane
    output_file = create_test_data()
    
    # Analizujemy utworzone dane
    print("\nAnaliza utworzonych danych:")
    with open(output_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    nodes = data["nodes"]
    print(f"Utworzono {len(nodes)} węzłów")
    
    # Zliczamy typy encji
    entity_types_count = defaultdict(int)
    for node in nodes:
        if "entity_type" in node:
            entity_types_count[node["entity_type"]] += 1
    
    print("\nRozkład typów encji:")
    for entity_type, count in sorted(entity_types_count.items(), key=lambda x: x[1], reverse=True):
        percentage = (count / len(nodes)) * 100
        print(f"  - {entity_type}: {count} węzłów ({percentage:.1f}%)") 