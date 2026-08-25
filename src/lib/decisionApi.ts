// Owner: Manura

const API_BASE_URL = "http://localhost:8080/api/decision";

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
