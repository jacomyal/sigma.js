import { FullScreenControl, SigmaContainer, ZoomControl, useSigma } from "@react-sigma/core";
import { DirectedGraph } from "graphology";
import { circular } from "graphology-layout";
import { constant, keyBy, mapValues, omit } from "lodash";
import { FC, useEffect, useMemo, useState, useCallback, useRef, MouseEvent } from "react";
import { BiBookContent, BiRadioCircleMarked } from "react-icons/bi";
import { BsArrowsFullscreen, BsFullscreenExit, BsMoon, BsSun, BsZoomIn, BsZoomOut } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { MdOutlineRefresh, MdOutlineCircle } from "react-icons/md";
import { Settings } from "sigma/settings";
import { Attributes } from "graphology-types";
import { useRegisterEvents } from "@react-sigma/core";

import { drawHover, drawLabel } from "../canvas-utils";
import { Dataset, FiltersState, Cluster } from "../types";
import ClustersPanel from "./ClustersPanel";
import DescriptionPanel from "./DescriptionPanel";
import GraphDataController from "./GraphDataController";
import GraphEventsController from "./GraphEventsController";
import GraphSettingsController from "./GraphSettingsController";
import GraphTitle from "./GraphTitle";
import RelationsPanel from "./RelationsPanel";
import SearchField from "./SearchField";
import TypesPanel from "./TypesPanel";

// Funkcja do układania węzłów według typów encji
const arrangeNodesByEntityType = (graph) => {
  // Grupowanie węzłów według typów encji
  const entityTypeGroups = {};
  
  // Zbieramy węzły według typów encji
  graph.forEachNode((node) => {
    // Pobieramy typ encji węzła
    const entityType = graph.getNodeAttribute(node, "entity_type") || "Unknown";
    
    // Normalizujemy typ encji (usuwamy spacje, konwertujemy na małe litery)
    const normalizedType = entityType.trim().toLowerCase();
    
    if (!entityTypeGroups[normalizedType]) {
      entityTypeGroups[normalizedType] = [];
    }
    entityTypeGroups[normalizedType].push(node);
  });
  
  // Obliczamy liczbę typów encji i ustawiamy je w okręgu
  const entityTypes = Object.keys(entityTypeGroups);
  const numEntityTypes = entityTypes.length;
  const radius = 500; // Promień okręgu, na którym będą umieszczone typy encji
  
  // Dla każdego typu encji
  entityTypes.forEach((entityType, typeIndex) => {
    const nodes = entityTypeGroups[entityType];
    const numNodes = nodes.length;
    
    // Obliczamy pozycję typu encji na okręgu
    const typeAngle = (2 * Math.PI * typeIndex) / numEntityTypes;
    const typeX = radius * Math.cos(typeAngle);
    const typeY = radius * Math.sin(typeAngle);
    
    // Układamy węzły w typie encji w mniejszym okręgu wokół pozycji typu
    const typeRadius = Math.min(100, 30 + numNodes * 5); // Promień typu zależny od liczby węzłów
    
    nodes.forEach((node, nodeIndex) => {
      const nodeAngle = (2 * Math.PI * nodeIndex) / numNodes;
      const nodeX = typeX + typeRadius * Math.cos(nodeAngle);
      const nodeY = typeY + typeRadius * Math.sin(nodeAngle);
      
      // Ustawiamy pozycję węzła
      graph.setNodeAttribute(node, "x", nodeX);
      graph.setNodeAttribute(node, "y", nodeY);
    });
  });
};

