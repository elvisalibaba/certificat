import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPaymentProvider } from "@/lib/payments/provider";

export async function POST(request: Request) {
  const body = await request.json();
  const reference = String(body.reference ?? "");
  if (!reference) return NextResponse.json({ error: "reference missing" }, { status: 400 });

  const provider = getPaymentProvider();
  const verified = await provider.verify(reference);
  const supabase = createAdminClient();

  const { data: tx } = await supabase
    .from("payment_transactions")
    .select("id, request_id")
    .eq("provider_reference", reference)
    .single();

  if (!tx) return NextResponse.json({ error: "transaction not found" }, { status: 404 });

  if (verified.status === "confirmed") {
    await supabase.from("payment_transactions").update({
      status: "confirmed",
      paid_at: new Date().toISOString(),
      raw_response: verified.raw,
    }).eq("id", tx.id);

    await supabase.from("certification_requests").update({ status: "payment_confirmed" }).eq("id", tx.request_id);
    await supabase.from("request_status_history").insert({
      request_id: tx.request_id,
      from_status: "payment_pending",
      to_status: "payment_confirmed",
      comment: "Paiement confirme par provider",
    });
  }

  return NextResponse.json({ ok: true });
}
