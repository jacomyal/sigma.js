import os
import sys
import json
import random
import argparse
import math
import pymysql
import pandas as pd
import numpy as np
from datetime import datetime
from collections import Counter
import re
import csv
from io import StringIO

# Parsowanie argumentów wiersza poleceń
def parse_args():
    parser = argparse.ArgumentParser(description='Pobierz dane grafu z bazy i przekształć do formatu Sigma.js')
    parser.add_argument('--output', type=str, help='Ścieżka do pliku wynikowego JSON')
    return parser.parse_args()

# Ustawienie zmiennych środowiskowych
os.environ['DB_SCHEME'] = 'mysql'
os.environ['DB_HOST'] = '34.68.62.226'
os.environ['DB_PORT'] = '3306'
os.environ['DB_USER'] = 'pawel'
os.environ['DB_PASS'] = 'strykowski'
os.environ['DB_NAME'] = 'opisy_firm'

# Funkcja do łączenia z bazą danych
def connect_to_db():
    try:
        connection = pymysql.connect(
            host=os.environ['DB_HOST'],
            port=int(os.environ['DB_PORT']),
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASS'],
            database=os.environ['DB_NAME']
        )
        print("Połączenie z bazą danych nawiązane pomyślnie!")
        return connection
    except Exception as e:
        print(f"Błąd podczas łączenia z bazą danych: {e}")
        return None

# Funkcja do czyszczenia danych CSV
def clean_csv_data(text):
    # Usuwanie znaczników csv, {completed}, itp.
    text = re.sub(r'```csv', '', text)
    text = re.sub(r'```', '', text)
    text = re.sub(r'{{completed}}', '', text)
    return text.strip()

# Funkcja do bezpiecznego parsowania CSV
def safe_parse_csv(csv_text, expected_columns, expected_headers=None):
    try:
        # Używamy naszej własnej implementacji parsowania CSV
        lines = csv_text.strip().split('\n')
        if not lines or len(lines) <= 1:
            return None
            
        headers = [h.strip() for h in lines[0].split(',')]
        
        # Sprawdźmy czy liczba kolumn zgadza się z oczekiwaną
        if len(headers) != expected_columns:
            print(f"Ostrzeżenie: Znaleziono {len(headers)} kolumn, oczekiwano {expected_columns}")
        
        # Sprawdzenie czy mamy oczekiwane nagłówki
        if expected_headers:
            # Normalizacja nagłówków (usunięcie spacji, małe litery)
            normalized_headers = [h.strip().lower() for h in headers]
            normalized_expected = [h.strip().lower() for h in expected_headers]
            
            # Sprawdzenie czy wszystkie oczekiwane nagłówki są obecne
            missing_headers = [h for h in normalized_expected if h not in normalized_headers]
            if missing_headers:
                print(f"Ostrzeżenie: Brakujące oczekiwane nagłówki: {missing_headers}")
                
                # Jeśli brakuje krytycznych nagłówków, możemy zastąpić oryginalne nagłówki
                if any(h in missing_headers for h in ['entity_name', 'source_entity', 'target_entity']):
                    print("Krytyczne nagłówki są nieobecne. Używam domyślnych nagłówków.")
                    headers = expected_headers
        
        data = []
        for i, line in enumerate(lines[1:], 1):
            try:
                values = []
                in_quotes = False
                current_value = ""
                
                # Ręczne parsowanie linii z uwzględnieniem cudzysłowów
                for char in line:
                    if char == '"':
                        in_quotes = not in_quotes
                    elif char == ',' and not in_quotes:
                        values.append(current_value.strip())
                        current_value = ""
                    else:
                        current_value += char
                
                # Dodanie ostatniej wartości
                values.append(current_value.strip())
                
                # Sprawdzenie czy liczba wartości zgadza się z liczbą nagłówków
                if len(values) > len(headers):
                    # Jeśli mamy więcej wartości niż nagłówków, łączymy nadmiarowe kolumny
                    extra_values = values[len(headers)-1:]
                    values = values[:len(headers)-1] + [','.join(extra_values)]
                elif len(values) < len(headers):
                    # Jeśli mamy mniej wartości niż nagłówków, dopełniamy pustymi wartościami
                    values += [''] * (len(headers) - len(values))
                
                # Tworzymy słownik z parami nagłówek:wartość
                row = {headers[j]: values[j] for j in range(len(headers))}
                data.append(row)
            except Exception as e:
                print(f"Błąd w linii {i+1}: {e}")
                continue
        
        # Konwersja do DataFrame
        df = pd.DataFrame(data)
        
        # Sprawdzenie czy DataFrame nie jest pusty
        if df.empty:
            return None
            
        return df
    
    except Exception as e:
        print(f"Błąd podczas bezpiecznego parsowania CSV: {e}")
        print(f"Pierwsze 100 znaków tekstu: {csv_text[:100]}")
        return None

