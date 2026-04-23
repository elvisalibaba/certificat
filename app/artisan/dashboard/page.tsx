import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { getArtisanDashboardData } from "@/lib/data/dashboard";

const nav = [
  { href: "/artisan/dashboard", label: "Tableau de bord" },
  { href: "/artisan/profile", label: "Profil" },
  { href: "/artisan/workshop", label: "Atelier" },
  { href: "/artisan/products", label: "Produits" },
  { href: "/artisan/requests", label: "Demandes" },
  { href: "/artisan/payments", label: "Paiements" },
  { href: "/artisan/certificates", label: "Certificats" },
];

export default async function ArtisanDashboard() {
  const profile = await requireProfile(["artisan"]);
  const data = await getArtisanDashboardData(profile.id);

  return (
    <AppShell title="Espace artisan" nav={nav}>
      <section className="mb-6 rounded-lg border border-stone-200 bg-white p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007a3d]">Parcours de certification RDC</p>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {["Produit", "Dossier", "Controle", "Certificat"].map((step, index) => (
            <div key={step} className="rounded-md border border-stone-200 bg-stone-50 p-4">
              <span className="text-xs font-bold text-stone-500">Etape {index + 1}</span>
              <p className="mt-2 font-semibold text-stone-950">{step}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Produits" value={data.products} detail="Enregistres dans Supabase" tone="emerald" />
        <KpiCard label="Demandes actives" value={data.activeRequests} tone="amber" />
        <KpiCard label="Paiements autorises" value={data.paymentReady} tone="red" />
        <KpiCard label="Certificats" value={data.certificates} tone="ink" />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Dernieres demandes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.recentRequests.length ? data.recentRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between rounded-md border border-stone-200 p-3">
              <div>
                <p className="text-sm font-semibold text-stone-950">{request.products?.name ?? request.request_number ?? "Dossier"}</p>
                <p className="text-xs text-stone-500">{request.products?.category ?? "Categorie non renseignee"}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>
          )) : <p className="text-sm text-stone-500">Aucune demande pour ce compte artisan.</p>}
        </CardContent>
      </Card>
    </AppShell>
  );
}
