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
  const rows = await readRecords<{ id: string; mission_number: string | null; scheduled_at: string; location: string | null; status: string }>(
    "inspection_missions",
    "id,mission_number,scheduled_at,location,status",
    (q) => q.order("scheduled_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="admin" title="Inspections" description="Affectation des inspecteurs, planification et rapports terrain.">
      <div className="grid gap-4">
        {rows.length ? rows.map((row) => (
          <Card key={row.id} className="shadow-none">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-stone-950">{row.mission_number ?? row.id}</h2>
                    <StatusBadge status={row.status === "done" ? "field_inspection_done" : "field_inspection_scheduled"} />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{row.location ?? "Lieu non renseigne"}</p>
                  <p className="mt-2 text-xs text-stone-500">{new Date(row.scheduled_at).toLocaleDateString("fr-FR")}</p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/admin/inspections/${row.id}`}><ExternalLink size={16} /> Lire le dossier</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card><CardContent className="p-5 text-sm text-stone-500">Aucune mission terrain.</CardContent></Card>
        )}
      </div>
    </SimpleRolePage>
  );
}