// Alternatywna funkcja układania węzłów - tylko według typów encji, bez ForceAtlas2
const arrangeNodesByEntityTypeOnly = (graph) => {
  // Najpierw układamy węzły w okręgu
  circular.assign(graph);
  
  // Grupowanie węzłów według typów encji
  const entityTypeGroups = {};
  
  // Zbieramy węzły według typów encji
  graph.forEachNode((node) => {
    // Pobieramy typ encji węzła
    const entityType = graph.getNodeAttribute(node, "entity_type") || "Unknown";
    
    // Normalizujemy typ encji (usuwamy spacje, konwertujemy na małe litery)
    const normalizedType = entityType.trim().toLowerCase();
    
    if (!entityTypeGroups[normalizedType]) {
      entityTypeGroups[normalizedType] = [];
    }
    entityTypeGroups[normalizedType].push(node);
  });
  
  // Obliczamy liczbę typów encji i ustawiamy je w okręgu
  const entityTypes = Object.keys(entityTypeGroups);
  const numEntityTypes = entityTypes.length;
  const radius = 500; // Promień okręgu, na którym będą umieszczone typy encji
  
  // Dla każdego typu encji
  entityTypes.forEach((entityType, typeIndex) => {
    const nodes = entityTypeGroups[entityType];
    const numNodes = nodes.length;
    
    // Obliczamy pozycję typu encji na okręgu
    const typeAngle = (2 * Math.PI * typeIndex) / numEntityTypes;
    const typeX = radius * Math.cos(typeAngle);
    const typeY = radius * Math.sin(typeAngle);
    
    // Układamy węzły w typie encji w mniejszym okręgu wokół pozycji typu
    const typeRadius = Math.min(100, 30 + numNodes * 5); // Promień typu zależny od liczby węzłów
    
    nodes.forEach((node, nodeIndex) => {
      const nodeAngle = (2 * Math.PI * nodeIndex) / numNodes;
      const nodeX = typeX + typeRadius * Math.cos(nodeAngle);
      const nodeY = typeY + typeRadius * Math.sin(nodeAngle);
      
      // Ustawiamy pozycję węzła
      graph.setNodeAttribute(node, "x", nodeX);
      graph.setNodeAttribute(node, "y", nodeY);
    });
  });
};

// Nowa funkcja do układania wszystkich węzłów w jednym okręgu
const arrangeNodesInCircle = (graph: DirectedGraph) => {
  const nodes: string[] = [];
  graph.forEachNode((node) => {
    nodes.push(node);
  });
  
  const numNodes = nodes.length;
  const radius = 500; // Promień okręgu
  
  // Układamy wszystkie węzły w jednym dużym okręgu
  nodes.forEach((node, index) => {
    const angle = (2 * Math.PI * index) / numNodes;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    
    // Ustawiamy pozycję węzła
    graph.setNodeAttribute(node, "x", x);
    graph.setNodeAttribute(node, "y", y);
  });
};

