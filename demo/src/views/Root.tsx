import React, { FC, useEffect, useState } from "react";
import { SigmaContainer } from "react-sigma-v2";
import { BsMenuAppFill } from "react-icons/bs";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import { omit, mapValues, keyBy, constant } from "lodash";

import GraphDataController from "./GraphDataController";
import ZoomButtons from "./ZoomButtons";
import ClustersPanel from "./ClustersPanel";
import TagsPanel from "./TagsPanel";
import { Dataset, FiltersState } from "../types";

import "react-sigma-v2/lib/react-sigma-v2.css";
import "./Root.css";

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
          defaultNodeType: "image",
          defaultEdgeType: "arrow",
        }}
        className="react-sigma"
      >
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
              visibleClusters={filtersState.clusters}
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
              visibleTags={filtersState.tags}
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
