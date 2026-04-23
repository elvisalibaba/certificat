import { SimpleRolePage } from "@/components/simple-role-page";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { readRecords } from "@/lib/data/records";

export default async function Page() {
  await requireProfile(["admin"]);
  const rows = await readRecords<{
    id: string;
    full_name: string | null;
    email: string;
    phone: string | null;
    is_active: boolean;
    artisan_profiles: {
      public_display_name: string | null;
      national_id: string | null;
      province: string | null;
      city: string | null;
      craft_specialty: string | null;
      craft_card_number: string | null;
      cooperative_name: string | null;
    }[] | {
      public_display_name: string | null;
      national_id: string | null;
      province: string | null;
      city: string | null;
      craft_specialty: string | null;
      craft_card_number: string | null;
      cooperative_name: string | null;
    } | null;
  }>(
    "profiles",
    "id,full_name,email,phone,is_active,artisan_profiles(public_display_name,national_id,province,city,craft_specialty,craft_card_number,cooperative_name)",
    (q) => q.eq("role", "artisan").order("created_at", { ascending: false }).limit(50),
  );
  return (
    <SimpleRolePage role="admin" title="Gestion artisans" description="Comptes utilisateurs, profils artisanaux, activation et roles.">
      <div className="grid gap-4">
        {rows.length ? rows.map((row) => {
          const artisan = Array.isArray(row.artisan_profiles) ? row.artisan_profiles[0] : row.artisan_profiles;
          return (
            <Card key={row.id} className="shadow-none">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-stone-950">{row.full_name ?? artisan?.public_display_name ?? row.email}</h2>
                      <StatusBadge status={row.is_active ? "certified" : "suspended"} />
                    </div>
                    <p className="mt-2 text-sm text-stone-600">{row.email} · {row.phone ?? "Telephone non renseigne"}</p>
                    <div className="mt-4 grid gap-2 text-xs text-stone-600 md:grid-cols-4">
                      <span className="rounded-md bg-stone-50 p-3">Nom public: <strong>{artisan?.public_display_name ?? "Non renseigne"}</strong></span>
                      <span className="rounded-md bg-stone-50 p-3">Piece: <strong>{artisan?.national_id ?? "Non renseignee"}</strong></span>
                      <span className="rounded-md bg-stone-50 p-3">Carte artisan: <strong>{artisan?.craft_card_number ?? "Non renseignee"}</strong></span>
                      <span className="rounded-md bg-stone-50 p-3">Province: <strong>{artisan?.province ?? artisan?.city ?? "Non renseignee"}</strong></span>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-stone-600 md:grid-cols-2">
                      <span className="rounded-md bg-white p-3 ring-1 ring-stone-200">Specialite: <strong>{artisan?.craft_specialty ?? "Non renseignee"}</strong></span>
                      <span className="rounded-md bg-white p-3 ring-1 ring-stone-200">Cooperative: <strong>{artisan?.cooperative_name ?? "Aucune"}</strong></span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        }) : (
          <Card><CardContent className="p-5 text-sm text-stone-500">Aucun artisan trouve.</CardContent></Card>
        )}
      </div>
    </SimpleRolePage>
  );
}
