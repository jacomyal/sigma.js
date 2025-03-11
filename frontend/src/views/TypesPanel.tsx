import { useSigma } from "@react-sigma/core";
import { keyBy, mapValues, sortBy, values } from "lodash";
import { FC, useEffect, useMemo, useState } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import { MdCategory } from "react-icons/md";

import { FiltersState, Tag } from "../types";
import Panel from "./Panel";

const TypesPanel: FC<{
  tags: Tag[];
  filters: FiltersState;
  toggleEntityType: (entityType: string) => void;
  setEntityTypes: (entityTypes: Record<string, boolean>) => void;
}> = ({ tags, filters, toggleEntityType, setEntityTypes }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  const nodesPerType = useMemo(() => {
    const index: Record<string, number> = {};
    graph.forEachNode((_, attributes) => {
      const entityType = attributes.entity_type || attributes.tag;
      index[entityType] = (index[entityType] || 0) + 1;
    });
    return index;
  }, []);

  const maxNodesPerType = useMemo(() => Math.max(...values(nodesPerType)), [nodesPerType]);
  const visibleTypesCount = useMemo(() => Object.keys(filters.entityTypes).length, [filters]);

  const [visibleNodesPerType, setVisibleNodesPerType] = useState<Record<string, number>>(nodesPerType);
  useEffect(() => {
    // To ensure the graphology instance has up to date "hidden" values for
    // nodes, we wait for next frame before reindexing. This won't matter in the
    // UX, because of the visible nodes bar width transition.
    requestAnimationFrame(() => {
      const index: Record<string, number> = {};
      graph.forEachNode((_, attributes) => {
        if (attributes.hidden) return;
        const entityType = attributes.entity_type || attributes.tag;
        index[entityType] = (index[entityType] || 0) + 1;
      });
      setVisibleNodesPerType(index);
    });
  }, [filters]);

  // Tworzymy unikalną listę typów encji
  const entityTypes = useMemo(() => {
    const types: Tag[] = [];
    const typesMap: Record<string, boolean> = {};
    
    // Zbieramy wszystkie unikalne typy encji
    graph.forEachNode((_, attributes) => {
      const entityType = attributes.entity_type || attributes.tag;
      if (!typesMap[entityType]) {
        typesMap[entityType] = true;
        
        // Znajdujemy odpowiedni tag dla tego typu
        const matchingTag = tags.find(t => t.key === attributes.tag);
        
        types.push({
          key: entityType,
          color: matchingTag ? matchingTag.color : "#bab0ab" // Domyślny kolor dla nieznanych typów
        });
      }
    });
    
    return types;
  }, [graph, tags]);

  const sortedTypes = useMemo(
    () => sortBy(entityTypes, (type) => (type.key === "unknown" ? Infinity : -nodesPerType[type.key])),
    [entityTypes, nodesPerType],
  );

  return (
    <Panel
      title={
        <>
          <MdCategory className="text-muted" /> Types
          {visibleTypesCount < sortedTypes.length ? (
            <span className="text-muted text-small">
              {" "}
              ({visibleTypesCount} / {sortedTypes.length})
            </span>
          ) : (
            ""
          )}
        </>
      }
    >
      <p>
        <i className="text-muted">Click a type to show/hide related entities from the network.</i>
      </p>
      <p className="buttons">
        <button className="btn" onClick={() => setEntityTypes(mapValues(keyBy(sortedTypes, "key"), () => true))}>
          <AiOutlineCheckCircle /> Check all
        </button>{" "}
        <button className="btn" onClick={() => setEntityTypes({})}>
          <AiOutlineCloseCircle /> Uncheck all
        </button>
      </p>
      <ul>
        {sortedTypes.map((type) => {
          const nodesCount = nodesPerType[type.key] || 0;
          const visibleNodesCount = visibleNodesPerType[type.key] || 0;
          
          // Pomijamy typy bez węzłów
          if (nodesCount === 0) return null;
          
          return (
            <li
              className="caption-row"
              key={type.key}
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
                checked={filters.entityTypes[type.key] || false}
                onChange={() => toggleEntityType(type.key)}
                id={`type-${type.key}`}
              />
              <label htmlFor={`type-${type.key}`}>
                <span className="circle" style={{ backgroundColor: type.color }} />{" "}
                <div className="node-label">
                  <span>{type.key} ({nodesCount} entities)</span>
                  <div className="bar" style={{ width: (100 * nodesCount) / maxNodesPerType + "%" }}>
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

export default TypesPanel; 