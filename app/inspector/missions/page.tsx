import { SimpleRolePage } from "@/components/simple-role-page";
import { RecordList } from "@/components/record-list";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  const profile = await requireProfile(["inspector"]);
  const rows = await readRecords<{ id: string; mission_number: string | null; scheduled_at: string; location: string | null; status: string }>(
    "inspection_missions",
    "id,mission_number,scheduled_at,location,status",
    (q) => q.eq("inspector_id", profile.id).order("scheduled_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="inspector" title="Missions terrain" description="Consultation des dossiers a inspecter, observations, photos et recommandations.">
      <RecordList title="Mes missions" items={rows.map((row) => ({
        id: row.id,
        title: row.mission_number ?? row.id,
        subtitle: row.location ?? "Lieu non renseigne",
        meta: new Date(row.scheduled_at).toLocaleDateString("fr-FR"),
        status: row.status === "done" ? "field_inspection_done" : "field_inspection_scheduled",
      }))} />
    </SimpleRolePage>
  );
}