# Główna funkcja do pobrania danych
def fetch_graph_data():
    conn = connect_to_db()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor()
        query = "SELECT id, url, graph FROM ai_news_graph"
        cursor.execute(query)
        rows = cursor.fetchall()
        
        print(f"Pobrano {len(rows)} wierszy z bazy danych")
        
        # Zmiana nagłówków dla nowego formatu danych
        entity_headers = ['type', 'entity_name', 'entity_type', 'entity_category', 'entity_definition', 'entity_strength', 'entity_occurrence']
        relation_headers = ['type', 'source_entity', 'target_entity', 'relationship_description', 'relationship_strength']
        
        graph_data = []
        for row in rows:
            id, url, graph_text = row
            
            try:
                if not graph_text or len(graph_text.strip()) < 10:
                    print(f"Pusty lub zbyt krótki tekst grafu dla id={id}")
                    continue
                    
                cleaned_graph = clean_csv_data(graph_text)
                
                # Próbujemy rozdzielić na dwie części CSV (encje i relacje)
                parts = re.split(r'\n\s*\n', cleaned_graph, 1)
                
                if len(parts) >= 2:
                    entities_csv, relations_csv = parts[0], parts[1]
                    
                    # Używamy bezpiecznego parsowania z oczekiwanymi nagłówkami
                    entities_df = safe_parse_csv(entities_csv, 6, entity_headers)
                    relations_df = safe_parse_csv(relations_csv, 5, relation_headers)
                    
                    # Upewniamy się, że mamy oba DataFrame i zawierają wymagane kolumny
                    valid_entities = entities_df is not None and 'entity_name' in entities_df.columns
                    valid_relations = relations_df is not None and 'source_entity' in relations_df.columns and 'target_entity' in relations_df.columns
                    
                    if valid_entities and valid_relations:
                        graph_data.append({
                            'id': id,
                            'url': url,
                            'entities': entities_df,
                            'relations': relations_df
                        })
                    else:
                        if not valid_entities:
                            print(f"Nieprawidłowe encje dla id={id}")
                        if not valid_relations:
                            print(f"Nieprawidłowe relacje dla id={id}")
                else:
                    print(f"Nie można rozdzielić na dwie części CSV dla id={id}")
            except Exception as e:
                print(f"Błąd przetwarzania dla id={id}: {e}")
                continue
        
        print(f"Pomyślnie przetworzono {len(graph_data)} grafów z {len(rows)} wierszy")
        return graph_data
    
    except Exception as e:
        print(f"Błąd podczas pobierania danych: {e}")
        return None
    finally:
        conn.close()

