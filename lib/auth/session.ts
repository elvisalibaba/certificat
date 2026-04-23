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
    .maybeSingle();

  if (data) return data;

  return {
    id: user.id,
    email: user.email ?? "",
    full_name: (user.user_metadata?.full_name as string | null) ?? null,
    role: "artisan" as Role,
    phone: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function requireProfile(roles?: Role[]) {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (roles && !roles.includes(profile.role)) redirect("/");

  return profile;
}
