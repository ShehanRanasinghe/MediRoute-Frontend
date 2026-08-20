// Owner: Manuri

const API_BASE_URL = "http://localhost:8080/api/allocation";

export interface PatientIncident {
  id: number;
  patientReference: string;
  conditionType: string;
  severityScore: number;
  status: string;
}

export interface AllocationResult {
  selectedIncidentIds: number[];
  unallocatedIncidentIds: number[];
  totalValueAchieved: number;
  capacityUsed: number;
  totalCapacity: number;
  executionTimeNanos: number;
  algorithmUsed: string;
}

export async function getPendingRequests(): Promise<PatientIncident[]> {
  const response = await fetch(`${API_BASE_URL}/pending-requests`);
  if (!response.ok) throw new Error(`Failed to load pending requests: ${response.status}`);
  return response.json();
}

export async function compareAllocationAlgorithms(
  resourceType: string
): Promise<{ greedy: AllocationResult; knapsack: AllocationResult }> {
  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceType }),
  });
  if (!response.ok) throw new Error(`Comparison request failed: ${response.status}`);
  return response.json();
}
