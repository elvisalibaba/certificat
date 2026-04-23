import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, TextField } from "@/components/ministry-form-fields";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { upsertWorkshopAction } from "@/app/artisan/workshop/actions";

const nav = [
  { href: "/artisan/dashboard", label: "Tableau de bord" },
  { href: "/artisan/profile", label: "Profil" },
  { href: "/artisan/workshop", label: "Atelier" },
  { href: "/artisan/products", label: "Produits" },
  { href: "/artisan/requests", label: "Demandes" },
  { href: "/artisan/payments", label: "Paiements" },
  { href: "/artisan/certificates", label: "Certificats" },
];

export default async function Page() {
  const profile = await requireProfile(["artisan"]);
  const supabase = await createClient();
  const { data: workshop } = await supabase.from("workshops").select("*").eq("artisan_id", profile.id).limit(1).maybeSingle();

  return (
    <AppShell title="Atelier" nav={nav}>
      <div className="space-y-5">
        <Card className="overflow-hidden shadow-none">
          <CardHeader className="border-b border-stone-200 bg-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007a3d]">Fiche atelier</p>
            <CardTitle>{workshop?.name ?? "Atelier non renseigne"}</CardTitle>
            <CardDescription>Vue de controle avant modification des informations de production.</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Info label="Numero enregistrement" value={workshop?.registration_number} />
              <Info label="Statut juridique" value={workshop?.legal_status} />
              <Info label="RCCM" value={workshop?.rccm_number} />
              <Info label="Numero impot" value={workshop?.tax_number} />
              <Info label="Adresse" value={[workshop?.address, workshop?.commune, workshop?.city].filter(Boolean).join(", ")} />
              <Info label="Province" value={workshop?.province} />
              <Info label="Employes" value={workshop?.employee_count ?? 0} />
              <Info label="Femmes employees" value={workshop?.women_employee_count ?? 0} />
              <Info label="Jeunes employes" value={workshop?.youth_employee_count ?? 0} />
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <TextInfo label="Capacite de production" value={workshop?.production_capacity} />
              <TextInfo label="Equipements" value={workshop?.equipment_summary} />
              <TextInfo label="Hygiene / securite" value={workshop?.hygiene_measures} />
            </div>
          </CardContent>
        </Card>
        <Card>
        <CardHeader>
          <CardTitle>Structure artisanale</CardTitle>
          <CardDescription>Localisation, capacite de production et references administratives.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={upsertWorkshopAction} className="grid gap-4 lg:grid-cols-2">
            <input type="hidden" name="workshopId" value={workshop?.id ?? ""} />
            <Field label="Nom de l'atelier" name="name" defaultValue={workshop?.name} />
            <Field label="Numero d'enregistrement" name="registrationNumber" defaultValue={workshop?.registration_number} />
            <Field label="Statut juridique" name="legalStatus" defaultValue={workshop?.legal_status} />
            <Field label="Numero impot" name="taxNumber" defaultValue={workshop?.tax_number} />
            <Field label="RCCM" name="rccmNumber" defaultValue={workshop?.rccm_number} />
            <Field label="Province" name="province" defaultValue={workshop?.province} />
            <Field label="Territoire" name="territory" defaultValue={workshop?.territory} />
            <Field label="Commune" name="commune" defaultValue={workshop?.commune} />
            <Field label="Quartier" name="neighborhood" defaultValue={workshop?.neighborhood} />
            <Field label="Ville" name="city" defaultValue={workshop?.city} />
            <Field label="Pays" name="country" defaultValue={workshop?.country ?? "RDC"} />
            <Field label="Adresse" name="address" defaultValue={workshop?.address} />
            <Field label="Latitude" name="latitude" type="number" defaultValue={workshop?.latitude} />
            <Field label="Longitude" name="longitude" type="number" defaultValue={workshop?.longitude} />
            <Field label="Nombre d'employes" name="employeeCount" type="number" defaultValue={workshop?.employee_count} />
            <Field label="Femmes employees" name="womenEmployeeCount" type="number" defaultValue={workshop?.women_employee_count} />
            <Field label="Jeunes employes" name="youthEmployeeCount" type="number" defaultValue={workshop?.youth_employee_count} />
            <TextField label="Capacite de production" name="productionCapacity" defaultValue={workshop?.production_capacity} />
            <TextField label="Equipements principaux" name="equipmentSummary" defaultValue={workshop?.equipment_summary} />
            <TextField label="Mesures d'hygiene / securite" name="hygieneMeasures" defaultValue={workshop?.hygiene_measures} />
            <TextField label="Description" name="description" defaultValue={workshop?.description} />
            <div className="lg:col-span-2 flex justify-end">
              <Button>Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-2 min-h-5 text-sm font-semibold text-stone-950">{value || "Non renseigne"}</p>
    </div>
  );
}

function TextInfo({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-md border border-stone-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-stone-600">{value || "Non renseigne"}</p>
    </div>
  );
}
