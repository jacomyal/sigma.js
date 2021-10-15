import React, { FC } from "react";
import { BsInfoCircle } from "react-icons/all";

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
        <a href="https://en.wikipedia.org/wiki/See_also">"See also" link</a>.
      </p>
      <p>
        The seed articles were selected by hand by the{" "}
        <a href="https://medialab.sciencespo.fr/">Sciences-Po médialab</a> team, and the network was crawled using{" "}
        <a href="https://densitydesign.github.io/strumentalia-seealsology/">Seealsology</a>, and then cleaned and
        enriched manually. This makes the dataset creditable to both the médialab team and{" "}
        <a href="https://en.wikipedia.org/wiki/Wikipedia:Wikipedians">Wikipedia editors</a>.
      </p>
      <p>
        This web application has been developed by <a href="https://www.ouestware.com/en/">OuestWare</a>, using{" "}
        <a href="https://reactjs.org/">react</a> and <a href="https://sigmajs.org">sigma.js</a>.
      </p>
      <hr />
      <p>
        You can click a node to open the related Wikipedia article. Also, a node size is related to its degree in the
        network (bigger nodes are more connected).
      </p>
    </Panel>
  );
};

export default DescriptionPanel;
