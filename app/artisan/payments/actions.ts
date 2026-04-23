"use server";

import { revalidatePath } from "next/cache";
import { DEFAULT_CERTIFICATION_FEE } from "@/lib/constants";
import { canPay } from "@/lib/workflow";
import { getPaymentProvider } from "@/lib/payments/provider";
import { createClient } from "@/lib/supabase/server";

export async function createPaymentAction(requestId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: "Non authentifie." };

  const { data: request } = await supabase
    .from("certification_requests")
    .select("id, artisan_id, status")
    .eq("id", requestId)
    .single();

  if (!request || request.artisan_id !== userData.user.id) return { error: "Dossier inaccessible." };
  if (!canPay(request.status)) return { error: "Paiement non autorise pour ce statut." };

  const provider = getPaymentProvider();
  const intent = await provider.createIntent({
    requestId,
    artisanId: userData.user.id,
    amount: DEFAULT_CERTIFICATION_FEE.amount,
    currency: DEFAULT_CERTIFICATION_FEE.currency,
  });

  await supabase.from("payment_transactions").insert({
    request_id: requestId,
    artisan_id: userData.user.id,
    provider: provider.name,
    provider_reference: intent.reference,
    status: "pending",
    amount: DEFAULT_CERTIFICATION_FEE.amount,
    currency: DEFAULT_CERTIFICATION_FEE.currency,
    raw_response: intent.raw,
  });

  await supabase.from("certification_requests").update({ status: "payment_pending" }).eq("id", requestId);
  await supabase.from("request_status_history").insert({
    request_id: requestId,
    from_status: "approved_for_payment",
    to_status: "payment_pending",
    changed_by: userData.user.id,
    comment: "Paiement initialise",
  });

  revalidatePath("/artisan/payments");
  return { checkoutUrl: intent.checkoutUrl };
}
