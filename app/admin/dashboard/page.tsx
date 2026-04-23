import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { getAdminDashboardData } from "@/lib/data/dashboard";

const nav = [
  { href: "/admin/dashboard", label: "Tableau de bord" },
  { href: "/admin/artisans", label: "Artisans" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/requests", label: "Demandes" },
  { href: "/admin/inspections", label: "Inspections" },
  { href: "/admin/lab", label: "Laboratoire" },
  { href: "/admin/payments", label: "Paiements" },
  { href: "/admin/certificates", label: "Certificats" },
  { href: "/admin/settings", label: "Parametres" },
];

export default async function AdminDashboard() {
  await requireProfile(["admin"]);
  const data = await getAdminDashboardData();

  return (
    <AppShell title="Administration" nav={nav}>
      <section className="mb-6 grid gap-4 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-lg bg-[#071f18] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f7d618]">Centre national de pilotage</p>
          <h2 className="mt-3 text-2xl font-bold">Vue consolidee des certifications artisanales RDC</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
            Suivi temps reel des demandes, inspections, analyses laboratoire, paiements et certificats publics. Les dossiers sensibles restent gouvernes par les roles Supabase.
          </p>
        </div>
        <Card className="shadow-none">
          <CardHeader><CardTitle>Priorites du jour</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-stone-600">Dossiers a arbitrer</span><strong>{data.pendingRequests}</strong></div>
            <div className="flex justify-between"><span className="text-stone-600">Paiements a rapprocher</span><strong>{data.pendingPayments}</strong></div>
            <div className="flex justify-between"><span className="text-stone-600">Inspections planifiees</span><strong>{data.upcomingInspections}</strong></div>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Artisans" value={data.artisans} detail="Comptes actifs" tone="emerald" trend="RDC" />
        <KpiCard label="Produits soumis" value={data.submittedProducts} tone="amber" />
        <KpiCard label="Dossiers en attente" value={data.pendingRequests} tone="red" />
        <KpiCard label="Certificats emis" value={data.issuedCertificates} tone="ink" />
        <KpiCard label="Inspections a venir" value={data.upcomingInspections} tone="amber" />
        <KpiCard label="Paiements en attente" value={data.pendingPayments} tone="red" />
        <KpiCard label="Suspendus" value={data.suspendedCertificates} tone="amber" />
        <KpiCard label="Revoques/expires" value={data.revokedCertificates + data.expiredCertificates} tone="red" />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Dossiers recents</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {data.recentRequests.length ? data.recentRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between rounded-md border border-stone-200 p-3">
                <div>
                  <p className="text-sm font-semibold text-stone-950">{request.products?.name ?? request.request_number ?? "Dossier"}</p>
                  <p className="text-xs text-stone-500">{request.products?.category ?? "Categorie non renseignee"}</p>
                </div>
                <StatusBadge status={request.status} />
              </div>
            )) : <p className="text-sm text-stone-500">Aucun dossier trouve dans Supabase.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Flux des dossiers</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                ["Revue", `${Math.min(100, data.pendingRequests * 10)}%`],
                ["Inspection", `${Math.min(100, data.upcomingInspections * 12)}%`],
                ["Paiement", `${Math.min(100, data.pendingPayments * 12)}%`],
                ["Certificats", `${Math.min(100, data.issuedCertificates * 3)}%`],
              ].map(([label, width]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-xs text-stone-600"><span>{label}</span><span>{width}</span></div>
                  <div className="h-2 rounded-full bg-stone-100"><div className="h-2 rounded-full bg-emerald-800" style={{ width }} /></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
