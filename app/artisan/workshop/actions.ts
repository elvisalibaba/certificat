"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function upsertWorkshopAction(formData: FormData) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Non authentifie.");

  await supabase.from("workshops").upsert({
    id: formData.get("workshopId") || undefined,
    artisan_id: userData.user.id,
    name: formData.get("name"),
    registration_number: formData.get("registrationNumber"),
    address: formData.get("address"),
    city: formData.get("city"),
    country: formData.get("country") || "RDC",
    province: formData.get("province"),
    territory: formData.get("territory"),
    commune: formData.get("commune"),
    neighborhood: formData.get("neighborhood"),
    latitude: formData.get("latitude") || null,
    longitude: formData.get("longitude") || null,
    legal_status: formData.get("legalStatus"),
    tax_number: formData.get("taxNumber"),
    rccm_number: formData.get("rccmNumber"),
    employee_count: Number(formData.get("employeeCount") || 0),
    women_employee_count: Number(formData.get("womenEmployeeCount") || 0),
    youth_employee_count: Number(formData.get("youthEmployeeCount") || 0),
    production_capacity: formData.get("productionCapacity"),
    equipment_summary: formData.get("equipmentSummary"),
    hygiene_measures: formData.get("hygieneMeasures"),
    description: formData.get("description"),
  });

  revalidatePath("/artisan/workshop");
}
