import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { requireProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

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

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  await requireProfile(["admin"]);
  const { id } = await params;
  const supabase = await createClient();

  const { data: mission } = await supabase
    .from("inspection_missions")
    .select("id,request_id,inspector_id,mission_number,scheduled_at,location,status,visit_type,expected_duration_minutes,safety_notes")
    .eq("id", id)
    .maybeSingle();

  if (!mission) {
    return (
      <AppShell title="Lecture inspection admin" nav={nav}>
        <Card><CardContent className="p-5 text-sm text-stone-500">Mission introuvable.</CardContent></Card>
      </AppShell>
    );
  }

  const [{ data: inspector }, { data: request }, { data: report }] = await Promise.all([
    supabase.from("profiles").select("full_name,email,phone").eq("id", mission.inspector_id).maybeSingle(),
    supabase.from("certification_requests").select("id,request_number,status,product_id,artisan_id").eq("id", mission.request_id).maybeSingle(),
    supabase.from("inspection_reports").select("observations,recommendation,hygiene_score,traceability_score,production_score,corrective_actions,next_visit_recommended,submitted_at").eq("mission_id", mission.id).maybeSingle(),
  ]);

  const [{ data: product }, { data: artisan }] = await Promise.all([
    request?.product_id
      ? supabase.from("products").select("name,category,origin").eq("id", request.product_id).maybeSingle()
      : Promise.resolve({ data: null }),
    request?.artisan_id
      ? supabase.from("profiles").select("full_name,email,phone").eq("id", request.artisan_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return (
    <AppShell title="Lecture inspection admin" nav={nav}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#007a3d]">Dossier inspecteur</p>
            <h2 className="mt-1 text-xl font-bold text-stone-950">{mission.mission_number ?? mission.id}</h2>
          </div>
          <Button asChild variant="outline"><Link href="/admin/inspections"><ArrowLeft size={16} /> Retour</Link></Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
            <CardDescription>Informations de planification et dossier rattache.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Info label="Statut" valueNode={<StatusBadge status={mission.status === "done" ? "field_inspection_done" : "field_inspection_scheduled"} />} />
            <Info label="Date prevue" value={new Date(mission.scheduled_at).toLocaleString("fr-FR")} />
            <Info label="Lieu" value={mission.location} />
            <Info label="Type visite" value={mission.visit_type} />
            <Info label="Duree estimee" value={mission.expected_duration_minutes ? `${mission.expected_duration_minutes} min` : null} />
            <Info label="Dossier" value={request?.request_number} />
            <Info label="Produit" value={product?.name} />
            <Info label="Categorie" value={product?.category} />
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Inspecteur</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Info label="Nom" value={inspector?.full_name} />
              <Info label="Email" value={inspector?.email} />
              <Info label="Telephone" value={inspector?.phone} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Artisan / dossier</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Info label="Artisan" value={artisan?.full_name} />
              <Info label="Email" value={artisan?.email} />
              <Info label="Telephone" value={artisan?.phone} />
              <Info label="Origine produit" value={product?.origin} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rapport terrain</CardTitle>
            <CardDescription>Lecture admin des constats et recommandations inspecteur.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <Info label="Recommandation" value={report?.recommendation} />
              <Info label="Hygiene" value={report?.hygiene_score} />
              <Info label="Tracabilite" value={report?.traceability_score} />
              <Info label="Production" value={report?.production_score} />
            </div>
            <TextInfo label="Observations" value={report?.observations} />
            <TextInfo label="Actions correctives" value={report?.corrective_actions} />
            <Info label="Nouvelle visite recommandee" value={report?.next_visit_recommended ? "Oui" : report ? "Non" : null} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Info({ label, value, valueNode }: { label: string; value?: string | number | null; valueNode?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <div className="mt-2 text-sm font-semibold text-stone-950">{valueNode ?? value ?? "Non renseigne"}</div>
    </div>
  );
}

function TextInfo({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">{value ?? "Non renseigne"}</p>
    </div>
  );
}
