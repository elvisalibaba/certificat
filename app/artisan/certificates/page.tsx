import { SimpleRolePage } from "@/components/simple-role-page";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  const profile = await requireProfile(["artisan"]);
  const rows = await readRecords<{
    id: string;
    certificate_number: string;
    status: string;
    issued_at: string;
    expires_at: string | null;
    public_code: string;
    pdf_path: string | null;
    products: { name: string; category: string } | null;
  }>(
    "certificates",
    "id,certificate_number,status,issued_at,expires_at,public_code,pdf_path,products(name,category)",
    (q) => q.eq("artisan_id", profile.id).order("issued_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="artisan" title="Certificats" description="Telechargement PDF et QR codes des produits certifies.">
      <div className="grid gap-4">
        {rows.length ? rows.map((row) => (
          <Card key={row.id} className="shadow-none">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-stone-950">{row.certificate_number}</h2>
                    <StatusBadge status={row.status === "valid" ? "certified" : row.status} />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{row.products?.name ?? "Produit certifie"} · {row.products?.category ?? "Artisanat"}</p>
                  <div className="mt-4 grid gap-2 text-xs text-stone-600 md:grid-cols-3">
                    <span className="rounded-md bg-stone-50 p-3">Emission: <strong>{new Date(row.issued_at).toLocaleDateString("fr-FR")}</strong></span>
                    <span className="rounded-md bg-stone-50 p-3">Expiration: <strong>{row.expires_at ? new Date(row.expires_at).toLocaleDateString("fr-FR") : "Non applicable"}</strong></span>
                    <span className="rounded-md bg-stone-50 p-3">PDF: <strong>{row.pdf_path ? "Genere" : "Non genere"}</strong></span>
                  </div>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/verify/${row.public_code}`}><ExternalLink size={16} /> Verifier</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card><CardContent className="p-5 text-sm text-stone-500">Aucun certificat emis. Le certificat apparait ici apres paiement confirme et generation admin.</CardContent></Card>
        )}
      </div>
    </SimpleRolePage>
  );
}
