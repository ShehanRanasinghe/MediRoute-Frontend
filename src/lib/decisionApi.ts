import { BACKEND_URL } from "./api";

// Module sends hospital recommendation requests to the decision service and maps the backend response.
const API_BASE_URL = `${BACKEND_URL}/api/decision`;

export interface HospitalRecommendation {
  hospitalId: number;
  hospitalName: string;
  score: number;
  distanceKm: number;
  specialtyMatch: boolean;
  availableBeds: number;
}

export interface RecommendationResult {
  rankedHospitals: HospitalRecommendation[];
  executionTimeNanos: number;
  algorithmUsed: string;
}

export interface RecommendationRequest {
  conditionType: string;
  patientLatitude: number;
  patientLongitude: number;
  topK?: number;
}

export async function compareRecommendationAlgorithms(
  request: RecommendationRequest
): Promise<{ heap: RecommendationResult; fullSort: RecommendationResult }> {
  const response = await fetch(`${API_BASE_URL}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Comparison request failed: ${response.status}`);
  return response.json();
}
