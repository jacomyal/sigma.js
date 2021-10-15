import React, { FC, useEffect, useMemo, useState } from "react";
import { MdCategory, MdExpandLess, MdExpandMore } from "react-icons/md";

import { FiltersState, Tag } from "../types";
import { useSigma } from "react-sigma-v2";
import { sortBy, values } from "lodash";

const TagsPanel: FC<{
  tags: Tag[];
  filters: FiltersState;
  toggleTag: (tag: string) => void;
}> = ({ tags, filters, toggleTag }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  const [isDeployed, setIsDeployed] = useState(true);

  const nodesPerTag = useMemo(() => {
    const index: Record<string, number> = {};
    graph.forEachNode((_, { tag }) => (index[tag] = (index[tag] || 0) + 1));
    return index;
  }, []);

  const maxNodesPerTag = useMemo(() => Math.max(...values(nodesPerTag)), [nodesPerTag]);

  const [visibleNodesPerTag, setVisibleNodesPerTag] = useState<Record<string, number>>(nodesPerTag);
  useEffect(() => {
    // To ensure the graphology instance has up to data "hidden" values for
    // nodes, we wait for next frame before reindexing. This won't matter in the
    // UX, because of the visible nodes bar width transition.
    requestAnimationFrame(() => {
      const index: Record<string, number> = {};
      graph.forEachNode((_, { tag, hidden }) => !hidden && (index[tag] = (index[tag] || 0) + 1));
      setVisibleNodesPerTag(index);
    });
  }, [filters]);

  const sortedTags = useMemo(
    () => sortBy(tags, (tag) => (tag.key === "unknown" ? Infinity : -nodesPerTag[tag.key])),
    [tags, nodesPerTag],
  );

  return (
    <div className="tags panel">
      <h2>
        <MdCategory className="text-muted" /> Categories{" "}
        <button type="button" onClick={() => setIsDeployed((v) => !v)}>
          {isDeployed ? <MdExpandLess /> : <MdExpandMore />}
        </button>
      </h2>
      {isDeployed && (
        <div>
          <p>
            <i className="text-muted">Click a category to show/hide related pages from the network.</i>
          </p>
          <ul>
            {sortedTags.map((tag) => {
              const nodesCount = nodesPerTag[tag.key];
              const visibleNodesCount = visibleNodesPerTag[tag.key] || 0;
              return (
                <li
                  className="caption-row"
                  key={tag.key}
                  title={`${nodesCount} page${nodesCount > 1 ? "s" : ""}${
                    visibleNodesCount !== nodesCount ? ` (${visibleNodesCount} visible now)` : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.tags[tag.key] || false}
                    onChange={() => toggleTag(tag.key)}
                    id={`tag-${tag.key}`}
                  />
                  <label htmlFor={`tag-${tag.key}`}>
                    <span className="circle" style={{ backgroundImage: `url(${tag.image})` }} />{" "}
                    <div className="node-label">
                      <span>{tag.key}</span>
                      <div className="bar" style={{ width: (100 * nodesCount) / maxNodesPerTag + "%" }}>
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
        </div>
      )}
    </div>
  );
};

export default TagsPanel;
