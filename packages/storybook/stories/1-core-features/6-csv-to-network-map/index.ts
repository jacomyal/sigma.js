/**
 * This example shows how to use graphology and sigma to interpret a dataset and
 * to transform it to a mappable graph dataset, without going through any other
 * intermediate step.
 *
 * To do this, we start from a dataset from "The Cartography of Political
 * Science in France" extracted from:
 * https://cartosciencepolitique.sciencespo.fr/#/en
 *
 * The CSV contains one line per institution, with an interesting subject_terms
 * column. We will here transform this dataset to a institution/subject
 * bipartite network map.
 */
import Graph from "graphology";
import { cropToLargestConnectedComponent } from "graphology-components";
import forceAtlas2 from "graphology-layout-forceatlas2";
import circular from "graphology-layout/circular";
import Papa from "papaparse";
import Sigma from "sigma";

export default () => {
  let renderer: Sigma | null = null;

  // 1. Load CSV file:
  Papa.parse<{ name: string; acronym: string; subject_terms: string }>("./data.csv", {
    download: true,
    header: true,
    delimiter: ",",
    complete: (results) => {
      const graph: Graph = new Graph();

      // 2. Build the bipartite graph:
      results.data.forEach((line) => {
        const institution = line.name;
        const acronym = line.acronym;

        // Create the institution node:
        graph.addNode(institution, {
          nodeType: "institution",
          label: [acronym, institution].filter((s) => !!s).join(" - "),
        });

        // Extract subjects list:
        const subjects = (line.subject_terms.match(/(?:\* )[^\n\r]*/g) || []).map((str) => str.replace(/^\* /, ""));

        // For each subject, create the node if it does not exist yet:
        subjects.forEach((subject) => {
          if (!graph.hasNode(subject)) graph.addNode(subject, { nodeType: "subject", label: subject });

          graph.addEdge(institution, subject, { weight: 1 });
        });
      });

      // 3. Only keep the main connected component:
      cropToLargestConnectedComponent(graph);

      // 4. Add colors to the nodes, based on node types:
      const COLORS: Record<string, string> = { institution: "#FA5A3D", subject: "#5A75DB" };
      graph.forEachNode((node, attributes) =>
        graph.setNodeAttribute(node, "color", COLORS[attributes.nodeType as string]),
      );

      // 5. Use degrees for node sizes:
      const degrees = graph.nodes().map((node) => graph.degree(node));
      const minDegree = Math.min(...degrees);
      const maxDegree = Math.max(...degrees);
      const minSize = 2,
        maxSize = 15;
      graph.forEachNode((node) => {
        const degree = graph.degree(node);
        graph.setNodeAttribute(
          node,
          "size",
          minSize + ((degree - minDegree) / (maxDegree - minDegree)) * (maxSize - minSize),
        );
      });

      // 6. Position nodes on a circle, then run Force Atlas 2 for a while to get
      //    proper graph layout:
      circular.assign(graph);
      const settings = forceAtlas2.inferSettings(graph);
      forceAtlas2.assign(graph, { settings, iterations: 600 });

      // 7. Hide the loader from the DOM:
      const loader = document.getElementById("loader") as HTMLElement;
      loader.style.display = "none";

      // 8. Finally, draw the graph using sigma:
      const container = document.getElementById("sigma-container") as HTMLElement;
      renderer = new Sigma(graph, container);
    },
  });

  return () => {
    if (renderer) renderer.kill();
  };
};
