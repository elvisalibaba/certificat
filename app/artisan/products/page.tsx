import Link from "next/link";
import { Plus } from "lucide-react";
import { SimpleRolePage } from "@/components/simple-role-page";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";
import { submitCertificationRequestAction } from "@/app/artisan/products/actions";
import type { RequestStatus } from "@/lib/constants";

export default async function Page() {
  const profile = await requireProfile(["artisan"]);
  const rows = await readRecords<{
    id: string;
    name: string;
    category: string;
    submission_state: string;
    origin: string | null;
    product_code: string | null;
    created_at: string;
    certification_requests: { id: string; status: RequestStatus; request_number: string | null }[] | { id: string; status: RequestStatus; request_number: string | null } | null;
  }>(
    "products",
    "id,name,category,submission_state,origin,product_code,created_at,certification_requests(id,status,request_number)",
    (q) => q.eq("artisan_id", profile.id).order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="artisan" title="Produits" description="Liste des produits, brouillons et dossiers relies.">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/artisan/products/new"><Plus size={17} /> Nouveau produit</Link>
        </Button>
      </div>
      <div className="grid gap-4">
        {rows.length ? rows.map((row) => {
          const request = Array.isArray(row.certification_requests) ? row.certification_requests[0] : row.certification_requests;
          return (
            <Card key={row.id} className="shadow-none">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-stone-950">{row.name}</h2>
                      <StatusBadge status={request?.status ?? (row.submission_state === "submitted" ? "submitted" : "draft")} />
                    </div>
                    <p className="mt-2 text-sm text-stone-600">{row.category} · {row.origin ?? "Origine non renseignee"}</p>
                    <div className="mt-4 grid gap-2 text-xs text-stone-600 sm:grid-cols-3">
                      <span className="rounded-md bg-stone-50 p-3">Code: <strong>{row.product_code ?? "Non attribue"}</strong></span>
                      <span className="rounded-md bg-stone-50 p-3">Dossier: <strong>{request?.request_number ?? "Brouillon"}</strong></span>
                      <span className="rounded-md bg-stone-50 p-3">Cree le: <strong>{new Date(row.created_at).toLocaleDateString("fr-FR")}</strong></span>
                    </div>
                  </div>
                  {request?.status === "draft" ? (
                    <form action={submitCertificationRequestAction}>
                      <input type="hidden" name="productId" value={row.id} />
                      <Button type="submit">Faire la demande</Button>
                    </form>
                  ) : (
                    <Button asChild variant="outline"><Link href="/artisan/requests">Voir la demande</Link></Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <Card><CardContent className="p-5 text-sm text-stone-500">Aucun produit. Cree un produit pour commencer une demande de certification.</CardContent></Card>
        )}
      </div>
    </SimpleRolePage>
  );
}
