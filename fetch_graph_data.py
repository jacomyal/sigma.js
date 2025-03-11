import pandas as pd
import random
import re
import os
import sys
import json
import pymysql
import math
from io import StringIO
import csv

def clean_csv_data(text):
    """
    Czyści dane CSV z niepotrzebnych elementów.
    """
    # Usuwanie znaczników csv, {completed}, itp.
    text = re.sub(r'```csv', '', text)
    text = re.sub(r'```', '', text)
    text = re.sub(r'{{completed}}', '', text)
    return text.strip()

def convert_to_sigma_format_fixed(graph_data, entity_counts, min_occurrence=5):
    # Lista encji do wykluczenia z grafu
    excluded_entities = [
        "Artificial Intelligence",
        "AI",
        "Artificial Intelligence (AI)"
    ]
    
    # Filtrujemy encje, które występują co najmniej min_occurrence razy i nie są na liście wykluczonych
    frequent_entities = {entity: count for entity, count in entity_counts.items() 
                        if count >= min_occurrence and entity not in excluded_entities}
    
    # Znajdujemy maksymalną wartość wystąpień dla skalowania
    max_occurrence = max(frequent_entities.values()) if frequent_entities else min_occurrence
    
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
                if isinstance(entity['entity_category'], str):
                    # Dzielimy kategorie po przecinku i usuwamy białe znaki
                    categories = [cat.strip() for cat in entity['entity_category'].split(',') if cat.strip()]
                elif isinstance(entity['entity_category'], list):
                    categories = [cat.strip() if isinstance(cat, str) else "" for cat in entity['entity_category'] if cat]
            
            # Jeśli nie mamy kategorii, używamy typu encji jako kategorii
            if not categories and entity_type:
                categories = [entity_type]
            
            # Jeśli nadal nie mamy kategorii, używamy "Unknown"
            if not categories:
                categories = ["Unknown"]
            
            # Dodajemy kategorie do mapy klastrów
            for category in categories:
                if category not in cluster_map:
                    # Przypisujemy kolor do klastra
                    color_index = len(cluster_map) % len(colors)
                    cluster_map[category] = {
                        "key": category,
                        "color": colors[color_index],
                        "clusterLabel": category
                    }
            
            # Dodajemy typ encji do mapy tagów
            if entity_type and entity_type not in tag_map:
                # Przypisujemy kolor do tagu
                color_index = len(tag_map) % len(colors)
                tag_map[entity_type] = {
                    "key": entity_type,
                    "image": "default.svg",
                    "color": colors[color_index]
                }
            
            # Sprawdzamy, czy encja już istnieje w węzłach
            existing_node_index = next((i for i, node in enumerate(nodes) if node["key"] == entity_name), None)
            
            if existing_node_index is None:
                # Pobieramy definicję encji
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
                
                # Obliczamy score na podstawie liczby relacji i siły encji
                score = 50  # Domyślna wartość
                if relations:
                    # Średnia siła relacji
                    avg_relation_strength = sum(r["strength"] for r in relations) / len(relations)
                    # Liczba relacji
                    num_relations = len(relations)
                    # Score jako kombinacja liczby relacji i średniej siły
                    score = min(100, max(1, (num_relations * 5) + avg_relation_strength))
                
                # Przypisujemy kolor na podstawie typu encji
                color = "#ccc"  # Domyślny kolor
                if entity_type in tag_map:
                    color = tag_map[entity_type]["color"]
                
                # Dodajemy nowy węzeł
                nodes.append({
                    "key": entity_name,
                    "label": entity_name,
                    "tag": entity_type,
                    "entity_type": entity_type,
                    "color": color,
                    "definition": definitions[0]["text"] if definitions else "",
                    "x": random.uniform(-1000, 1000),  # Losowe współrzędne początkowe
                    "y": random.uniform(-1000, 1000),
                    "size": scale_node_size(frequent_entities[entity_name], max_occurrence, min_size=5, max_size=50),  # Skalowanie logarytmiczne z ograniczeniem
                    "score": score,
                    "categories": ", ".join(categories) if categories else "Unknown"  # Używamy wszystkich zebranych kategorii
                })
            else:
                # Encja już istnieje, dodajemy nową definicję jeśli istnieje
                if 'entity_definition' in entity and pd.notna(entity['entity_definition']) and entity['entity_definition']:
                    # Aktualizujemy definicję, jeśli jest lepsza (dłuższa)
                    current_definition = nodes[existing_node_index].get("definition", "")
                    new_definition = entity['entity_definition']
                    if len(new_definition) > len(current_definition):
                        nodes[existing_node_index]["definition"] = new_definition
    
    # Tworzymy zbiór kluczy węzłów dla szybkiego sprawdzania
    node_keys = {node["key"] for node in nodes}
    
    # Dodajemy krawędzie w formacie [source, target]
    edge_keys = set()  # Zbiór do śledzenia unikalnych krawędzi
    
    for entity_name, relations in entity_relations.items():
        # Pomijamy encje, które nie spełniają kryterium częstości lub są na liście wykluczonych
        if entity_name not in frequent_entities:
            continue
            
        for relation in relations:
            source = entity_name
            target = relation["target"]
            
            # Pomijamy krawędzie prowadzące do wykluczonych encji
            if target in excluded_entities:
                continue
            
            # Sprawdzamy, czy oba węzły istnieją w grafie
            if source not in node_keys or target not in node_keys:
                # Jeśli któryś z węzłów nie istnieje, pomijamy tę krawędź
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

