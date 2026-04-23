import { AppShell } from "@/components/app-shell";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { getInspectorDashboardData } from "@/lib/data/dashboard";

const nav = [
  { href: "/inspector/dashboard", label: "Tableau de bord" },
  { href: "/inspector/missions", label: "Missions" },
];

export default async function Page() {
  const profile = await requireProfile(["inspector"]);
  const data = await getInspectorDashboardData(profile.id);

  return (
    <AppShell title="Dashboard inspecteur" nav={nav}>
      <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg bg-[#071f18] p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f7d618]">Inspection terrain RDC</p>
          <h2 className="mt-3 text-2xl font-bold">Missions, constats et recommandations</h2>
          <p className="mt-3 text-sm leading-6 text-white/70">Les visites terrain alimentent le dossier administratif avant decision ou analyse laboratoire.</p>
        </div>
        <Card className="shadow-none">
          <CardHeader><CardTitle>Cadre de visite</CardTitle></CardHeader>
          <CardContent className="grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
            <span className="rounded-md bg-stone-50 p-3">Hygiene</span>
            <span className="rounded-md bg-stone-50 p-3">Tracabilite</span>
            <span className="rounded-md bg-stone-50 p-3">Production</span>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard label="Missions assignees" value={data.missions} tone="emerald" />
        <KpiCard label="Visites terminees" value={data.done} tone="ink" />
        <KpiCard label="A venir" value={data.upcoming.length} tone="amber" />
      </div>
      <Card className="mt-6">
        <CardHeader><CardTitle>Prochaines missions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {data.upcoming.length ? data.upcoming.map((mission) => (
            <div key={mission.id} className="rounded-md border border-stone-200 p-3">
              <p className="text-sm font-semibold text-stone-950">{mission.mission_number ?? mission.id}</p>
              <p className="text-xs text-stone-500">{mission.location ?? "Lieu non renseigne"} - {new Date(mission.scheduled_at).toLocaleDateString("fr-FR")}</p>
            </div>
          )) : <p className="text-sm text-stone-500">Aucune mission assignee.</p>}
        </CardContent>
      </Card>
    </AppShell>
  );
}
