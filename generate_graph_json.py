import pandas as pd
import json
import os
import sys
from fetch_graph_data import convert_to_sigma_format_fixed

def load_csv_data(csv_file):
    """
    Wczytuje dane z pliku CSV i zwraca je jako DataFrame.
    """
    try:
        df = pd.read_csv(csv_file)
        return df
    except Exception as e:
        print(f"Błąd podczas wczytywania pliku CSV {csv_file}: {e}")
        return None

def process_csv_files(entities_csv, relations_csv, output_json):
    """
    Przetwarza pliki CSV z encjami i relacjami, generuje graf w formacie JSON.
    """
    # Wczytaj dane z plików CSV
    entities_df = load_csv_data(entities_csv)
    relations_df = load_csv_data(relations_csv)
    
    if entities_df is None or relations_df is None:
        print("Nie udało się wczytać plików CSV.")
        return False
    
    # Przygotuj dane w formacie wymaganym przez convert_to_sigma_format_fixed
    graph_data = [{
        'entities': entities_df,
        'relations': relations_df
    }]
    
    # Zlicz wystąpienia encji
    entity_counts = {}
    
    # Zliczamy encje z pliku entities
    if 'entity_name' in entities_df.columns:
        for entity_name in entities_df['entity_name']:
            if pd.notna(entity_name):
                entity_counts[entity_name] = entity_counts.get(entity_name, 0) + 1
    
    # Zliczamy encje z pliku relations (source i target)
    if 'source_entity' in relations_df.columns and 'target_entity' in relations_df.columns:
        for _, row in relations_df.iterrows():
            source = row['source_entity']
            target = row['target_entity']
            
            if pd.notna(source):
                entity_counts[source] = entity_counts.get(source, 0) + 1
            
            if pd.notna(target):
                entity_counts[target] = entity_counts.get(target, 0) + 1
    
    # Konwertuj dane do formatu sigma.js
    result = convert_to_sigma_format_fixed(graph_data, entity_counts, min_occurrence=1)
    
    # Zapisz wynik do pliku JSON
    try:
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(result, f, ensure_ascii=False)
        print(f"Zapisano dane grafu do pliku {output_json}")
        print(f"Liczba węzłów: {len(result['nodes'])}")
        print(f"Liczba krawędzi: {len(result['edges'])}")
        print(f"Liczba klastrów: {len(result['clusters'])}")
        print(f"Liczba tagów: {len(result['tags'])}")
        return True
    except Exception as e:
        print(f"Błąd podczas zapisywania pliku JSON: {e}")
        return False

def main():
    """
    Główna funkcja skryptu.
    """
    if len(sys.argv) < 4:
        print("Użycie: python generate_graph_json.py <plik_encji.csv> <plik_relacji.csv> <plik_wyjsciowy.json>")
        return
    
    entities_csv = sys.argv[1]
    relations_csv = sys.argv[2]
    output_json = sys.argv[3]
    
    if not os.path.exists(entities_csv):
        print(f"Plik {entities_csv} nie istnieje.")
        return
    
    if not os.path.exists(relations_csv):
        print(f"Plik {relations_csv} nie istnieje.")
        return
    
    process_csv_files(entities_csv, relations_csv, output_json)

if __name__ == "__main__":
    main() 