def fetch_data_from_sql():
    """
    Pobiera dane z bazy danych SQL i przetwarza je na format odpowiedni dla grafu.
    """
    # Ustawienie zmiennych środowiskowych z danymi dostarczonymi przez użytkownika
    os.environ['DB_SCHEME'] = 'mysql'
    os.environ['DB_HOST'] = '34.68.62.226'
    os.environ['DB_PORT'] = '3306'
    os.environ['DB_USER'] = 'pawel'
    os.environ['DB_PASS'] = 'strykowski'
    os.environ['DB_NAME'] = 'opisy_firm'
    
    try:
        # Nawiązanie połączenia z bazą danych
        connection = pymysql.connect(
            host=os.environ['DB_HOST'],
            port=int(os.environ['DB_PORT']),
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASS'],
            database=os.environ['DB_NAME'],
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print("Połączono z bazą danych")
        
        with connection.cursor() as cursor:
            # Pobieramy dane z tabeli ai_news_graph
            sql = """
            SELECT id, url, graph
            FROM ai_news_graph
            """
            cursor.execute(sql)
            results = cursor.fetchall()
            
            if not results:
                print("Brak danych w tabeli ai_news_graph")
                return [], {}
            
            print(f"Pobrano {len(results)} wierszy z tabeli ai_news_graph")
            
            graph_data = []
            entity_counts = {}  # Słownik do zliczania wystąpień encji w unikalnych rekordach
            entity_record_map = {}  # Słownik mapujący encje na zbiory ID rekordów, w których występują
            
            # Słownik do normalizacji nazw encji (łączenie encji różniących się tylko wielkością liter)
            normalized_entities = {}
            
            for result in results:
                if not result or 'graph' not in result or not result['graph']:
                    continue
                
                # Czyszczenie danych CSV
                csv_data = clean_csv_data(result['graph'])
                
                # Dzielimy dane na encje i relacje
                parts = re.split(r'\n\s*\n', csv_data, 1)
                if len(parts) < 2:
                    continue
                
                entities_csv, relations_csv = parts[0], parts[1]
                
                try:
                    # Parsowanie encji z obsługą błędów
                    entities_df = pd.read_csv(
                        StringIO(entities_csv), 
                        on_bad_lines='skip',  # Ignoruj błędne wiersze
                        engine='python'       # Użyj silnika Python zamiast C
                    )
                    
                    if 'entity_name' not in entities_df.columns:
                        # Próbujemy naprawić nagłówki
                        if 'type' in entities_df.columns and len(entities_df.columns) >= 6:
                            # Mapujemy kolumny na oczekiwane nazwy
                            column_mapping = {
                                entities_df.columns[0]: 'type',
                                entities_df.columns[1]: 'entity_name',
                                entities_df.columns[2]: 'entity_types',
                                entities_df.columns[3]: 'entity_definition',
                                entities_df.columns[4]: 'entity_strength',
                                entities_df.columns[5]: 'entity_occurrence'
                            }
                            entities_df = entities_df.rename(columns=column_mapping)
                        else:
                            print(f"Brak kolumny entity_name w danych encji dla id={result['id']}")
                            continue
                    
                    # Parsowanie relacji z obsługą błędów
                    relations_df = pd.read_csv(
                        StringIO(relations_csv), 
                        on_bad_lines='skip',  # Ignoruj błędne wiersze
                        engine='python'       # Użyj silnika Python zamiast C
                    )
                    
                    if 'source_entity' not in relations_df.columns or 'target_entity' not in relations_df.columns:
                        # Próbujemy naprawić nagłówki
                        if 'type' in relations_df.columns and len(relations_df.columns) >= 5:
                            # Mapujemy kolumny na oczekiwane nazwy
                            column_mapping = {
                                relations_df.columns[0]: 'type',
                                relations_df.columns[1]: 'source_entity',
                                relations_df.columns[2]: 'target_entity',
                                relations_df.columns[3]: 'relationship_description',
                                relations_df.columns[4]: 'relationship_strength'
                            }
                            relations_df = relations_df.rename(columns=column_mapping)
                        else:
                            print(f"Brak kolumn source_entity lub target_entity w danych relacji dla id={result['id']}")
                            continue
                
                except Exception as e:
                    print(f"Błąd podczas parsowania CSV dla id={result['id']}: {e}")
                    continue
                
                # Zapisujemy ID rekordu dla każdej encji
                record_id = result['id']
                
                # Normalizujemy nazwy encji (łączymy encje różniące się tylko wielkością liter)
                for _, entity in entities_df.iterrows():
                    entity_name = entity['entity_name']
                    if pd.notna(entity_name):
                        # Normalizujemy nazwę encji (zachowujemy pierwszą napotkaną wersję)
                        entity_lower = entity_name.lower()
                        if entity_lower not in normalized_entities:
                            normalized_entities[entity_lower] = entity_name
                        
                        # Używamy znormalizowanej nazwy encji
                        normalized_name = normalized_entities[entity_lower]
                        
                        if normalized_name not in entity_record_map:
                            entity_record_map[normalized_name] = set()
                        entity_record_map[normalized_name].add(record_id)
                
                # Normalizujemy nazwy encji w relacjach
                for _, row in relations_df.iterrows():
                    source = row['source_entity']
                    target = row['target_entity']
                    
                    if pd.notna(source):
                        # Normalizujemy nazwę encji źródłowej
                        source_lower = source.lower()
                        if source_lower not in normalized_entities:
                            normalized_entities[source_lower] = source
                        
                        # Używamy znormalizowanej nazwy encji
                        normalized_source = normalized_entities[source_lower]
                        
                        if normalized_source not in entity_record_map:
                            entity_record_map[normalized_source] = set()
                        entity_record_map[normalized_source].add(record_id)
                    
                    if pd.notna(target):
                        # Normalizujemy nazwę encji docelowej
                        target_lower = target.lower()
                        if target_lower not in normalized_entities:
                            normalized_entities[target_lower] = target
                        
                        # Używamy znormalizowanej nazwy encji
                        normalized_target = normalized_entities[target_lower]
                        
                        if normalized_target not in entity_record_map:
                            entity_record_map[normalized_target] = set()
                        entity_record_map[normalized_target].add(record_id)
                
                # Normalizujemy nazwy encji w DataFrame'ach
                entities_df['entity_name'] = entities_df['entity_name'].apply(
                    lambda x: normalized_entities.get(x.lower(), x) if pd.notna(x) else x
                )
                
                relations_df['source_entity'] = relations_df['source_entity'].apply(
                    lambda x: normalized_entities.get(x.lower(), x) if pd.notna(x) else x
                )
                
                relations_df['target_entity'] = relations_df['target_entity'].apply(
                    lambda x: normalized_entities.get(x.lower(), x) if pd.notna(x) else x
                )
                
                graph_data.append({
                    'id': result['id'],
                    'url': result['url'],
                    'entities': entities_df,
                    'relations': relations_df
                })
            
            # Obliczamy liczbę unikalnych rekordów dla każdej encji
            for entity_name, record_ids in entity_record_map.items():
                entity_counts[entity_name] = len(record_ids)
            
            print(f"Pomyślnie przetworzono {len(graph_data)} grafów z {len(results)} wierszy")
            return graph_data, entity_counts
    
    except Exception as e:
        print(f"Błąd podczas pobierania danych z bazy: {e}")
        return [], {}
    finally:
        if 'connection' in locals() and connection:
            connection.close()
            print("Połączenie z bazą danych zamknięte")

def process_sql_data_to_json(output_file="frontend/public/sql_graph.json", min_occurrence=5):
    """
    Pobiera dane z bazy SQL, przetwarza je i zapisuje jako plik JSON.
    """
    # Pobieranie danych z bazy
    graph_data, entity_counts = fetch_data_from_sql()
    
    if not graph_data:
        print("Nie udało się pobrać danych z bazy SQL.")
        return False
    
    # Konwertuj dane do formatu sigma.js
    result = convert_to_sigma_format_fixed(graph_data, entity_counts, min_occurrence=min_occurrence)
    
    # Zapisz wynik do pliku JSON
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False)
        print(f"Zapisano dane grafu do pliku {output_file}")
        print(f"Liczba węzłów: {len(result['nodes'])}")
        print(f"Liczba krawędzi: {len(result['edges'])}")
        print(f"Liczba klastrów: {len(result['clusters'])}")
        print(f"Liczba tagów: {len(result['tags'])}")
        return True
    except Exception as e:
        print(f"Błąd podczas zapisywania pliku JSON: {e}")
        return False

