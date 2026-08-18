import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/routing";

export interface RouteNode {
  id: number;
  name: string;
  type?: string;
  latitude?: number;
  longitude?: number;
}

export interface RouteRequest {
  sourceId: number;
  destinationId: number;
  algorithm?: "dijkstra" | "astar";
}

export interface RouteResult {
  path: (RouteNode | number)[];
  totalDistanceKm: number;
  totalTimeMinutes?: number;
  executionTimeNanos: number;
  algorithmUsed?: string;
  pathFound: boolean;
}

export async function getNetworkNodes(): Promise<RouteNode[]> {
  const response = await fetch(`${API_BASE_URL}/nodes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch network nodes: ${response.status}`);
  }
  return response.json();
}

export async function getShortestPath(request: RouteRequest): Promise<RouteResult> {
  const response = await fetch(`${API_BASE_URL}/shortest-path`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Routing request failed: ${response.status}`);
  }
  return response.json();
}

export async function compareAlgorithms(
  request: Omit<RouteRequest, "algorithm">
): Promise<{ dijkstra: RouteResult; astar: RouteResult }> {
  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Comparison request failed: ${response.status}`);
  }
  return response.json();
}

// Exported alias to resolve missing 'fetchRouteComparison' import in page.tsx
export async function fetchRouteComparison(
  sourceId: number,
  destinationId: number
): Promise<{ dijkstra: RouteResult; astar: RouteResult }> {
  return compareAlgorithms({ sourceId, destinationId });
}