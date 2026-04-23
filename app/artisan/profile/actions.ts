"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function genderValue(value: string | null) {
  return value === "female" || value === "male" || value === "other" || value === "not_specified"
    ? value
    : "not_specified";
}

export async function updateArtisanProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Non authentifie.");

  const { error: profileError } = await supabase.from("profiles").update({
    full_name: text(formData, "fullName"),
    phone: text(formData, "phone"),
  }).eq("id", userData.user.id);

  if (profileError) throw new Error(profileError.message);

  const experience = Number(text(formData, "professionalExperienceYears") ?? 0);
  const { error: artisanError } = await supabase.from("artisan_profiles").upsert({
    user_id: userData.user.id,
    public_display_name: text(formData, "publicDisplayName"),
    national_id: text(formData, "nationalId"),
    gender: genderValue(text(formData, "gender")),
    birth_date: text(formData, "birthDate"),
    nationality: text(formData, "nationality") ?? "Congolaise",
    province: text(formData, "province"),
    territory: text(formData, "territory"),
    commune: text(formData, "commune"),
    address: text(formData, "address"),
    city: text(formData, "city"),
    country: text(formData, "country") ?? "RDC",
    craft_card_number: text(formData, "craftCardNumber"),
    professional_experience_years: Number.isFinite(experience) ? experience : 0,
    craft_specialty: text(formData, "craftSpecialty"),
    cooperative_name: text(formData, "cooperativeName"),
    legal_representative_name: text(formData, "legalRepresentativeName"),
    public_phone: text(formData, "publicPhone"),
    public_email: text(formData, "publicEmail"),
    allow_public_producer_name: formData.get("allowPublicProducerName") === "on",
  }, { onConflict: "user_id" });

  if (artisanError) throw new Error(artisanError.message);

  const { data: saved, error: readError } = await supabase
    .from("artisan_profiles")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (readError) throw new Error(readError.message);
  if (!saved) throw new Error("La fiche artisan n'a pas ete enregistree.");

  revalidatePath("/artisan/profile");
  revalidatePath("/artisan/dashboard");
  redirect("/artisan/profile");
}