const Root: FC = () => {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [dataReady, setDataReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graph, setGraph] = useState<DirectedGraph>(new DirectedGraph());
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    entityTypes: {},
  });
  const [showContents, setShowContents] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Inicjalizacja stanu darkMode z localStorage lub domyślnie true
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null ? savedMode === 'true' : true;
  });
  
  const sigmaSettings: Partial<Settings> = useMemo(
    () => ({
      defaultDrawNodeLabel: drawLabel,
      defaultDrawNodeHover: drawHover,
      defaultNodeType: "circle",
      defaultEdgeType: "arrow",
      labelDensity: 0.07,
      labelGridCellSize: 60,
      labelRenderedSizeThreshold: 15,
      labelFont: "Lato, sans-serif",
      zIndex: true,
    }),
    [],
  );

  // Effect for dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Zapisujemy preferencję w localStorage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Funkcja do budowania grafu z danych
  const buildGraph = (data: Dataset): DirectedGraph => {
    const newGraph = new DirectedGraph();
    
    // Pobieramy tagi do użycia przy tworzeniu węzłów
    const tags = keyBy(data.tags, "key");

    // Tworzymy mapę kolorów dla typów encji
    const entityTypeColors: Record<string, string> = {};
    const colorPalette = [
      "#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f",
      "#edc949", "#af7aa1", "#ff9da7", "#9c755f", "#bab0ab",
      "#6b9ac4", "#d1a14e", "#d37879", "#8cd0cb", "#7bb36d",
      "#f2dd63", "#c49cc0", "#ffbdc6", "#b8917d", "#d8d0cb"
    ];
    
    // Zbieramy wszystkie unikalne typy encji
    const entityTypesSet = new Set<string>();
    const entityTypesRecord: Record<string, boolean> = {};
    
    data.nodes.forEach((node) => {
      const entityType = node.entity_type || node.tag;
      if (entityType) {
        entityTypesSet.add(entityType);
        entityTypesRecord[entityType] = true;
      }
    });
    
    // Przypisujemy kolory do typów encji
    Array.from(entityTypesSet).forEach((entityType, index) => {
      entityTypeColors[entityType] = colorPalette[index % colorPalette.length];
      // Upewniamy się, że typ encji jest zaznaczony w filtrach
      entityTypesRecord[entityType] = true;
    });

    data.nodes.forEach((node) => {
      // Dla każdego węzła, przypisujemy mu wszystkie jego kategorie jako atrybuty
      const nodeCategories = node.categories ? node.categories.split(',').map(cat => cat.trim()) : [];
      const mainCategory = nodeCategories.length > 0 ? nodeCategories[0] : "Unknown";
      const entityType = node.entity_type || node.tag || "Unknown";
      
      newGraph.addNode(node.key, {
        ...node,
        // Używamy typu encji do kolorowania węzła
        color: entityTypeColors[entityType] || "#ccc",
        // Zachowujemy informację o klastrze dla tooltipa
        clusterLabel: mainCategory,
        // Zapisujemy wszystkie kategorie węzła do późniejszego filtrowania
        allCategories: nodeCategories,
      });
    });
    
    data.edges.forEach(([source, target]) => newGraph.addEdge(source, target, { size: 1 }));

    // Używamy oryginalnej wielkości węzła z pliku JSON zamiast obliczać ją na podstawie wartości score
    newGraph.forEachNode((node) => {
      // Zachowujemy oryginalną wielkość węzła z pliku JSON
      const originalSize = newGraph.getNodeAttribute(node, "size");
      if (originalSize) {
        // Nie zmieniamy wielkości węzła, używamy wartości z pliku JSON
        console.log(`Węzeł ${node} ma wielkość: ${originalSize}`);
      } else {
        // Jeśli wielkość nie jest określona, ustawiamy domyślną wartość
        newGraph.setNodeAttribute(node, "size", 5);
      }
    });

    // Układamy węzły według typów encji
    arrangeNodesByEntityType(newGraph);

    setFiltersState({
      clusters: mapValues(keyBy(data.clusters, "key"), constant(true)),
      entityTypes: entityTypesRecord,
    });
    
    return newGraph;
  };

  // Load data on mount:
  useEffect(() => {
    // Ustawiamy URL do pliku JSON wygenerowanego z danych SQL
    const apiUrl = './sql_graph.json';
    
    console.log(`Pobieranie danych z: ${apiUrl}`);
    
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDataset(data);
        
        // Sprawdzenie czy dataset istnieje
        if (!data) {
          console.error("Dataset jest undefined!");
          return;
        }
        
        // Sprawdzenie czy dataset.nodes istnieje
        if (!data.nodes || !Array.isArray(data.nodes)) {
          console.error("Dataset.nodes jest undefined lub nie jest tablicą!");
          return;
        }
        
        // Logowanie długości poszczególnych elementów datasetu
        console.log("Liczba nodes:", data.nodes.length);
        
        if (data.edges && Array.isArray(data.edges)) {
          console.log("Liczba edges:", data.edges.length);
        } else {
          console.error("Dataset.edges jest undefined lub nie jest tablicą!");
        }
        
        if (data.clusters && Array.isArray(data.clusters)) {
          console.log("Liczba clusters:", data.clusters.length);
        } else {
          console.error("Dataset.clusters jest undefined lub nie jest tablicą!");
        }
        
        if (data.tags && Array.isArray(data.tags)) {
          console.log("Liczba tags:", data.tags.length);
        } else {
          console.error("Dataset.tags jest undefined lub nie jest tablicą!");
        }
        
        // Logowanie przykładowego node
        if (data.nodes.length > 0) {
          console.log("Przykładowy node:", data.nodes[0]);
        }
        
        // Sprawdzenie czy edges jest tablicą
        if (!data.edges || !Array.isArray(data.edges)) {
          throw new Error("Dataset.edges nie jest tablicą!");
        }
        
        const newGraph = buildGraph(data);
        setGraph(newGraph);
        
        // Używamy prostszego układu grafu
        arrangeNodesInCircle(newGraph);
        
        setDataReady(true);
      })
      .catch((error) => {
        console.error("Błąd podczas ładowania danych:", error);
        setError("Nie udało się załadować danych. Spróbuj ponownie później.");
      });
  }, []);

  // Funkcja do ponownego układania węzłów
  const rearrangeNodes = useCallback(() => {
    if (graph && dataset) {
      arrangeNodesInCircle(graph);
    }
  }, [graph, dataset]);

  // Funkcja do przełączania trybu ciemnego
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prevMode => !prevMode);
  }, []);

  if (!dataset) return null;

  return (
    <div className={`app-root ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {!dataReady ? (
        <div className="loading-screen">
          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Odśwież stronę</button>
            </div>
          ) : (
            <>
              <div className="spinner"></div>
              <div>Ładowanie danych...</div>
            </>
          )}
        </div>
      ) : (
        <div id="app-root" className={showContents ? "show-contents" : ""}>
          <SigmaContainer graph={graph} settings={sigmaSettings} className="react-sigma">
            <GraphSettingsController hoveredNode={hoveredNode} />
            <GraphEventsController setHoveredNode={setHoveredNode} setSelectedNode={setSelectedNode} />
            <GraphDataController filters={filtersState} />
            {dataReady && <RefreshLayoutButton onRefresh={rearrangeNodes} />}

            {dataReady && (
              <>
                <button
                  className="theme-switcher"
                  onClick={toggleDarkMode}
                  title={darkMode ? "Przełącz na tryb jasny" : "Przełącz na tryb ciemny"}
                >
                  {darkMode ? <BsSun /> : <BsMoon />}
                </button>

                <GraphTitle filters={filtersState} />
                
                <div className="controls">
                  <div className="react-sigma-control ico">
                    <button
                      type="button"
                      className="show-contents"
                      onClick={() => setShowContents(true)}
                      title="Show caption and description"
                    >
                      <BiBookContent />
                    </button>
                  </div>
                  <FullScreenControl className="ico">
                    <BsArrowsFullscreen />
                    <BsFullscreenExit />
                  </FullScreenControl>

                  <ZoomControl className="ico">
                    <BsZoomIn />
                    <BsZoomOut />
                    <BiRadioCircleMarked />
                  </ZoomControl>
                </div>
                <div className="contents">
                  <div className="ico">
                    <button
                      type="button"
                      className="hide-contents"
                      onClick={() => setShowContents(false)}
                      title="Show caption and description"
                    >
                      <GrClose />
                    </button>
                  </div>
                  <div className="panels">
                    <SearchField filters={filtersState} />
                    <DescriptionPanel selectedNode={selectedNode} />
                    <RelationsPanel selectedNode={selectedNode} />
                    <ClustersPanel
                      clusters={dataset.clusters}
                      filters={filtersState}
                      setClusters={(clusters) =>
                        setFiltersState((filters) => ({
                          ...filters,
                          clusters,
                        }))
                      }
                      toggleCluster={(cluster) => {
                        setFiltersState((filters) => ({
                          ...filters,
                          clusters: filters.clusters[cluster]
                            ? omit(filters.clusters, cluster)
                            : { ...filters.clusters, [cluster]: true },
                        }));
                      }}
                    />
                    <TypesPanel
                      tags={dataset.tags}
                      filters={filtersState}
                      toggleEntityType={(entityType) => {
                        setFiltersState((filters) => ({
                          ...filters,
                          entityTypes: filters.entityTypes[entityType] ? omit(filters.entityTypes, entityType) : { ...filters.entityTypes, [entityType]: true },
                        }));
                      }}
                      setEntityTypes={(entityTypes) =>
                        setFiltersState((filters) => ({
                          ...filters,
                          entityTypes,
                        }))
                      }
                    />
                  </div>
                </div>
              </>
            )}
          </SigmaContainer>
        </div>
      )}
    </div>
  );
};

// Komponent przycisku odświeżania układu
const RefreshLayoutButton: FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();
  
  const handleRefresh = useCallback(() => {
    onRefresh();
    sigma.refresh();
  }, [onRefresh, sigma]);
  
  const handleSimpleRefresh = useCallback(() => {
    arrangeNodesByEntityTypeOnly(graph);
    sigma.refresh();
  }, [graph, sigma]);
  
  const handleCircleLayout = useCallback(() => {
    arrangeNodesInCircle(graph);
    sigma.refresh();
  }, [graph, sigma]);
  
  return (
    <div className="refresh-layout-buttons" style={{ position: 'absolute', top: '10px', right: '60px', zIndex: 1, display: 'flex', gap: '5px' }}>
      <div className="react-sigma-control ico">
        <button
          type="button"
          onClick={handleRefresh}
          title="Ułóż węzły według typów encji (z ForceAtlas2)"
        >
          <MdOutlineRefresh />
        </button>
      </div>
      <div className="react-sigma-control ico">
        <button
          type="button"
          onClick={handleSimpleRefresh}
          title="Ułóż węzły według typów encji (prosty układ)"
        >
          <MdOutlineRefresh style={{ transform: 'scaleX(-1)' }} />
        </button>
      </div>
      <div className="react-sigma-control ico">
        <button
          type="button"
          onClick={handleCircleLayout}
          title="Ułóż wszystkie węzły w okręgu"
        >
          <MdOutlineCircle />
        </button>
      </div>
    </div>
  );
};

export default Root;
