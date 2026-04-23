import { SimpleRolePage } from "@/components/simple-role-page";
import { MobileMoneySimulator } from "@/components/mobile-money-simulator";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  const profile = await requireProfile(["artisan"]);
  const rows = await readRecords<{
    id: string;
    provider: string;
    provider_reference: string | null;
    status: string;
    amount: number;
    currency: string;
    method: string | null;
    created_at: string;
    certification_requests: { request_number: string | null; products: { name: string } | null } | null;
  }>(
    "payment_transactions",
    "id,provider,provider_reference,status,amount,currency,method,created_at,certification_requests(request_number,products(name))",
    (q) => q.eq("artisan_id", profile.id).order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="artisan" title="Paiements" description="Paiements disponibles uniquement apres autorisation administrative.">
      <MobileMoneySimulator />
      <div className="grid gap-4">
        {rows.length ? rows.map((row) => (
          <Card key={row.id} className="shadow-none">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-stone-950">{row.amount} {row.currency}</h2>
                    <StatusBadge status={row.status === "confirmed" ? "payment_confirmed" : "payment_pending"} />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{row.certification_requests?.products?.name ?? "Produit"} · {row.certification_requests?.request_number ?? "Dossier"}</p>
                  <div className="mt-4 grid gap-2 text-xs text-stone-600 md:grid-cols-4">
                    <span className="rounded-md bg-stone-50 p-3">Provider: <strong>{row.provider}</strong></span>
                    <span className="rounded-md bg-stone-50 p-3">Reference: <strong>{row.provider_reference ?? "Sans reference"}</strong></span>
                    <span className="rounded-md bg-stone-50 p-3">Methode: <strong>{row.method ?? "Mobile Money"}</strong></span>
                    <span className="rounded-md bg-stone-50 p-3">Date: <strong>{new Date(row.created_at).toLocaleDateString("fr-FR")}</strong></span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card><CardContent className="p-5 text-sm text-stone-500">Aucun paiement pour le moment. Les paiements apparaissent apres autorisation administrative.</CardContent></Card>
        )}
      </div>
    </SimpleRolePage>
  );
}
