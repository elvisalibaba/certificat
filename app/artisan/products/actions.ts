"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validators/product";
import { createClient } from "@/lib/supabase/server";

export async function createProductAction(formData: FormData) {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory") || undefined,
    description: formData.get("description"),
    rawMaterials: formData.get("rawMaterials") || undefined,
    manufacturingProcess: formData.get("manufacturingProcess") || undefined,
    origin: formData.get("origin") || undefined,
    usage: formData.get("usage") || undefined,
    dimensions: formData.get("dimensions") || undefined,
    weight: formData.get("weight") || undefined,
    localName: formData.get("localName") || undefined,
    brandName: formData.get("brandName") || undefined,
    productCode: formData.get("productCode") || undefined,
    batchNumber: formData.get("batchNumber") || undefined,
    annualProductionVolume: formData.get("annualProductionVolume") || undefined,
    unitPrice: formData.get("unitPrice") || undefined,
    currency: formData.get("currency") || undefined,
    targetMarket: formData.get("targetMarket") || undefined,
    packagingDescription: formData.get("packagingDescription") || undefined,
    shelfLife: formData.get("shelfLife") || undefined,
    qualityStandardClaimed: formData.get("qualityStandardClaimed") || undefined,
    environmentalImpact: formData.get("environmentalImpact") || undefined,
    safetyInformation: formData.get("safetyInformation") || undefined,
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path?.[0] ? `${String(issue.path[0])}: ` : "";
    throw new Error(`${field}${issue?.message ?? "Produit invalide."}`);
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Non authentifie.");

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      artisan_id: userData.user.id,
      name: parsed.data.name,
      category: parsed.data.category,
      subcategory: parsed.data.subcategory,
      description: parsed.data.description,
      raw_materials: parsed.data.rawMaterials,
      manufacturing_process: parsed.data.manufacturingProcess,
      origin: parsed.data.origin,
      usage: parsed.data.usage,
      dimensions: parsed.data.dimensions,
      weight: parsed.data.weight,
      local_name: parsed.data.localName,
      brand_name: parsed.data.brandName,
      product_code: parsed.data.productCode,
      batch_number: parsed.data.batchNumber,
      annual_production_volume: parsed.data.annualProductionVolume,
      unit_price: parsed.data.unitPrice,
      currency: parsed.data.currency,
      target_market: parsed.data.targetMarket,
      packaging_description: parsed.data.packagingDescription,
      shelf_life: parsed.data.shelfLife,
      quality_standard_claimed: parsed.data.qualityStandardClaimed,
      environmental_impact: parsed.data.environmentalImpact,
      safety_information: parsed.data.safetyInformation,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("certification_requests").insert({
    product_id: product.id,
    artisan_id: userData.user.id,
    status: "draft",
  });

  revalidatePath("/artisan/products");
  revalidatePath("/artisan/requests");
  redirect("/artisan/products");
}

export async function submitCertificationRequestAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) throw new Error("Produit manquant.");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Non authentifie.");

  const { data: request } = await supabase
    .from("certification_requests")
    .select("id,status")
    .eq("product_id", productId)
    .eq("artisan_id", userData.user.id)
    .single();

  if (!request) throw new Error("Demande introuvable.");
  if (request.status !== "draft") throw new Error("Cette demande est deja soumise ou en traitement.");

  const { count } = await supabase.from("certification_requests").select("*", { count: "exact", head: true });
  const requestNumber = `REQ-RDC-${new Date().getFullYear()}-${String((count ?? 0) + 1).padStart(6, "0")}`;

  await supabase
    .from("products")
    .update({ submission_state: "submitted" })
    .eq("id", productId)
    .eq("artisan_id", userData.user.id);

  await supabase
    .from("certification_requests")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      request_number: requestNumber,
    })
    .eq("id", request.id);

  await supabase.from("request_status_history").insert({
    request_id: request.id,
    from_status: "draft",
    to_status: "submitted",
    changed_by: userData.user.id,
    comment: "Demande soumise par l artisan",
  });

  revalidatePath("/artisan/products");
  revalidatePath("/artisan/requests");
}
