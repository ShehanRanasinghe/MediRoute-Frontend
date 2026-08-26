// Owner: Integration
// UPDATED: added resetDemoData(), and DispatchPlanView now includes `note`.
import { BACKEND_URL } from "./api";
const API_BASE_URL = `${BACKEND_URL}/api/incident`;
const ADMIN_BASE_URL = `${BACKEND_URL}/api/admin`;

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
  note?: string; // present only when no real plan was computed
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

export async function resetDemoData(): Promise<void> {
  const response = await fetch(`${ADMIN_BASE_URL}/reset-demo-data`, { method: "POST" });
  if (!response.ok) throw new Error(`Reset failed: ${response.status}`);
}
