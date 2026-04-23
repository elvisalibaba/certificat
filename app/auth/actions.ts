"use server";

import { redirect } from "next/navigation";
import { registerSchema, loginSchema, resetPasswordSchema } from "@/lib/validators/auth";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME } from "@/lib/constants";

async function ensureProfile(input: { id: string; email: string; fullName?: string | null }) {
  const supabase = await createClient();

  const { data: existing, error: readError } = await supabase
    .from("profiles")
    .select("id,role")
    .eq("id", input.id)
    .maybeSingle();

  if (readError) {
    throw new Error(`Lecture profil impossible: ${readError.message}`);
  }

  if (existing) {
    return existing;
  }

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({
      id: input.id,
      email: input.email,
      full_name: input.fullName ?? null,
      role: "artisan",
    })
    .select("id,role")
    .single();

  if (insertError) {
    throw new Error(`Creation profil impossible: ${insertError.message}`);
  }

  return created;
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) throw new Error("Identifiants invalides.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) throw new Error(error.message);

  const user = data.user;
  if (!user?.id || !user.email) {
    throw new Error("Session utilisateur introuvable apres connexion.");
  }

  const profile = await ensureProfile({
    id: user.id,
    email: user.email,
    fullName: user.user_metadata?.full_name as string | undefined,
  });

  redirect(ROLE_HOME[profile?.role as keyof typeof ROLE_HOME] ?? "/artisan/dashboard");
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) throw new Error("Informations d'inscription invalides.");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });
  if (error) throw new Error(error.message);

  if (data.user?.id && data.user.email) {
    await ensureProfile({
      id: data.user.id,
      email: data.user.email,
      fullName: parsed.data.fullName,
    });
  }

  redirect(data.session ? "/artisan/dashboard" : "/login");
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Email invalide." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);
  if (error) return { error: error.message };
  return { success: "Email de reinitialisation envoye." };
}
