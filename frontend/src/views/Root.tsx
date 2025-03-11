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
  const graph = useMemo(() => new DirectedGraph(), []);
  const [showContents, setShowContents] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    entityTypes: {},
  });
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

  // Load data on mount:
  useEffect(() => {
    // Adres API - w trybie dev korzystamy z lokalnego API, a w produkcji z pliku JSON
    const apiUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:5001/api/graph-data' 
      : './ai_news_dataset.json';
    
    console.log(`Pobieranie danych z: ${apiUrl}`);
    
    fetch(apiUrl)
      .then((res) => res.json())
      .then((dataset: Dataset) => {
        // Przetwarzamy klastry - rozbijamy kategorie po przecinku
        const processedClusters: Cluster[] = [];
        const clusterColorMap: Record<string, string> = {};
        
        // Najpierw zbieramy wszystkie unikalne kategorie i przypisujemy im kolory
        dataset.clusters.forEach((cluster) => {
          const categories = cluster.key.split(',').map(cat => cat.trim());
          categories.forEach((category) => {
            if (!clusterColorMap[category]) {
              // Używamy koloru z oryginalnego klastra lub generujemy nowy
              clusterColorMap[category] = cluster.color;
            }
          });
        });
        
        // Tworzymy nowe klastry dla każdej unikalnej kategorii
        Object.keys(clusterColorMap).forEach((category) => {
          processedClusters.push({
            key: category,
            color: clusterColorMap[category],
            clusterLabel: category
          });
        });
        
        // Zastępujemy oryginalne klastry przetworzonymi
        dataset.clusters = processedClusters;
        
        // Pobieramy tagi do użycia przy tworzeniu węzłów
        const tags = keyBy(dataset.tags, "key");

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
        
        dataset.nodes.forEach((node) => {
          const entityType = node.entity_type || node.tag;
          if (entityType) {
            entityTypesSet.add(entityType);
            entityTypesRecord[entityType] = true;
          }
        });
        
        // Przypisujemy kolory do typów encji
        Array.from(entityTypesSet).forEach((entityType, index) => {
          entityTypeColors[entityType] = colorPalette[index % colorPalette.length];
        });

        dataset.nodes.forEach((node) => {
          // Dla każdego węzła, przypisujemy mu wszystkie jego kategorie jako atrybuty
          const nodeCategories = node.categories ? node.categories.split(',').map(cat => cat.trim()) : [];
          const mainCategory = nodeCategories.length > 0 ? nodeCategories[0] : "Unknown";
          const entityType = node.entity_type || node.tag || "Unknown";
          
          graph.addNode(node.key, {
            ...node,
            // Używamy typu encji do kolorowania węzła
            color: entityTypeColors[entityType] || "#ccc",
            // Zachowujemy informację o klastrze dla tooltipa
            clusterLabel: mainCategory,
            // Zapisujemy wszystkie kategorie węzła do późniejszego filtrowania
            allCategories: nodeCategories,
          });
        });
        
        dataset.edges.forEach(([source, target]) => graph.addEdge(source, target, { size: 1 }));

        // Use degrees as node sizes:
        const scores = graph.nodes().map((node) => graph.getNodeAttribute(node, "score"));
        const minDegree = Math.min(...scores);
        const maxDegree = Math.max(...scores);
        const MIN_NODE_SIZE = 3;
        const MAX_NODE_SIZE = 30;
        graph.forEachNode((node) =>
          graph.setNodeAttribute(
            node,
            "size",
            ((graph.getNodeAttribute(node, "score") - minDegree) / (maxDegree - minDegree)) *
              (MAX_NODE_SIZE - MIN_NODE_SIZE) +
              MIN_NODE_SIZE,
          ),
        );

        // Układamy węzły według typów encji
        arrangeNodesByEntityType(graph);

        setFiltersState({
          clusters: mapValues(keyBy(dataset.clusters, "key"), constant(true)),
          entityTypes: entityTypesRecord,
        });
        setDataset(dataset);
        requestAnimationFrame(() => setDataReady(true));
      })
      .catch((error) => {
        console.error("Błąd podczas ładowania danych:", error);
        setError("Nie udało się załadować danych. Spróbuj ponownie później.");
      });
  }, []);

  // Funkcja do ponownego układania węzłów
  const rearrangeNodes = useCallback(() => {
    if (graph && dataset) {
      arrangeNodesByEntityType(graph);
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
