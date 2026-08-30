import { supabase } from "./supabaseClient";
import type { Session } from "@supabase/supabase-js";

// Thin wrapper around Supabase Auth. Passwords are hashed and checked on
// Supabase's own auth server - never in this browser code. There is no
// custom "admin_user" table; Supabase manages accounts internally. Create
// the one admin account from the Supabase Dashboard -> Authentication ->
// Users -> Add User (see README).

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return data.subscription;
}
