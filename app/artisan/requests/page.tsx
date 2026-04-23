import { SimpleRolePage } from "@/components/simple-role-page";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";
import type { RequestStatus } from "@/lib/constants";

export default async function Page() {
  const profile = await requireProfile(["artisan"]);
  const rows = await readRecords<{
    id: string;
    request_number: string | null;
    status: RequestStatus;
    priority: string;
    risk_level: string;
    submitted_at: string | null;
    admin_comment: string | null;
    products: { name: string; category: string; origin: string | null } | null;
  }>(
    "certification_requests",
    "id,request_number,status,priority,risk_level,submitted_at,admin_comment,products(name,category,origin)",
    (q) => q.eq("artisan_id", profile.id).order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="artisan" title="Demandes" description="Checklist documentaire, timeline et commentaires administratifs.">
      <div className="grid gap-4">
        {rows.length ? rows.map((row) => (
          <Card key={row.id} className="shadow-none">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-stone-950">{row.request_number ?? "Demande brouillon"}</h2>
                    <StatusBadge status={row.status} />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{row.products?.name ?? "Produit non renseigne"} · {row.products?.category ?? "Categorie non renseignee"}</p>
                  <div className="mt-4 grid gap-2 text-xs text-stone-600 md:grid-cols-4">
                    <span className="rounded-md bg-stone-50 p-3">Priorite: <strong>{row.priority}</strong></span>
                    <span className="rounded-md bg-stone-50 p-3">Risque: <strong>{row.risk_level}</strong></span>
                    <span className="rounded-md bg-stone-50 p-3">Origine: <strong>{row.products?.origin ?? "Non renseignee"}</strong></span>
                    <span className="rounded-md bg-stone-50 p-3">Soumis: <strong>{row.submitted_at ? new Date(row.submitted_at).toLocaleDateString("fr-FR") : "Non"}</strong></span>
                  </div>
                  {row.admin_comment ? <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{row.admin_comment}</p> : null}
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card><CardContent className="p-5 text-sm text-stone-500">Aucune demande. Soumets un produit depuis la page Produits.</CardContent></Card>
        )}
      </div>
    </SimpleRolePage>
  );
}
