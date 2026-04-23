import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SimpleRolePage } from "@/components/simple-role-page";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  await requireProfile(["admin"]);
  const rows = await readRecords<{ id: string; test_type: string; status: string; sample_reference: string | null; is_compliant: boolean | null }>(
    "lab_tests",
    "id,test_type,status,sample_reference,is_compliant",
    (q) => q.order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="admin" title="Laboratoire" description="Affectation des analyses, resultats, rapports et recommandations labo.">
      <div className="grid gap-4">
        {rows.length ? rows.map((row) => (
          <Card key={row.id} className="shadow-none">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-stone-950">{row.test_type}</h2>
                    <StatusBadge status={row.status === "done" ? "lab_testing_done" : "lab_testing_scheduled"} />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{row.sample_reference ?? "Echantillon non reference"}</p>
                  <p className="mt-2 text-xs text-stone-500">{row.is_compliant === null ? "Conformite non saisie" : row.is_compliant ? "Conforme" : "Non conforme"}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/admin/lab/${row.id}`}><ExternalLink size={16} /> Lire le dossier</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card><CardContent className="p-5 text-sm text-stone-500">Aucun test laboratoire.</CardContent></Card>
        )}
      </div>
    </SimpleRolePage>
  );
}
