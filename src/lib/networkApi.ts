import { BACKEND_URL } from "./api";

// Communicates with the network analysis endpoints for resilience and ranking calculations.
const API_BASE_URL = `${BACKEND_URL}/api/network`;

export interface CriticalNodeResult {
  criticalNodeIds: number[];
  executionTimeNanos: number;
  algorithmUsed: string;
}

export interface MSTEdge {
  fromNodeId: number;
  toNodeId: number;
  weightKm: number;
}

export interface MSTResult {
  edges: MSTEdge[];
  totalWeightKm: number;
  executionTimeNanos: number;
  algorithmUsed: string;
  connected: boolean;
}

export interface NodeCentrality {
  nodeId: number;
  name: string;
  degreeScore: number;
}

export interface CentralityResult {
  rankedNodes: NodeCentrality[];
  executionTimeNanos: number;
  algorithmUsed: string;
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export function getCriticalNodes(): Promise<CriticalNodeResult> {
  return get<CriticalNodeResult>("/critical-nodes");
}

export function getMST(): Promise<MSTResult> {
  return get<MSTResult>("/mst");
}

export function getCentralityRanking(): Promise<CentralityResult> {
  return get<CentralityResult>("/centrality-ranking");
}
