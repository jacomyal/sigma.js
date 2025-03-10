#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from collections import Counter, defaultdict

def analyze_entity_types(json_file):
    """
    Analizuje typy encji w pliku JSON z danymi grafu.
    """
    print(f"Analizuję plik: {json_file}")
    
    # Sprawdzenie czy plik istnieje
    if not os.path.exists(json_file):
        print(f"Błąd: Plik {json_file} nie istnieje!")
        return
    
    # Wczytanie danych z pliku JSON
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Błąd podczas wczytywania pliku JSON: {e}")
        return
    
    # Sprawdzenie struktury danych
    if 'nodes' not in data:
        print("Błąd: Brak węzłów w danych grafu!")
        return
    
    nodes = data['nodes']
    print(f"Znaleziono {len(nodes)} węzłów w grafie.")
    
    # Analiza typów encji
    entity_types = Counter()
    nodes_without_type = []
    
    # Zbieranie danych o typach encji
    for node in nodes:
        if 'entity_type' in node:
            entity_type = node['entity_type']
            if entity_type:
                entity_types[entity_type] += 1
            else:
                nodes_without_type.append(node['label'])
        else:
            nodes_without_type.append(node['label'])
    
    # Wyświetlanie statystyk
    print(f"\nLiczba węzłów bez typu encji: {len(nodes_without_type)}")
    if nodes_without_type:
        print("Węzły bez typu encji:")
        for node_label in nodes_without_type[:10]:  # Pokazujemy maksymalnie 10 przykładów
            print(f"  - {node_label}")
        if len(nodes_without_type) > 10:
            print(f"  ... i {len(nodes_without_type) - 10} więcej")
    
    print(f"\nLiczba unikalnych typów encji: {len(entity_types)}")
    
    print("\nRozkład typów encji:")
    for entity_type, count in entity_types.most_common():
        percentage = (count / len(nodes)) * 100
        print(f"  - {entity_type}: {count} węzłów ({percentage:.1f}%)")
    
    # Analiza kolorów
    print("\n=== ANALIZA KOLORÓW ===")
    colors_by_type = {}
    for node in nodes:
        if 'entity_type' in node and 'color' in node:
            entity_type = node['entity_type']
            color = node['color']
            if entity_type not in colors_by_type:
                colors_by_type[entity_type] = set()
            colors_by_type[entity_type].add(color)
    
    print("Kolory przypisane do typów encji:")
    for entity_type, colors in colors_by_type.items():
        print(f"  - {entity_type}: {', '.join(colors)}")
    
    # Sprawdzenie spójności kolorów
    inconsistent_colors = []
    for entity_type, colors in colors_by_type.items():
        if len(colors) > 1:
            inconsistent_colors.append((entity_type, colors))
    
    if inconsistent_colors:
        print("\nUWAGA: Znaleziono niespójne kolory dla niektórych typów encji:")
        for entity_type, colors in inconsistent_colors:
            print(f"  - {entity_type}: {', '.join(colors)}")
    else:
        print("\nKolory są spójne dla wszystkich typów encji.")
    
    # Analiza definicji
    print("\n=== ANALIZA DEFINICJI ===")
    nodes_with_definition = []
    nodes_without_definition = []
    
    for node in nodes:
        if 'definition' in node and node['definition']:
            nodes_with_definition.append(node)
        else:
            nodes_without_definition.append(node)
    
    print(f"Liczba węzłów z definicją: {len(nodes_with_definition)} ({len(nodes_with_definition)/len(nodes)*100:.1f}%)")
    print(f"Liczba węzłów bez definicji: {len(nodes_without_definition)} ({len(nodes_without_definition)/len(nodes)*100:.1f}%)")
    
    # Grupowanie definicji według typów encji
    definitions_by_type = defaultdict(list)
    for node in nodes_with_definition:
        entity_type = node.get('entity_type', 'Unknown')
        definitions_by_type[entity_type].append(node)
    
    print("\nRozkład definicji według typów encji:")
    for entity_type, nodes_list in definitions_by_type.items():
        percentage = (len(nodes_list) / len(nodes_with_definition)) * 100
        print(f"  - {entity_type}: {len(nodes_list)} definicji ({percentage:.1f}%)")

if __name__ == "__main__":
    # Domyślna ścieżka do pliku JSON
    json_file = "packages/demo/public/test_dataset.json"
    
    # Analiza typów encji
    analyze_entity_types(json_file) 