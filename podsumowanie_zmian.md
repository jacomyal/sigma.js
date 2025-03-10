# Podsumowanie zmian w skrypcie fetch_graph_data.py

## Wprowadzone zmiany

Skrypt `fetch_graph_data.py` został zmodyfikowany, aby umożliwić obliczanie dominującej kategorii dla każdej encji na podstawie danych z bazy MySQL. Główne zmiany obejmują:

1. **Funkcja `process_data(data)`**:
   - Analizuje wszystkie kategorie przypisane do każdej encji
   - Zlicza wystąpienia każdej kategorii dla danej encji
   - Wybiera kategorię z największą liczbą wystąpień jako dominującą
   - Przypisuje kolory węzłom na podstawie dominującej kategorii

2. **Funkcja `convert_to_sigma_format(graph_data)`**:
   - Poprawnie przypisuje wartość `entity_type` z danych źródłowych
   - Dodaje pole `dominant_category` do każdego węzła
   - Zachowuje wszystkie kategorie w polu `categories`

3. **Funkcja `arrange_nodes_by_category(graph_data)`**:
   - Grupuje węzły według ich dominujących kategorii
   - Rozmieszcza węzły w przestrzeni tak, aby encje z tą samą dominującą kategorią znajdowały się blisko siebie
   - Tworzy układ kołowy, gdzie każda kategoria ma swój obszar

4. **Funkcja `fetch_data_from_db()`**:
   - Pobiera dane z bazy MySQL przy użyciu zmiennych środowiskowych
   - Wykonuje zapytanie SQL pobierające informacje o encjach
   - Konwertuje dane do formatu odpowiedniego dla dalszego przetwarzania

5. **Funkcja `main()`**:
   - Koordynuje cały proces: pobieranie danych, przetwarzanie, konwersję i zapisywanie
   - Obsługuje argumenty wiersza poleceń, w tym ścieżkę pliku wyjściowego

## Jak działa obliczanie dominującej kategorii

1. Dla każdej encji zbierane są wszystkie jej kategorie z różnych wierszy w bazie danych
2. Zliczana jest liczba wystąpień każdej kategorii dla danej encji
3. Kategoria z największą liczbą wystąpień jest wybierana jako dominująca
4. Dominująca kategoria jest używana do:
   - Kolorowania węzła (każda kategoria ma przypisany unikalny kolor)
   - Grupowania węzłów w przestrzeni grafu

## Jak uruchomić skrypt

```bash
# Ustaw zmienne środowiskowe dla połączenia z bazą danych
export DB_HOST="adres_hosta"
export DB_USER="nazwa_użytkownika"
export DB_PASS="hasło"
export DB_NAME="nazwa_bazy"

# Uruchom skrypt z domyślną ścieżką wyjściową
python fetch_graph_data.py

# Lub określ własną ścieżkę wyjściową
python fetch_graph_data.py --output ścieżka/do/pliku.json
```

## Uwagi

- Skrypt wymaga ustawienia zmiennych środowiskowych: `DB_HOST`, `DB_USER`, `DB_PASS` i `DB_NAME`
- Domyślna ścieżka wyjściowa to `packages/demo/public/ai_news_dataset.json`
- Skrypt używa bibliotek: `pymysql`, `pandas`, `numpy`, `math` i innych standardowych bibliotek Pythona 