# Analiza pobranych danych
def analyze_data(graph_data):
    if not graph_data or len(graph_data) == 0:
        print("Brak danych do analizy")
        return {}
    
    # Zliczanie wszystkich unikatowych encji
    all_entities = []
    for graph in graph_data:
        if 'entities' in graph and isinstance(graph['entities'], pd.DataFrame) and 'entity_name' in graph['entities'].columns:
            entity_names = graph['entities']['entity_name'].tolist()
            all_entities.extend(entity_names)
    
    # Zliczamy wystąpienia każdej encji
    entity_counts = Counter(all_entities)
    
    # Wyświetlamy 10 najpopularniejszych encji
    print("\nNajpopularniejsze encje:")
    for entity, count in entity_counts.most_common(10):
        print(f"  - {entity}: {count} wystąpień")
    
    # Ile encji występuje więcej niż 5 razy
    frequent_entities = {entity: count for entity, count in entity_counts.items() if count > 5}
    print(f"\nLiczba encji występujących więcej niż 5 razy: {len(frequent_entities)}")
    
    return entity_counts

def process_data(data):
    """
    Przetwarza dane z bazy danych i tworzy strukturę grafu.
    Koloruje i grupuje węzły według typów encji.
    """
    # Definiujemy kolory dla typów encji
    entity_type_colors = {
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
    
    # Zbieramy wszystkie kategorie i typy encji
    all_categories = set()
    all_entity_types = set()
    
    for row in data:
        categories = row[3]  # entity_category
        entity_type = row[2]  # entity_type
        
        # Zbieramy kategorie
        if categories:
            for category in categories.split(','):
                category = category.strip()
                if category:
                    all_categories.add(category)
        
        # Zbieramy typy encji
        if entity_type:
            all_entity_types.add(entity_type)
        else:
            all_entity_types.add("Unknown")
    
    # Dodajemy klastry (kategorie)
    for category in all_categories:
        graph["clusters"].append({
            "key": category,
            "color": "#cccccc",  # Neutralny kolor, bo kolorujemy po typach
            "clusterLabel": category
        })
    
    # Dodajemy tagi (typy encji)
    for entity_type in all_entity_types:
        color = entity_type_colors.get(entity_type, entity_type_colors.get("Unknown", "#cccccc"))
        graph["tags"].append({
            "key": entity_type,
            "image": "default.svg",
            "color": color  # Kolor tagu
        })
    
    # Słownik do śledzenia już dodanych encji
    added_entities = {}
    
    # Dodajemy węzły
    for row in data:
        entity_type_value = row[0]  # type
        entity_name = row[1]  # entity_name
        entity_type = row[2]  # entity_type
        categories = row[3]   # entity_category
        definition = row[4]   # entity_definition
        
        # Pomijamy wiersze bez nazwy encji
        if not entity_name:
            continue
        
        # Jeśli encja nie została jeszcze dodana, dodajemy ją
        if entity_name not in added_entities:
            # Używamy typu encji do kolorowania
            if not entity_type:
                entity_type = "Unknown"
            
            # Wybieramy kolor na podstawie typu encji
            color = entity_type_colors.get(entity_type, entity_type_colors.get("Unknown", "#cccccc"))
            
            # Tworzymy węzeł
            node = {
                "key": entity_name,
                "label": entity_name,
                "tag": entity_type_value,
                "entity_type": entity_type,
                "categories": categories,
                "color": color,  # Kolor na podstawie typu encji
                "definition": definition,
                "x": random.random(),
                "y": random.random(),
                "size": 10,
                "score": 1
            }
            
            graph["nodes"].append(node)
            added_entities[entity_name] = len(graph["nodes"]) - 1
    
    # Dodajemy unikalne tagi (typy encji)
    unique_tags = set()
    for node in graph["nodes"]:
        unique_tags.add(node["tag"])
    
    for tag in unique_tags:
        if not any(t["key"] == tag for t in graph["tags"]):
            graph["tags"].append({
                "key": tag,
                "image": "default.svg"
            })
    
    return graph

def convert_to_sigma_format(graph_data):
    """
    Konwertuje dane grafu do formatu używanego przez Sigma.js.
    """
    sigma_data = {
        "nodes": [],
        "edges": [],
        "clusters": graph_data["clusters"],
        "tags": graph_data["tags"]
    }
    
    # Dodajemy węzły
    for node in graph_data["nodes"]:
        sigma_node = {
            "key": node["key"],
            "label": node["label"],
            "tag": node["tag"],
            "entity_type": node["entity_type"],  # Używamy poprawnego entity_type
            "categories": node["categories"],
            "color": node["color"],
            "definition": node["definition"],
            "x": node["x"],
            "y": node["y"],
            "size": node["size"],
            "score": node["score"]
        }
        sigma_data["nodes"].append(sigma_node)
    
    # Dodajemy krawędzie
    for edge in graph_data["edges"]:
        sigma_edge = {
            "source": edge["source"],
            "target": edge["target"],
            "size": edge["size"]
        }
        sigma_data["edges"].append(sigma_edge)
    
    return sigma_data

def arrange_nodes_by_category(graph_data):
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

# Zapisz dane grafu do pliku JSON
def save_graph_data(graph_data, filename="packages/demo/public/ai_news_dataset.json"):
    # Upewnij się, że ścieżka do pliku istnieje
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(graph_data, f, indent=2, ensure_ascii=False)
    
    print(f"Zapisano dane grafu do pliku {filename}")

def fetch_data_from_db():
    """
    Pobiera dane z bazy danych MySQL.
    """
    try:
        # Nawiązanie połączenia z bazą danych
        connection = pymysql.connect(
            host=os.environ['DB_HOST'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASS'],
            database=os.environ['DB_NAME'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print("Połączono z bazą danych")
        
        with connection.cursor() as cursor:
            # Pobieramy dane encji
            sql = """
            SELECT 
                type, 
                entity_name, 
                entity_type, 
                entity_category, 
                entity_definition, 
                entity_strength, 
                entity_occurrence
            FROM entities
            """
            cursor.execute(sql)
            entities = cursor.fetchall()
            
            print(f"Pobrano {len(entities)} wierszy z tabeli entities")
            
            # Konwertujemy dane do listy krotek
            data = []
            for entity in entities:
                data.append((
                    entity['type'],
                    entity['entity_name'],
                    entity['entity_type'],
                    entity['entity_category'],
                    entity['entity_definition'],
                    entity['entity_strength'] if 'entity_strength' in entity else None,
                    entity['entity_occurrence'] if 'entity_occurrence' in entity else None
                ))
            
            return data
    except Exception as e:
        print(f"Błąd podczas pobierania danych z bazy: {e}")
        return []
    finally:
        if 'connection' in locals() and connection:
            connection.close()
            print("Połączenie z bazą danych zamknięte")

def main():
    """
    Główna funkcja programu.
    """
    # Parsowanie argumentów wiersza poleceń
    parser = argparse.ArgumentParser(description='Pobierz dane grafu z bazy danych i zapisz je w formacie JSON.')
    parser.add_argument('--output', dest='output_file', default='packages/demo/public/ai_news_dataset.json',
                      help='Ścieżka do pliku wyjściowego JSON (domyślnie: packages/demo/public/ai_news_dataset.json)')
    args = parser.parse_args()
    
    output_file = args.output_file
    
    # Pobieranie danych z bazy
    data = fetch_data_from_db()
    
    if data:
        # Przetwarzanie danych
        graph_data = process_data(data)
        
        # Konwersja do formatu Sigma.js
        sigma_data = convert_to_sigma_format(graph_data)
        
        # Układanie węzłów według kategorii
        arranged_data = arrange_nodes_by_category(sigma_data)
        
        # Zapisanie wynikowego grafu
        save_graph_data(arranged_data, output_file)
        print("Gotowe! Teraz możesz zmodyfikować aplikację Sigma.js, aby wyświetlała nowe dane.")
    else:
        print("Nie udało się pobrać danych z bazy.")

# Główna funkcja
if __name__ == "__main__":
    main() 