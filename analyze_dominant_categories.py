#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
from collections import Counter, defaultdict

def analyze_dominant_categories(json_file):
    """
    Analizuje kategorie w pliku JSON z danymi grafu.
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
    
    # Analiza kategorii
    all_categories = Counter()
    categories_per_entity = defaultdict(list)
    entities_per_category = defaultdict(list)
    
    # Zbieranie danych o kategoriach
    for node in nodes:
        if 'categories' in node:
            categories_str = node.get('categories', '')
            entity_name = node['label']
            
            # Rozbijamy kategorie po przecinku
            if categories_str:
                categories = [cat.strip() for cat in categories_str.split(',')]
                
                # Pierwsza kategoria jest traktowana jako dominująca
                if categories:
                    dominant_category = categories[0]
                    all_categories[dominant_category] += 1
                    categories_per_entity[entity_name].append(dominant_category)
                    entities_per_category[dominant_category].append(entity_name)
    
    # Wyświetlanie statystyk
    print("\n=== STATYSTYKI KATEGORII ===")
    print(f"Liczba unikalnych kategorii: {len(all_categories)}")
    
    print("\nRozkład kategorii (pierwsza kategoria z listy):")
    for category, count in all_categories.most_common():
        percentage = (count / len(nodes)) * 100
        print(f"  - {category}: {count} węzłów ({percentage:.1f}%)")
    
    # Przykładowe encje dla każdej kategorii
    print("\nPrzykładowe encje dla każdej kategorii:")
    for category, entities in entities_per_category.items():
        examples = entities[:3]  # Pokazujemy maksymalnie 3 przykłady
        print(f"  - {category}: {', '.join(examples)}")
    
    # Analiza kolorów
    print("\n=== ANALIZA KOLORÓW ===")
    colors_per_node = {}
    for node in nodes:
        if 'color' in node:
            entity_name = node['label']
            colors_per_node[entity_name] = node['color']
    
    print(f"Liczba węzłów z przypisanym kolorem: {len(colors_per_node)}")
    
    # Analiza typów encji
    print("\n=== ANALIZA TYPÓW ENCJI ===")
    entity_types = Counter()
    for node in nodes:
        if 'entity_type' in node:
            entity_type = node['entity_type']
            entity_types[entity_type] += 1
    
    print(f"Liczba unikalnych typów encji: {len(entity_types)}")
    print("\nRozkład typów encji:")
    for entity_type, count in entity_types.most_common():
        percentage = (count / len(nodes)) * 100
        print(f"  - {entity_type}: {count} węzłów ({percentage:.1f}%)")

if __name__ == "__main__":
    # Domyślna ścieżka do pliku JSON
    json_file = "packages/demo/public/ai_news_dataset.json"
    
    # Analiza kategorii
    analyze_dominant_categories(json_file) 