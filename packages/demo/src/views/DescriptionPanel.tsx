import { FC } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { useSigma } from "@react-sigma/core";

import Panel from "./Panel";

interface DescriptionPanelProps {
  selectedNode?: string | null;
}

// Interfejs dla definicji encji
interface Definition {
  text: string;
  strength: number;
}

const DescriptionPanel: FC<DescriptionPanelProps> = ({ selectedNode }) => {
  const sigma = selectedNode ? useSigma() : null;
  const graph = sigma?.getGraph();
  
  // Gdy mamy wybrany węzeł, pobieramy jego dane i wyświetlamy szczegóły
  if (selectedNode && graph && graph.hasNode(selectedNode)) {
    const nodeAttributes = graph.getNodeAttributes(selectedNode);
    const { label, categories, definitions } = nodeAttributes;
    
    // Sortujemy definicje według strength (malejąco)
    const sortedDefinitions: Definition[] = definitions && Array.isArray(definitions) 
      ? [...definitions].sort((a, b) => b.strength - a.strength)
      : [];
    
    return (
      <Panel
        initiallyDeployed
        title={
          <>
            <BsInfoCircle className="text-muted" /> Entity Information: {label}
          </>
        }
      >
        {categories && (
          <div className="node-detail">
            <h4>Categories:</h4>
            <p>{categories}</p>
          </div>
        )}
        
        {sortedDefinitions && sortedDefinitions.length > 0 ? (
          <div className="node-detail">
            <h4>Definitions:</h4>
            <ol className="definitions-list">
              {sortedDefinitions.map((def, index) => (
                <li key={index} className="definition-item">
                  <p>{def.text}</p>
                  <div className="strength-container">
                    <small className="strength-label">Definition Strength:</small>
                    <div className="strength-bar-container">
                      <div 
                        className="strength-bar" 
                        style={{ width: `${def.strength}%` }}
                        title={`Definition Strength: ${def.strength}`}
                      ></div>
                    </div>
                    <small className="strength-value">{def.strength}</small>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p>No definitions for this entity.</p>
        )}
      </Panel>
    );
  }
  
  // Gdy nie ma wybranego węzła, wyświetlamy standardowy opis
  return (
    <Panel
      initiallyDeployed
      title={
        <>
          <BsInfoCircle className="text-muted" /> Graph Description
        </>
      }
    >
      <p>
        This map represents a knowledge graph about AI that is updated every 24 hours based on AI news. 
        Each <i>node</i> represents a concept or entity, and each <i>edge</i> represents a relationship between them.
      </p>
      <p>
        This is a place that will help you navigate the complex world of AI connections, created by{" "}
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/damian-salkowski/">
          Damian Salkowski
        </a>{" "}
        from{" "}
        <a target="_blank" rel="noreferrer" href="https://www.sensai.academy/">
          SensAI
        </a>{" "}
        using{" "}
        <a target="_blank" rel="noreferrer" href="https://www.sigmajs.org">
          Sigma.js
        </a>.
      </p>
      <p>
        Node sizes are related to their{" "}
        <a target="_blank" rel="noreferrer" href="https://en.wikipedia.org/wiki/Betweenness_centrality">
          betweenness centrality
        </a>. 
        More central nodes (i.e., larger nodes) are important crossing points in the network. 
        You can click a node to view more information about it.
      </p>
    </Panel>
  );
};

export default DescriptionPanel;
