# Problem z interpretacją entity_types w aplikacji

## Jak działa aplikacja

1. Aplikacja wczytuje dane z pliku CSV, który zawiera kolumny:
   - `entity_name` - nazwa encji
   - `entity_type` - typ encji (np. Concept, Field, Technology, Model, Method, Location, Person, Event, Organization)
   - `entity_category` - kategorie encji (rozdzielone przecinkami)
   - `entity_definition` - definicja encji
   - oraz inne kolumny

2. Podczas przetwarzania danych w funkcji `convert_to_sigma_format` w pliku `fetch_graph_data.py`:
   - Aplikacja poprawnie pobiera wartość `entity_type` z kolumny CSV
   - Aplikacja poprawnie pobiera kategorie z kolumny `entity_category` i dzieli je po przecinku
   - Aplikacja używa pierwszej kategorii z `entity_category` jako `tag` węzła
   - **BŁĄD**: Aplikacja przypisuje pierwszą kategorię z `entity_category` do pola `entity_type` węzła, zamiast użyć wartości z kolumny `entity_type`

3. W panelu typów (`TypesPanel.tsx`):
   - Panel używa wartości `entity_type` węzła do filtrowania
   - Ponieważ `entity_type` jest niepoprawnie ustawione, panel wyświetla kategorie zamiast typów encji

## Przykład błędnej interpretacji

Dla encji "Artificial Intelligence" z CSV:
```
ent,Artificial Intelligence,Concept,"AI, Technology, Innovation","Technology being promoted as a transformative force",100,7
```

- `entity_name` = "Artificial Intelligence"
- `entity_type` = "Concept"
- `entity_category` = "AI, Technology, Innovation"

Aplikacja powinna utworzyć węzeł z:
- `label` = "Artificial Intelligence"
- `entity_type` = "Concept"
- `tag` = "Technology" (pierwsza kategoria po usunięciu "AI")

Ale zamiast tego tworzy węzeł z:
- `label` = "Artificial Intelligence"
- `entity_type` = "Technology" (błędnie używa pierwszej kategorii)
- `tag` = "Technology"

## Rozwiązanie problemu

1. Poprawka w kodzie `fetch_graph_data.py`:
   ```javascript
   // Zmiana z:
   "entity_type": tag,  // Dodajemy typ encji jako osobne pole
   
   // Na:
   "entity_type": entity_type,  // Używamy wartości z kolumny entity_type
   ```

2. Dla istniejących danych, można użyć skryptu `fix_entity_types.py`, który ręcznie poprawia wartości `entity_type` dla znanych węzłów w pliku JSON.

## Wpływ na filtrowanie

Po poprawce, panel typów będzie wyświetlał rzeczywiste typy encji (Concept, Field, Technology, Model, Method, Location, Person, Event, Organization) zamiast pierwszych kategorii z `entity_category`, co pozwoli na bardziej intuicyjne filtrowanie węzłów w aplikacji. 