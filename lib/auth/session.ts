import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/constants";

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function requireProfile(roles?: Role[]) {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (roles && !roles.includes(profile.role)) redirect("/");

  return profile;
}
