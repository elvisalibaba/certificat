import { SimpleRolePage } from "@/components/simple-role-page";
import { RecordList } from "@/components/record-list";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  await requireProfile(["admin"]);
  const rows = await readRecords<{ id: string; name: string; category: string; submission_state: string; origin: string | null }>(
    "products",
    "id,name,category,submission_state,origin",
    (q) => q.order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="admin" title="Produits" description="Vue globale des produits soumis, medias et documents techniques.">
      <RecordList title="Produits Supabase" items={rows.map((row) => ({
        id: row.id,
        title: row.name,
        subtitle: row.category,
        meta: row.origin ?? undefined,
        status: row.submission_state === "submitted" ? "submitted" : "draft",
      }))} />
    </SimpleRolePage>
  );
}
