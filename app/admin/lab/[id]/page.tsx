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

  const { data: test } = await supabase
    .from("lab_tests")
    .select("id,request_id,product_id,lab_agent_id,test_type,status,sample_reference,test_method,threshold_value,measured_value,unit,is_compliant,observations,recommendation,performed_at,validated_at")
    .eq("id", id)
    .maybeSingle();

  if (!test) {
    return (
      <AppShell title="Lecture laboratoire admin" nav={nav}>
        <Card><CardContent className="p-5 text-sm text-stone-500">Test introuvable.</CardContent></Card>
      </AppShell>
    );
  }

  const [{ data: labAgent }, { data: request }, { data: product }] = await Promise.all([
    test.lab_agent_id
      ? supabase.from("profiles").select("full_name,email,phone").eq("id", test.lab_agent_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("certification_requests").select("request_number,status,artisan_id").eq("id", test.request_id).maybeSingle(),
    supabase.from("products").select("name,category,origin").eq("id", test.product_id).maybeSingle(),
  ]);

  const { data: artisan } = request?.artisan_id
    ? await supabase.from("profiles").select("full_name,email,phone").eq("id", request.artisan_id).maybeSingle()
    : { data: null };

  return (
    <AppShell title="Lecture laboratoire admin" nav={nav}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#007a3d]">Dossier laboratoire</p>
            <h2 className="mt-1 text-xl font-bold text-stone-950">{test.test_type}</h2>
          </div>
          <Button asChild variant="outline"><Link href="/admin/lab"><ArrowLeft size={16} /> Retour</Link></Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test</CardTitle>
            <CardDescription>Lecture admin des affectations et resultats labo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Info label="Statut" valueNode={<StatusBadge status={test.status === "done" ? "lab_testing_done" : "lab_testing_scheduled"} />} />
            <Info label="Dossier" value={request?.request_number} />
            <Info label="Echantillon" value={test.sample_reference} />
            <Info label="Produit" value={product?.name} />
            <Info label="Categorie" value={product?.category} />
            <Info label="Methode" value={test.test_method} />
            <Info label="Valeur mesuree" value={test.measured_value ? `${test.measured_value}${test.unit ? ` ${test.unit}` : ""}` : null} />
            <Info label="Seuil" value={test.threshold_value} />
          </CardContent>
        </Card>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Agent laboratoire</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Info label="Nom" value={labAgent?.full_name} />
              <Info label="Email" value={labAgent?.email} />
              <Info label="Telephone" value={labAgent?.phone} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Artisan / produit</CardTitle></CardHeader>
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
            <CardTitle>Conclusion technique</CardTitle>
            <CardDescription>Resultats, conformite, recommandations et observations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <Info label="Conformite" value={test.is_compliant === null ? null : test.is_compliant ? "Conforme" : "Non conforme"} />
              <Info label="Recommendation" value={test.recommendation} />
              <Info label="Effectue le" value={test.performed_at ? new Date(test.performed_at).toLocaleString("fr-FR") : null} />
              <Info label="Valide le" value={test.validated_at ? new Date(test.validated_at).toLocaleString("fr-FR") : null} />
            </div>
            <TextInfo label="Observations" value={test.observations} />
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
