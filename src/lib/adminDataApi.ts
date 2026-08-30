import { supabase } from "./supabaseClient";

// Admin panel data management - direct Supabase reads/writes for
// resource, ambulance_depot, and supply_item. These are simple table
// records with no algorithm involved, so there is no need to route them
// through Spring Boot. Write access is admin-only (enforced by RLS
// policies, see database/08-schema-addition-admin-features.sql).

export interface ResourceRow {
  id: number;
  resource_type: "AMBULANCE" | "ICU_BED" | "WARD_BED" | "VENTILATOR";
  owner_type: "HOSPITAL" | "DEPOT";
  owner_id: number;
  status: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
}

export async function getResources(): Promise<ResourceRow[]> {
  const { data, error } = await supabase.from("resource").select("*").order("id", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addResource(resource: Omit<ResourceRow, "id">): Promise<void> {
  const { error } = await supabase.from("resource").insert(resource);
  if (error) throw error;
}

export interface AmbulanceDepotRow {
  id: number;
  node_id: number;
  total_ambulances: number;
  available_ambulances: number;
}

export async function getAmbulanceDepots(): Promise<AmbulanceDepotRow[]> {
  const { data, error } = await supabase.from("ambulance_depot").select("*");
  if (error) throw error;
  return data ?? [];
}

export interface SupplyItemRow {
  id: number;
  item_name: string;
  item_type: "SUPPLY_CRATE" | "PATIENT_TRANSFER";
  urgency_value: number;
  size_cost: number;
  depot_id: number | null;
  status: "PENDING" | "LOADED" | "DELIVERED";
}

export async function getSupplyItems(): Promise<SupplyItemRow[]> {
  const { data, error } = await supabase.from("supply_item").select("*").order("id", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addSupplyItem(item: Omit<SupplyItemRow, "id">): Promise<void> {
  const { error } = await supabase.from("supply_item").insert(item);
  if (error) throw error;
}
