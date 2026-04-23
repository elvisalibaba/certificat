import { SimpleRolePage } from "@/components/simple-role-page";
import { RecordList } from "@/components/record-list";
import { MobileMoneySimulator } from "@/components/mobile-money-simulator";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  await requireProfile(["admin"]);
  const rows = await readRecords<{ id: string; provider: string; provider_reference: string | null; status: string; amount: number; currency: string }>(
    "payment_transactions",
    "id,provider,provider_reference,status,amount,currency",
    (q) => q.order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="admin" title="Paiements" description="Transactions, references provider, statuts et rapprochement.">
      <MobileMoneySimulator />
      <RecordList title="Transactions" items={rows.map((row) => ({
        id: row.id,
        title: `${row.amount} ${row.currency}`,
        subtitle: `${row.provider} - ${row.provider_reference ?? "Sans reference"}`,
        status: row.status === "confirmed" ? "payment_confirmed" : "payment_pending",
      }))} />
    </SimpleRolePage>
  );
}
