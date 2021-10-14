import { FC } from "react";
import { Cluster } from "../types";

const ClustersPanel: FC<{
  clusters: Cluster[];
  visibleClusters: Record<string, boolean>;
  toggleCluster: (cluster: string) => void;
}> = ({ clusters, visibleClusters, toggleCluster }) => {
  return (
    <div className="clusters panel">
      <h2>Clusters</h2>
      <ul>
        {clusters.map((cluster) => (
          <li key={cluster.key}>
            <input
              type="checkbox"
              checked={visibleClusters[cluster.key] || false}
              onChange={() => toggleCluster(cluster.key)}
              id={`cluster-${cluster.key}`}
            />
            <label htmlFor={`cluster-${cluster.key}`}>
              <span className="circle" style={{ background: cluster.color, borderColor: cluster.color }} />{" "}
              <span className="label">{cluster.clusterLabel}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClustersPanel;
