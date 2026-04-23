import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { getLabDashboardData } from "@/lib/data/dashboard";

const nav = [
  { href: "/lab/dashboard", label: "Tableau de bord" },
  { href: "/lab/tests", label: "Tests" },
];

export default async function Page() {
  const profile = await requireProfile(["lab_agent"]);
  const data = await getLabDashboardData(profile.id);

  return (
    <AppShell title="Dashboard laboratoire" nav={nav}>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007a3d]">Laboratoire national</p>
          <h2 className="mt-3 text-2xl font-bold text-stone-950">Controle qualite des echantillons artisanaux</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">Affectation, analyse, validation et archivage des resultats techniques pour la certification RDC.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {["Reception", "Analyse", "Validation"].map((step) => (
            <div key={step} className="rounded-lg border border-stone-200 bg-stone-950 p-4 text-white">
              <p className="text-sm font-semibold">{step}</p>
              <p className="mt-2 text-xs text-white/60">Trace dossier</p>
            </div>
          ))}
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Tests a traiter" value={data.assigned} tone="red" />
        <KpiCard label="Tests termines" value={data.done} tone="emerald" />
        <KpiCard label="Dossiers recents" value={data.tests.length} tone="amber" />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Analyses recentes</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.tests.length ? data.tests.map((test) => (
            <div key={test.id} className="rounded-md border border-stone-200 p-3">
              <p className="text-sm font-semibold text-stone-950">{test.test_type}</p>
              <p className="text-xs text-stone-500">{test.products?.name ?? test.sample_reference ?? "Produit non renseigne"} - {test.status}</p>
            </div>
          )) : <p className="text-sm text-stone-500">Aucun test affecte.</p>}
        </CardContent>
      </Card>
    </AppShell>
  );
}
