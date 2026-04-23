"use server";

import { redirect } from "next/navigation";
import { registerSchema, loginSchema, resetPasswordSchema } from "@/lib/validators/auth";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME } from "@/lib/constants";

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) throw new Error("Identifiants invalides.");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) throw new Error(error.message);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("email", parsed.data.email)
    .single();

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
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });
  if (error) throw new Error(error.message);

  redirect("/artisan/dashboard");
}

export async function resetPasswordAction(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Email invalide." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);
  if (error) return { error: error.message };
  return { success: "Email de reinitialisation envoye." };
}
