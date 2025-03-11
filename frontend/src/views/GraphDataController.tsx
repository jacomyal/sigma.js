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
      
      // Domyślnie węzeł jest widoczny
      let isCategoryVisible = true;
      
      if (allCategories.length > 0) {
        // Sprawdzamy, czy którakolwiek z kategorii węzła jest zaznaczona
        isCategoryVisible = allCategories.some(category => clusters[category]);
      } else {
        // Jeśli węzeł nie ma kategorii, jest widoczny
        isCategoryVisible = true;
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
