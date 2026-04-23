import { SimpleRolePage } from "@/components/simple-role-page";
import { RecordList } from "@/components/record-list";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";
import type { RequestStatus } from "@/lib/constants";

export default async function Page() {
  await requireProfile(["admin"]);
  const rows = await readRecords<{ id: string; request_number: string | null; status: RequestStatus; priority: string; risk_level: string }>(
    "certification_requests",
    "id,request_number,status,priority,risk_level",
    (q) => q.order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="admin" title="Demandes de certification" description="Verification documentaire, pieces complementaires, decisions et historique.">
      <RecordList title="Dossiers de certification" items={rows.map((row) => ({
        id: row.id,
        title: row.request_number ?? row.id,
        subtitle: `Priorite ${row.priority} - Risque ${row.risk_level}`,
        status: row.status,
      }))} />
    </SimpleRolePage>
  );
}
