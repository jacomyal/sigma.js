import { useSigma } from "react-sigma-v2";
import { FC, useEffect } from "react";

import { drawHover } from "./canvas-utils";

const GraphSettingsController: FC = ({ children }) => {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    sigma.setSetting("hoverRenderer", (context, data, settings) =>
      drawHover(context, { ...sigma.getNodeDisplayData(data.key), ...data }, settings),
    );
  }, [sigma, graph]);

  return <>{children}</>;
};

export default GraphSettingsController;
