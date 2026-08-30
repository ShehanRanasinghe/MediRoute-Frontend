import { supabase } from "./supabaseClient";

// Reads/writes the incident_location table directly via Supabase - no
// Spring Boot endpoint involved. Public read (populates the searchable
// dropdown on Report Incident), admin-only write (enforced by RLS policy
// "admin_write_incident_location", not by this file).

export interface IncidentLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export async function getIncidentLocations(): Promise<IncidentLocation[]> {
  const { data, error } = await supabase
    .from("incident_location")
    .select("id, name, latitude, longitude")
    .order("name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addIncidentLocation(location: Omit<IncidentLocation, "id">): Promise<void> {
  const { error } = await supabase.from("incident_location").insert(location);
  if (error) throw error;
}

export async function deleteIncidentLocation(id: number): Promise<void> {
  const { error } = await supabase.from("incident_location").delete().eq("id", id);
  if (error) throw error;
}
