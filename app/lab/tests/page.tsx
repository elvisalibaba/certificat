import { SimpleRolePage } from "@/components/simple-role-page";
import { RecordList } from "@/components/record-list";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  const profile = await requireProfile(["lab_agent"]);
  const rows = await readRecords<{ id: string; test_type: string; status: string; sample_reference: string | null; is_compliant: boolean | null }>(
    "lab_tests",
    "id,test_type,status,sample_reference,is_compliant",
    (q) => q.eq("lab_agent_id", profile.id).order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="lab" title="Tests laboratoire" description="Saisie des types de test, valeurs mesurees, conformite et pieces jointes.">
      <RecordList title="Mes tests" items={rows.map((row) => ({
        id: row.id,
        title: row.test_type,
        subtitle: row.sample_reference ?? "Echantillon non reference",
        meta: row.is_compliant === null ? "Conformite non saisie" : row.is_compliant ? "Conforme" : "Non conforme",
        status: row.status === "done" ? "lab_testing_done" : "lab_testing_scheduled",
      }))} />
    </SimpleRolePage>
  );
}
