// Owner: Integration

const API_BASE_URL = "http://localhost:8080/api/incident";

export interface HospitalRecommendation {
  hospitalId: number;
  hospitalName: string;
  score: number;
  distanceKm: number;
  specialtyMatch: boolean;
  availableBeds: number;
}

export interface RouteResult {
  path: number[];
  totalDistanceKm: number;
  totalTimeMinutes: number;
  executionTimeNanos: number;
  algorithmUsed: string;
  pathFound: boolean;
}

export interface DispatchPlanView {
  selectedItemNames: string[];
  totalValueAchieved: number;
  capacityUsed: number;
  totalCapacity: number;
  algorithmUsed: string;
}

export interface IncidentResponse {
  incidentId: number;
  recommendedHospital: HospitalRecommendation | null;
  route: RouteResult | null;
  ambulanceAllocated: boolean;
  dispatchPlan: DispatchPlanView;
  routeUsesCriticalNode: boolean;
  overallProcessingTimeNanos: number;
}

export interface IncidentReportRequest {
  patientReference?: string;
  conditionType: string;
  severityScore: number;
  latitude: number;
  longitude: number;
}

export interface HospitalStatusView {
  hospitalId: number;
  name: string;
  availableBeds: number;
  totalBeds: number;
}

export interface DashboardSummary {
  pendingIncidents: number;
  availableAmbulances: number;
  criticalNodeCount: number;
  hospitals: HospitalStatusView[];
}

export async function reportIncident(request: IncidentReportRequest): Promise<IncidentResponse> {
  const response = await fetch(`${API_BASE_URL}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) throw new Error(`Incident report failed: ${response.status}`);
  return response.json();
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await fetch(`${API_BASE_URL}/dashboard-summary`);
  if (!response.ok) throw new Error(`Dashboard summary failed: ${response.status}`);
  return response.json();
}
