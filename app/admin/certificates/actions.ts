"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCertificateNumber, createCertificatePdf } from "@/lib/certificates/generate";

export async function generateCertificateAction(requestId: string) {
  const supabase = createAdminClient();
  const { data: request } = await supabase
    .from("certification_requests")
    .select("id, status, artisan_id, product_id, request_number, products(name, category, workshop_id, product_code, origin)")
    .eq("id", requestId)
    .single();

  if (!request || request.status !== "payment_confirmed") {
    return { error: "Le certificat exige un paiement confirme." };
  }

  const publicCode = randomUUID();
  const { count } = await supabase.from("certificates").select("*", { count: "exact", head: true });
  const certificateNumber = createCertificateNumber((count ?? 0) + 1);
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/verify/${publicCode}`;
  const product = Array.isArray(request.products) ? request.products[0] : request.products;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 24);

  const [{ data: profile }, { data: artisanProfile }, { data: workshop }] = await Promise.all([
    supabase.from("profiles").select("full_name,email").eq("id", request.artisan_id).single(),
    supabase
      .from("artisan_profiles")
      .select("public_display_name,craft_card_number,province,city")
      .eq("user_id", request.artisan_id)
      .maybeSingle(),
    product?.workshop_id
      ? supabase.from("workshops").select("name,province,city").eq("id", product.workshop_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const producerName =
    artisanProfile?.public_display_name ??
    workshop?.name ??
    profile?.full_name ??
    profile?.email ??
    "Producteur certifie";

  const pdf = await createCertificatePdf({
    certificateNumber,
    productName: product?.name ?? "Produit certifie",
    category: product?.category ?? "Artisanat",
    producerName,
    workshopName: workshop?.name,
    artisanIdentifier: artisanProfile?.craft_card_number,
    requestNumber: request.request_number,
    productCode: product?.product_code,
    origin: product?.origin,
    province: workshop?.province ?? artisanProfile?.province ?? workshop?.city ?? artisanProfile?.city,
    issuingAuthority: "Ministere des PME et Artisanat",
    signedByName: "Directeur de la Certification Artisanale",
    signedByTitle: "Agence Nationale de Certification Artisanale",
    legalBasis: "Certificat emis pour la Republique Democratique du Congo apres validation du dossier, controles techniques et paiement officiel.",
    verificationUrl,
    issuedAt: new Date(),
    expiresAt,
  });

  const certificateId = randomUUID();
  const pdfPath = `certificates/${certificateId}/${certificateNumber}.pdf`;
  await supabase.storage.from("certificates").upload(pdfPath, pdf, {
    contentType: "application/pdf",
    upsert: true,
  });

  await supabase.from("certificates").insert({
    id: certificateId,
    request_id: request.id,
    product_id: request.product_id,
    artisan_id: request.artisan_id,
    certificate_number: certificateNumber,
    public_code: publicCode,
    pdf_path: pdfPath,
    expires_at: expiresAt.toISOString(),
    issuing_authority: "Ministere des PME et Artisanat",
    signed_by_name: "Directeur de la Certification Artisanale",
    signed_by_title: "Agence Nationale de Certification Artisanale",
    legal_basis: "Certificat emis pour la Republique Democratique du Congo apres validation du dossier, controles techniques et paiement officiel.",
  });

  await supabase.from("qr_records").insert({
    certificate_id: certificateId,
    public_code: publicCode,
    verification_url: verificationUrl,
  });

  await supabase.from("certification_requests").update({ status: "certified" }).eq("id", request.id);
  await supabase.from("request_status_history").insert({
    request_id: request.id,
    from_status: "payment_confirmed",
    to_status: "certified",
    comment: "Certificat genere",
  });

  revalidatePath("/admin/certificates");
  return { certificateNumber };
}
