import { BACKEND_URL } from "./api";

// Module handles emergency incident reporting, dashboard status, and the demo-data reset endpoint.
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
  phoneNumber?: string;
  conditionType: string;
  severityScore: number;
  latitude: number;
  longitude: number;
}

export interface IncidentSummary {
  id: number;
  patientReference: string | null;
  phoneNumber: string | null;
  conditionType: string;
  severityScore: number;
  status: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface HospitalStatusView {
  hospitalId: number;
  name: string;
  availableBeds: number;
  totalBeds: number;
}

export interface DashboardSummary {
  pendingIncidents: number;
  ongoingIncidents: number;
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

// Admin panel only - includes phone numbers for verifying a report is
// genuine. See IncidentSummaryView.java on the backend for the security
// note on this endpoint (gated by the frontend admin login only, not by
// the Spring Boot API itself).
export async function getIncidentList(): Promise<IncidentSummary[]> {
  const response = await fetch(`${API_BASE_URL}/list`);
  if (!response.ok) throw new Error(`Incident list failed: ${response.status}`);
  return response.json();
}
