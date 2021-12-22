import React, { FC } from "react";
import { BsInfoCircle } from "react-icons/bs";

import Panel from "./Panel";

const DescriptionPanel: FC = () => {
  return (
    <Panel
      initiallyDeployed
      title={
        <>
          <BsInfoCircle className="text-muted" /> Description
        </>
      }
    >
      <p>
        This map represents a <i>network</i> of Wikipedia articles around the topic of "Data vizualisation". Each{" "}
        <i>node</i> represents an article, and each edge a{" "}
        <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/See_also">
          "See also" link
        </a>
        .
      </p>
      <p>
        The seed articles were selected by hand by the{" "}
        <a target="_blank" rel="noreferrer" href="https://medialab.sciencespo.fr/">
          Sciences-Po médialab
        </a>{" "}
        team, and the network was crawled using{" "}
        <a target="_blank" rel="noreferrer" href="https://densitydesign.github.io/strumentalia-seealsology/">
          Seealsology
        </a>
        , and then cleaned and enriched manually. This makes the dataset creditable to both the médialab team and{" "}
        <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Wikipedia:Wikipedians">
          Wikipedia editors
        </a>
        .
      </p>
      <p>
        This web application has been developed by{" "}
        <a target="_blank" rel="noreferrer" href="https://www.ouestware.com/en/">
          OuestWare
        </a>
        , using{" "}
        <a target="_blank" rel="noreferrer" href="https://reactjs.org/">
          react
        </a>{" "}
        and{" "}
        <a target="_blank" rel="noreferrer" href="https://www.sigmajs.org">
          sigma.js
        </a>
        . You can read the source code{" "}
        <a target="_blank" rel="noreferrer" href="https://github.com/jacomyal/sigma.js/tree/main/demo">
          on GitHub
        </a>
        .
      </p>
      <p>
        Nodes sizes are related to their{" "}
        <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Betweenness_centrality">
          betweenness centrality
        </a>
        . More central nodes (ie. bigger nodes) are important crossing points in the network. Finally, You can click a
        node to open the related Wikipedia article.
      </p>
    </Panel>
  );
};

export default DescriptionPanel;
