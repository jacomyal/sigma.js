import React, { FC, useEffect, useState } from "react";
import { SigmaContainer } from "react-sigma-v2";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { omit, mapValues, keyBy, constant } from "lodash";

import GraphSettingsController from "./GraphSettingsController";
import GraphEventsController from "./GraphEventsController";
import GraphDataController from "./GraphDataController";
import { FullScreenButton } from "./FullScreenButton";
import DescriptionPanel from "./DescriptionPanel";
import { Dataset, FiltersState } from "../types";
import ClustersPanel from "./ClustersPanel";
import { SearchField } from "./SearchField";
import ZoomButtons from "./ZoomButtons";
import drawLabel from "../canvas-utils";
import TagsPanel from "./TagsPanel";
import GraphTitle from "./GraphTitle";

import "react-sigma-v2/lib/react-sigma-v2.css";

const Root: FC = () => {
  const [dataReady, setDataReady] = useState(false);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    tags: {},
  });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Load data on mount:
  useEffect(() => {
    fetch("./dataset.json")
      .then((res) => res.json())
      .then((dataset: Dataset) => {
        setDataset(dataset);
        setFiltersState({
          clusters: mapValues(keyBy(dataset.clusters, "key"), constant(true)),
          tags: mapValues(keyBy(dataset.tags, "key"), constant(true)),
        });
        requestAnimationFrame(() => setDataReady(true));
      });
  }, []);

  if (!dataset) return null;

  return (
    <div id="app-root">
      <SigmaContainer
        graphOptions={{ type: "directed" }}
        initialSettings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          labelRenderer: drawLabel,
          defaultNodeType: "image",
          defaultEdgeType: "arrow",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true,
        }}
        className="react-sigma"
      >
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController setHoveredNode={setHoveredNode} />
        <GraphDataController dataset={dataset} filters={filtersState} />

        {dataReady && (
          <>
            <div className="controls">
              <FullScreenButton />
              <ZoomButtons />
            </div>
            <div className="panels">
              <SearchField filters={filtersState} />
              <DescriptionPanel />
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
              <TagsPanel
                tags={dataset.tags}
                filters={filtersState}
                setTags={(tags) =>
                  setFiltersState((filters) => ({
                    ...filters,
                    tags,
                  }))
                }
                toggleTag={(tag) => {
                  setFiltersState((filters) => ({
                    ...filters,
                    tags: filters.tags[tag] ? omit(filters.tags, tag) : { ...filters.tags, [tag]: true },
                  }));
                }}
              />
            </div>
            <GraphTitle filters={filtersState} />
          </>
        )}
      </SigmaContainer>
    </div>
  );
};

export default Root;
