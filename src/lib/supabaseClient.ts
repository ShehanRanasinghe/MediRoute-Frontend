import { createClient } from "@supabase/supabase-js";

// This is the ONLY file that talks directly to Supabase, bypassing the
// Spring Boot backend entirely. Used for: admin login (Supabase Auth),
// admin CRUD on resources/supply items/incident locations, and reading
// incident locations for the public Report Incident dropdown.
//
// The anon key is SAFE to expose in frontend code by design - "anon"
// means "meant for public client use". Access control is enforced by the
// Row Level Security policies in database/08-schema-addition-admin-features.sql,
// not by hiding this key.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  // Only warns - doesn't throw, so the rest of the app (which doesn't
  // need Supabase directly) keeps working even if these are unset.
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are missing. " +
    "Admin login and admin data management will not work until these are " +
    "set in .env.local - see .env.local.example."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
