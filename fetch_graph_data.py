import os
import pymysql
import pandas as pd
import json
import re
import csv
from io import StringIO
import random
from collections import Counter
import math

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
        
        # Oczekiwane nagłówki
        entity_headers = ['type', 'entity_name', 'entity_types', 'entity_definition', 'entity_strength', 'entity_occurrence']
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

# Konwersja danych do formatu Sigma.js
def convert_to_sigma_format(graph_data, entity_counts, min_occurrence=5):
    # Filtrujemy encje, które występują co najmniej min_occurrence razy
    frequent_entities = {entity: count for entity, count in entity_counts.items() if count >= min_occurrence}
    
    if not frequent_entities:
        print("Ostrzeżenie: Brak encji spełniających kryterium minimalnej liczby wystąpień")
        return None
    
    # Przygotowanie struktur danych
    nodes = []
    edges = []
    cluster_map = {}
    tag_map = {}
    
    # Przestrzeń kolorów dla klastrów
    colors = [
        "#e6194B", "#3cb44b", "#ffe119", "#4363d8", "#f58231", 
        "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabed4", 
        "#469990", "#dcbeff", "#9A6324", "#fffac8", "#800000", 
        "#aaffc3", "#808000", "#ffd8b1", "#000075", "#a9a9a9"
    ]
    
    # Słownik do zbierania relacji
    entity_relations = {}
    
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
                
            # Zapisujemy relację również dla docelowej encji
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
            
            # Pobieramy typ encji jako tag
            entity_types = []
            if 'entity_types' in entity and pd.notna(entity['entity_types']):
                entity_types = entity['entity_types'].split(',') if isinstance(entity['entity_types'], str) else []
            
            tag = entity_types[0].strip() if entity_types else "Unknown"
            
            # Upraszczamy tag do jednej kategorii (bez spacji i podkategorii)
            simple_tag = tag.split()[0] if ' ' in tag else tag
            
            # Tworzymy klaster na podstawie tagu
            cluster = simple_tag
            
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
                
                # Dodajemy encję jako węzeł
                nodes.append({
                    "key": entity_name,
                    "label": entity_name,
                    "tag": simple_tag,
                    "URL": "",
                    "cluster": cluster,
                    "x": random.uniform(-1000, 1000),  # Losowe współrzędne początkowe
                    "y": random.uniform(-1000, 1000),
                    "score": score,
                    "entity_types": entity['entity_types'] if 'entity_types' in entity and pd.notna(entity['entity_types']) else "",
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
    
    print(f"Utworzono graf z {len(nodes)} węzłami i {len(edges)} krawędziami")
    print(f"Liczba klastrów: {len(cluster_map)}, Liczba tagów: {len(tag_map)}")
    
    return result

# Zapisz dane grafu do pliku JSON
def save_graph_data(graph_data, filename="public/dataset.json"):
    # Upewnij się, że ścieżka do pliku istnieje
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(graph_data, f, indent=2, ensure_ascii=False)
    
    print(f"Zapisano dane grafu do pliku {filename}")

# Główna funkcja
if __name__ == "__main__":
    print("Pobieranie danych z bazy...")
    graph_data = fetch_graph_data()
    
    if graph_data:
        entity_counts = analyze_data(graph_data)
        
        if entity_counts:
            # Konwersja do formatu Sigma.js
            sigma_data = convert_to_sigma_format(graph_data, entity_counts, min_occurrence=5)
            
            if sigma_data:
                # Zapisanie wynikowego grafu
                save_graph_data(sigma_data, "packages/demo/public/ai_news_dataset.json")
                print("Gotowe! Teraz możesz zmodyfikować aplikację Sigma.js, aby wyświetlała nowe dane.")
            else:
                print("Nie udało się utworzyć danych w formacie Sigma.js")
        else:
            print("Brak encji do analizy")
    else:
        print("Nie udało się pobrać danych z bazy.") 