def scale_node_size(value, max_value, min_size=5, max_size=50):
    """
    Skaluje rozmiar węzła proporcjonalnie do liczby wystąpień, z ograniczeniem do minimalnego rozmiaru.
    
    Args:
        value: Liczba wystąpień encji
        max_value: Maksymalna liczba wystąpień encji w zbiorze danych
        min_size: Minimalny rozmiar węzła
        max_size: Maksymalny rozmiar węzła
        
    Returns:
        Przeskalowany rozmiar węzła
    """
    # Dla wartości mniejszych niż min_occurrence, zwracamy min_size
    if value < 5:
        return min_size
    
    # Proporcjonalne skalowanie
    # Jeśli max_value = 200 i value = 50, to scaled_size = 50 * (50/200) = 12.5
    scaled_size = max_size * (value / max_value)
    
    # Upewniamy się, że rozmiar nie jest mniejszy niż min_size
    scaled_size = max(min_size, scaled_size)
    
    # Zaokrąglamy do 1 miejsca po przecinku
    return round(scaled_size, 1)

if __name__ == "__main__":
    # Sprawdzamy, czy podano argumenty wiersza poleceń
    if len(sys.argv) > 1 and sys.argv[1] == "--sql":
        # Jeśli podano argument --sql, pobieramy dane z bazy SQL
        output_file = "frontend/public/sql_graph.json"
        if len(sys.argv) > 2:
            output_file = sys.argv[2]
        
        process_sql_data_to_json(output_file)
    else:
        # W przeciwnym razie używamy standardowej funkcji main
        if len(sys.argv) < 4:
            print("Użycie: python generate_graph_json.py <plik_encji.csv> <plik_relacji.csv> <plik_wyjsciowy.json>")
            print("lub: python generate_graph_json.py --sql [plik_wyjsciowy.json]")
            sys.exit(1)
        
        entities_csv = sys.argv[1]
        relations_csv = sys.argv[2]
        output_json = sys.argv[3]
        
        if not os.path.exists(entities_csv):
            print(f"Plik {entities_csv} nie istnieje.")
            sys.exit(1)
        
        if not os.path.exists(relations_csv):
            print(f"Plik {relations_csv} nie istnieje.")
            sys.exit(1)
        
        process_csv_files(entities_csv, relations_csv, output_json) 