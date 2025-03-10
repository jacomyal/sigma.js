import { useSigma } from "@react-sigma/core";
import { FC, PropsWithChildren, useEffect } from "react";

import { FiltersState } from "../types";

const GraphDataController: FC<PropsWithChildren<{ filters: FiltersState }>> = ({ filters, children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  /**
   * Apply filters to graphology:
   */
  useEffect(() => {
    const { clusters, entityTypes } = filters;
    
    graph.forEachNode((node, attributes) => {
      const tag = attributes.tag;
      const entityType = attributes.entity_type || tag;
      const allCategories = attributes.allCategories || [];
      
      // Węzeł jest widoczny, jeśli przynajmniej jedna z jego kategorii jest zaznaczona
      // ORAZ jego typ encji jest zaznaczony
      let isCategoryVisible = false;
      
      if (allCategories.length > 0) {
        // Sprawdzamy, czy którakolwiek z kategorii węzła jest zaznaczona
        isCategoryVisible = allCategories.some(category => clusters[category]);
      } else {
        // Jeśli węzeł nie ma kategorii, używamy głównego klastra
        const cluster = attributes.cluster;
        isCategoryVisible = cluster ? clusters[cluster] : false;
      }
      
      // Sprawdzamy, czy typ encji węzła jest zaznaczony
      const isTypeVisible = entityTypes[entityType];
      
      // Węzeł jest widoczny tylko wtedy, gdy jego kategoria i typ są zaznaczone
      const isVisible = isCategoryVisible && isTypeVisible;
      
      graph.setNodeAttribute(node, "hidden", !isVisible);
    });
  }, [graph, filters]);

  return <>{children}</>;
};

export default GraphDataController;
