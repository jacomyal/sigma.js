export interface NodeData {
  key: string;
  label: string;
  tag: string;
  URL: string;
  cluster: string;
  x: number;
  y: number;
  score: number;
  categories?: string;
  entity_type?: string;
  entity_definition?: string;
  definitions?: Array<{text: string; strength: number}>;
  relations?: Array<{source: string; target: string; description: string; strength: number; is_reverse?: boolean}>;
}

export interface Cluster {
  key: string;
  color: string;
  clusterLabel: string;
}

export interface Tag {
  key: string;
  color: string;
}

export interface Dataset {
  nodes: NodeData[];
  edges: [string, string][];
  clusters: Cluster[];
  tags: Tag[];
}

export interface FiltersState {
  clusters: Record<string, boolean>;
  entityTypes: Record<string, boolean>;
}
