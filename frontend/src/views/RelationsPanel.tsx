import { FC } from "react";
import { BsLink45Deg } from "react-icons/bs";
import { useSigma } from "@react-sigma/core";

import Panel from "./Panel";

interface RelationsPanelProps {
  selectedNode?: string | null;
}

// Interfejsy dla typów danych
interface Relation {
  source: string;
  target: string;
  description: string;
  strength: number;
  is_reverse?: boolean;
}

// Struktura dla zgrupowanych relacji
interface GroupedRelation {
  source: string;
  target: string;
  descriptions: { text: string; strength: number; is_reverse?: boolean }[];
}

const RelationsPanel: FC<RelationsPanelProps> = ({ selectedNode }) => {
  const sigma = selectedNode ? useSigma() : null;
  const graph = sigma?.getGraph();
  
  if (!selectedNode || !graph || !graph.hasNode(selectedNode)) {
    return null; // Nie pokazuj panelu, jeśli nie ma wybranego węzła
  }
  
  const nodeAttributes = graph.getNodeAttributes(selectedNode);
  const { label, relations } = nodeAttributes;
  
  if (!relations || !Array.isArray(relations) || relations.length === 0) {
    return (
      <Panel
        title={
          <>
            <BsLink45Deg className="text-muted" /> Relations: {label}
          </>
        }
      >
        <p>No relations for this entity.</p>
      </Panel>
    );
  }
  
  // Grupujemy relacje według par source-target
  const groupedRelations: GroupedRelation[] = [];
  relations.forEach((relation: Relation) => {
    const existingGroupIndex = groupedRelations.findIndex(
      (group) => group.source === relation.source && group.target === relation.target
    );
    
    if (existingGroupIndex >= 0) {
      // Dodajemy opis do istniejącej grupy
      groupedRelations[existingGroupIndex].descriptions.push({
        text: relation.description,
        strength: relation.strength,
        is_reverse: relation.is_reverse
      });
    } else {
      // Tworzymy nową grupę
      groupedRelations.push({
        source: relation.source,
        target: relation.target,
        descriptions: [{
          text: relation.description,
          strength: relation.strength,
          is_reverse: relation.is_reverse
        }]
      });
    }
  });
  
  // Sortujemy grupy relacji, najpierw te, gdzie wybrany węzeł jest źródłem
  const sortedGroups = [...groupedRelations].sort((a, b) => {
    // Relacje, gdzie wybrany węzeł jest źródłem, mają pierwszeństwo
    if (a.source === selectedNode && b.source !== selectedNode) return -1;
    if (a.source !== selectedNode && b.source === selectedNode) return 1;
    return 0;
  });
  
  return (
    <Panel
      title={
        <>
          <BsLink45Deg className="text-muted" /> Relations: {label}
        </>
      }
    >
      <div className="relations-list">
        {sortedGroups.map((group, groupIndex) => {
          // Sortujemy opisy według siły relacji (malejąco)
          const sortedDescriptions = [...group.descriptions].sort((a, b) => b.strength - a.strength);
          
          // Sprawdzamy, czy to relacja wychodząca czy przychodząca
          const isOutgoing = group.source === selectedNode;
          const otherNode = isOutgoing ? group.target : group.source;
          
          return (
            <div key={groupIndex} className="relation-group">
              <h4>
                {isOutgoing ? (
                  <>
                    <span className="relation-direction outgoing">→</span>
                    {otherNode}
                  </>
                ) : (
                  <>
                    <span className="relation-direction incoming">←</span>
                    {otherNode}
                  </>
                )}
              </h4>
              
              <ul className="relation-descriptions">
                {sortedDescriptions.map((desc, descIndex) => (
                  <li key={descIndex} className="relation-description">
                    <p>{desc.text || "No relation description"}</p>
                    {desc.strength > 0 && (
                      <div className="strength-container">
                        <small className="strength-label">Relation Strength:</small>
                        <div className="strength-bar-container">
                          <div 
                            className="strength-bar" 
                            style={{ width: `${desc.strength}%` }}
                            title={`Relation Strength: ${desc.strength}`}
                          ></div>
                        </div>
                        <small className="strength-value">{desc.strength}</small>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export default RelationsPanel; 