import { BACKEND_URL } from "./api";
const API_BASE_URL = `${BACKEND_URL}/api/optimization`;

export interface OptimizationResult {
  selectedItemIds: number[];
  unselectedItemIds: number[];
  totalValueAchieved: number;
  capacityUsed: number;
  totalCapacity: number;
  executionTimeNanos: number;
  algorithmUsed: string;
}

export interface CompareResponse {
  dp: OptimizationResult;
  greedy: OptimizationResult;
  backtracking?: OptimizationResult; 
}

export async function compareOptimizationAlgorithms(vehicleCapacity: number): Promise<CompareResponse> {
  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vehicleCapacity }),
  });
  if (!response.ok) throw new Error(`Comparison request failed: ${response.status}`);
  return response.json();
}
