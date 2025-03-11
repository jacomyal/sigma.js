const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ścieżka do pliku cache
const CACHE_FILE_PATH = path.join(__dirname, '..', 'graph_data_cache.json');

// Cache dla danych grafu
let graphDataCache = null;
let lastCacheTime = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 godziny w milisekundach

// Funkcja sprawdzająca, czy cache jest aktualny
function isCacheValid() {
  return graphDataCache !== null && lastCacheTime !== null && (Date.now() - lastCacheTime) < CACHE_DURATION;
}

// Funkcja zapisująca cache do pliku
function saveCacheToFile() {
  if (graphDataCache && lastCacheTime) {
    const cacheData = {
      data: graphDataCache,
      timestamp: lastCacheTime
    };
    
    try {
      fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(cacheData), 'utf8');
      console.log('Cache zapisany do pliku: ' + CACHE_FILE_PATH);
    } catch (err) {
      console.error('Błąd podczas zapisywania cache do pliku:', err);
    }
  }
}

// Funkcja ładująca cache z pliku
function loadCacheFromFile() {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE_PATH, 'utf8'));
      
      if (cacheData && cacheData.data && cacheData.timestamp) {
        graphDataCache = cacheData.data;
        lastCacheTime = cacheData.timestamp;
        
        // Sprawdzamy, czy cache jest wciąż aktualny
        if (isCacheValid()) {
          console.log('Załadowano aktualny cache z pliku (ostatnie odświeżenie: ' + new Date(lastCacheTime).toLocaleString() + ')');
          return true;
        } else {
          console.log('Znaleziono cache w pliku, ale jest nieaktualny');
          // Resetujemy cache, ponieważ jest nieaktualny
          graphDataCache = null;
          lastCacheTime = null;
        }
      }
    }
  } catch (err) {
    console.error('Błąd podczas ładowania cache z pliku:', err);
  }
  
  return false;
}

// Próba załadowania cache przy starcie serwera
loadCacheFromFile();

// Funkcja do odświeżania danych z bazy
function refreshDataFromDB(res) {
  console.log('Cache nieaktualny, pobieranie danych grafu z bazy danych...');
  
  // Tymczasowy plik wynikowy
  const tempOutputFile = path.join(__dirname, '..', 'temp_dataset.json');
  
  // Wywołanie skryptu Python
  exec(`python3 ${path.join(__dirname, '..', 'python', 'fetch_graph_data.py')} --output=${tempOutputFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Błąd wykonania skryptu: ${error.message}`);
      return res.status(500).json({ error: 'Nie udało się pobrać danych z bazy' });
    }
    
    if (stderr) {
      console.error(`Błędy standardowe: ${stderr}`);
    }
    
    console.log(`Wyjście skryptu: ${stdout}`);
    
    try {
      // Odczytujemy dane z pliku tymczasowego
      const graphData = JSON.parse(fs.readFileSync(tempOutputFile, 'utf8'));
      
      // Aktualizujemy cache
      graphDataCache = graphData;
      lastCacheTime = Date.now();
      
      // Zapisujemy cache do pliku
      saveCacheToFile();
      
      // Usuwamy plik tymczasowy
      fs.unlinkSync(tempOutputFile);
      
      return res.json({
        success: true,
        message: 'Dane zostały odświeżone',
        data: graphData,
        nodesCount: graphData.nodes.length,
        edgesCount: graphData.edges.length
      });
    } catch (err) {
      console.error('Błąd podczas przetwarzania danych:', err);
      return res.status(500).json({ error: 'Nie udało się przetworzyć danych' });
    }
  });
}

// Endpoint do pobierania danych z bazy i zwracania w formacie JSON
app.get('/api/graph-data', (req, res) => {
  // Sprawdzamy, czy mamy aktualne dane w cache
  if (isCacheValid()) {
    console.log('Zwracam dane z cache (ostatnie odświeżenie: ' + new Date(lastCacheTime).toLocaleString() + ')');
    return res.json(graphDataCache);
  }

  // Jeśli cache jest nieaktualny, pobieramy świeże dane
  refreshDataFromDB(res);
});

// Endpoint do ręcznego odświeżania cache
app.post('/api/refresh-cache', (req, res) => {
  // Resetujemy cache
  graphDataCache = null;
  lastCacheTime = null;
  
  // Usuwamy plik cache, jeśli istnieje
  if (fs.existsSync(CACHE_FILE_PATH)) {
    try {
      fs.unlinkSync(CACHE_FILE_PATH);
      console.log('Plik cache został usunięty');
    } catch (err) {
      console.error('Błąd podczas usuwania pliku cache:', err);
    }
  }
  
  // Pobieramy świeże dane
  refreshDataFromDB(res);
});

// Endpoint GET do ręcznego odświeżania cache (preferowana metoda)
app.get('/api/refresh-cache', (req, res) => {
  // Resetujemy cache
  graphDataCache = null;
  lastCacheTime = null;
  
  // Usuwamy plik cache, jeśli istnieje
  if (fs.existsSync(CACHE_FILE_PATH)) {
    try {
      fs.unlinkSync(CACHE_FILE_PATH);
      console.log('Plik cache został usunięty');
    } catch (err) {
      console.error('Błąd podczas usuwania pliku cache:', err);
    }
  }
  
  // Pobieramy świeże dane
  refreshDataFromDB(res);
});

// Endpoint do sprawdzania statusu cache
app.get('/api/cache-status', (req, res) => {
  if (isCacheValid()) {
    const timeLeft = CACHE_DURATION - (Date.now() - lastCacheTime);
    const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    return res.json({
      status: 'valid',
      lastUpdate: new Date(lastCacheTime).toLocaleString(),
      expiresIn: `${hoursLeft}h ${minutesLeft}m`,
      nodesCount: graphDataCache.nodes ? graphDataCache.nodes.length : 0,
      edgesCount: graphDataCache.edges ? graphDataCache.edges.length : 0,
      cacheFile: CACHE_FILE_PATH
    });
  } else {
    return res.json({
      status: 'invalid',
      message: 'Cache jest nieaktualny lub pusty',
      cacheFile: fs.existsSync(CACHE_FILE_PATH) ? CACHE_FILE_PATH : 'brak'
    });
  }
});

// Serwowanie statycznych plików z katalogu frontend/build
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Obsługa wszystkich pozostałych ścieżek, aby React Router działał poprawnie
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer API uruchomiony na porcie ${port}`);
}); 