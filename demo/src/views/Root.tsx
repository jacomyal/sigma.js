import React, { FC, useEffect, useState } from "react";
import { SigmaContainer } from "react-sigma-v2";
import { BsMenuAppFill } from "react-icons/bs";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { omit, mapValues, keyBy, constant } from "lodash";

import GraphSettingsController from "./GraphSettingsController";
import GraphDataController from "./GraphDataController";
import ZoomButtons from "./ZoomButtons";
import ClustersPanel from "./ClustersPanel";
import TagsPanel from "./TagsPanel";
import { Dataset, FiltersState } from "../types";

import "react-sigma-v2/lib/react-sigma-v2.css";
import drawLabel from "./canvas-utils";

const Root: FC = () => {
  const [showCaption, setShowCaption] = useState(false);
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [filtersState, setFiltersState] = useState<FiltersState>({
    clusters: {},
    tags: {},
  });

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
        }}
        className="react-sigma"
      >
        <GraphSettingsController />
        <GraphDataController dataset={dataset} filters={filtersState} />
        <div className="controls">
          <button type="button" className="ico" onClick={() => setShowCaption(!showCaption)} title="Toggle menu">
            <BsMenuAppFill />
          </button>
          <ZoomButtons />
        </div>
        {showCaption && (
          <div className="panels">
            <ClustersPanel
              clusters={dataset.clusters}
              filters={filtersState}
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
              toggleTag={(tag) => {
                setFiltersState((filters) => ({
                  ...filters,
                  tags: filters.tags[tag] ? omit(filters.tags, tag) : { ...filters.tags, [tag]: true },
                }));
              }}
            />
          </div>
        )}
      </SigmaContainer>
    </div>
  );
};

export default Root;
