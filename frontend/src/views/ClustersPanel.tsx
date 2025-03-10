import { useSigma } from "@react-sigma/core";
import { keyBy, mapValues, sortBy, values } from "lodash";
import { FC, useEffect, useMemo, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { MdGroupWork } from "react-icons/md";

import { Cluster, FiltersState } from "../types";
import Panel from "./Panel";

const ClustersPanel: FC<{
  clusters: Cluster[];
  filters: FiltersState;
  toggleCluster: (cluster: string) => void;
  setClusters: (clusters: Record<string, boolean>) => void;
}> = ({ clusters, filters, toggleCluster, setClusters }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  const nodesPerCluster = useMemo(() => {
    const index: Record<string, number> = {};
    
    // Zliczamy węzły dla każdej kategorii osobno
    graph.forEachNode((node) => {
      const allCategories = graph.getNodeAttribute(node, "allCategories") || [];
      
      // Jeśli węzeł ma przypisane kategorie, zliczamy go dla każdej z nich
      if (allCategories.length > 0) {
        allCategories.forEach((category: string) => {
          index[category] = (index[category] || 0) + 1;
        });
      } else {
        // Jeśli nie ma kategorii, używamy głównego klastra
        const cluster = graph.getNodeAttribute(node, "cluster");
        if (cluster) {
          index[cluster] = (index[cluster] || 0) + 1;
        }
      }
    });
    
    return index;
  }, []);

  const maxNodesPerCluster = useMemo(() => Math.max(...values(nodesPerCluster)), [nodesPerCluster]);
  const visibleClustersCount = useMemo(() => Object.keys(filters.clusters).length, [filters]);

  const [visibleNodesPerCluster, setVisibleNodesPerCluster] = useState<Record<string, number>>(nodesPerCluster);
  useEffect(() => {
    // To ensure the graphology instance has up to data "hidden" values for
    // nodes, we wait for next frame before reindexing. This won't matter in the
    // UX, because of the visible nodes bar width transition.
    requestAnimationFrame(() => {
      const index: Record<string, number> = {};
      
      // Zliczamy widoczne węzły dla każdej kategorii
      graph.forEachNode((_, attributes) => {
        if (attributes.hidden) return;
        
        const allCategories = attributes.allCategories || [];
        
        // Jeśli węzeł ma przypisane kategorie, zliczamy go dla każdej z nich
        if (allCategories.length > 0) {
          allCategories.forEach((category: string) => {
            index[category] = (index[category] || 0) + 1;
          });
        } else {
          // Jeśli nie ma kategorii, używamy głównego klastra
          const cluster = attributes.cluster;
          if (cluster) {
            index[cluster] = (index[cluster] || 0) + 1;
          }
        }
      });
      
      setVisibleNodesPerCluster(index);
    });
  }, [filters]);

  const sortedClusters = useMemo(
    () => sortBy(clusters, (cluster) => -(nodesPerCluster[cluster.key] || 0)),
    [clusters, nodesPerCluster],
  );

  return (
    <Panel
      title={
        <>
          <MdGroupWork className="text-muted" /> Categories
          {visibleClustersCount < clusters.length ? (
            <span className="text-muted text-small">
              {" "}
              ({visibleClustersCount} / {clusters.length})
            </span>
          ) : (
            ""
          )}
        </>
      }
    >
      <p>
        <i className="text-muted">Click a category to show/hide related entities from the network.</i>
      </p>
      <p className="buttons">
        <button className="btn" onClick={() => setClusters(mapValues(keyBy(clusters, "key"), () => true))}>
          <AiOutlineCheckCircle /> Check all
        </button>{" "}
        <button className="btn" onClick={() => setClusters({})}>
          <AiOutlineCloseCircle /> Uncheck all
        </button>
      </p>
      <ul>
        {sortedClusters.map((cluster) => {
          const nodesCount = nodesPerCluster[cluster.key] || 0;
          const visibleNodesCount = visibleNodesPerCluster[cluster.key] || 0;
          
          // Pomijamy kategorie bez węzłów
          if (nodesCount === 0) return null;
          
          return (
            <li
              className="caption-row"
              key={cluster.key}
              title={`${nodesCount} entity${nodesCount > 1 ? "ies" : ""}${
                visibleNodesCount !== nodesCount
                  ? visibleNodesCount > 0
                    ? ` (only ${visibleNodesCount > 1 ? `${visibleNodesCount} are` : "one is"} visible)`
                    : " (all hidden)"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                checked={filters.clusters[cluster.key] || false}
                onChange={() => toggleCluster(cluster.key)}
                id={`cluster-${cluster.key}`}
              />
              <label htmlFor={`cluster-${cluster.key}`}>
                <span className="circle" style={{ background: cluster.color, borderColor: cluster.color }} />{" "}
                <div className="node-label">
                  <span>{cluster.clusterLabel} ({nodesCount} entities)</span>
                  <div className="bar" style={{ width: (100 * nodesCount) / maxNodesPerCluster + "%" }}>
                    <div
                      className="inside-bar"
                      style={{
                        width: (100 * visibleNodesCount) / nodesCount + "%",
                      }}
                    />
                  </div>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
};

export default ClustersPanel;
