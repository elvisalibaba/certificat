import { SimpleRolePage } from "@/components/simple-role-page";
import { RecordList } from "@/components/record-list";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  await requireProfile(["admin"]);
  const rows = await readRecords<{ id: string; certificate_number: string; status: string; issued_at: string; issuing_authority: string | null }>(
    "certificates",
    "id,certificate_number,status,issued_at,issuing_authority",
    (q) => q.order("issued_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="admin" title="Certificats" description="Generation PDF, QR codes, suspension, revocation et expiration.">
      <RecordList title="Certificats emis" items={rows.map((row) => ({
        id: row.id,
        title: row.certificate_number,
        subtitle: row.issuing_authority ?? "Ministere des PME",
        meta: new Date(row.issued_at).toLocaleDateString("fr-FR"),
        status: row.status === "valid" ? "certified" : row.status,
      }))} />
    </SimpleRolePage>
  );
}
