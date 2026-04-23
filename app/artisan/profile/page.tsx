import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field } from "@/components/ministry-form-fields";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { updateArtisanProfileAction } from "@/app/artisan/profile/actions";

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
  const { data: artisan } = await supabase.from("artisan_profiles").select("*").eq("user_id", profile.id).maybeSingle();
  const completion = [
    profile.full_name,
    profile.phone,
    artisan?.national_id,
    artisan?.province,
    artisan?.craft_specialty,
    artisan?.craft_card_number,
  ].filter(Boolean).length;

  return (
    <AppShell title="Profil artisan" nav={nav}>
      <div className="space-y-5">
        <Card className="overflow-hidden shadow-none">
          <CardHeader className="border-b border-stone-200 bg-stone-950 text-white">
            <CardTitle className="text-white">Fiche artisan</CardTitle>
            <CardDescription className="text-white/65">Informations reelles utilisees dans les dossiers et certificats.</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_0.38fr]">
              <div className="grid gap-3 md:grid-cols-2">
                <Info label="Nom complet" value={profile.full_name} />
                <Info label="Email compte" value={profile.email} />
                <Info label="Telephone" value={profile.phone} />
                <Info label="Nom public" value={artisan?.public_display_name} />
                <Info label="Piece d'identite" value={artisan?.national_id} />
                <Info label="Carte artisan" value={artisan?.craft_card_number} />
                <Info label="Specialite" value={artisan?.craft_specialty} />
                <Info label="Experience" value={artisan?.professional_experience_years ? `${artisan.professional_experience_years} ans` : null} />
                <Info label="Localisation" value={[artisan?.commune, artisan?.city, artisan?.province].filter(Boolean).join(", ")} />
                <Info label="Cooperative" value={artisan?.cooperative_name} />
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Completude fiche</p>
                <p className="mt-3 text-4xl font-bold text-stone-950">{Math.round((completion / 6) * 100)}%</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">Plus la fiche est complete, plus le traitement administratif est rapide.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
        <CardHeader>
          <CardTitle>Identification ministerielle</CardTitle>
          <CardDescription>Ces donnees alimentent les dossiers de certification du Ministere des PME.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateArtisanProfileAction} className="grid gap-4 lg:grid-cols-2">
            <Field label="Nom complet" name="fullName" defaultValue={profile.full_name} />
            <Field label="Telephone" name="phone" defaultValue={profile.phone} />
            <Field label="Nom public / atelier" name="publicDisplayName" defaultValue={artisan?.public_display_name} />
            <Field label="Piece d'identite" name="nationalId" defaultValue={artisan?.national_id} />
            <div className="min-w-0">
              <label htmlFor="gender" className="text-sm font-medium text-stone-700">Genre</label>
              <select
                id="gender"
                name="gender"
                defaultValue={artisan?.gender ?? "not_specified"}
                className="mt-2 h-10 w-full min-w-0 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 outline-none transition focus:border-emerald-800 focus:ring-2 focus:ring-emerald-900/15"
              >
                <option value="not_specified">Non specifie</option>
                <option value="female">Femme</option>
                <option value="male">Homme</option>
                <option value="other">Autre</option>
              </select>
            </div>
            <Field label="Date de naissance" name="birthDate" type="date" defaultValue={artisan?.birth_date} />
            <Field label="Nationalite" name="nationality" defaultValue={artisan?.nationality ?? "Congolaise"} />
            <Field label="Province" name="province" defaultValue={artisan?.province} />
            <Field label="Territoire" name="territory" defaultValue={artisan?.territory} />
            <Field label="Commune" name="commune" defaultValue={artisan?.commune} />
            <Field label="Ville" name="city" defaultValue={artisan?.city} />
            <Field label="Pays" name="country" defaultValue={artisan?.country ?? "RDC"} />
            <Field label="Adresse" name="address" defaultValue={artisan?.address} />
            <Field label="Carte artisan" name="craftCardNumber" defaultValue={artisan?.craft_card_number} />
            <Field label="Specialite artisanale" name="craftSpecialty" defaultValue={artisan?.craft_specialty} />
            <Field label="Annees d'experience" name="professionalExperienceYears" type="number" defaultValue={artisan?.professional_experience_years} />
            <Field label="Cooperative" name="cooperativeName" defaultValue={artisan?.cooperative_name} />
            <Field label="Representant legal" name="legalRepresentativeName" defaultValue={artisan?.legal_representative_name} />
            <Field label="Telephone public" name="publicPhone" defaultValue={artisan?.public_phone} />
            <Field label="Email public" name="publicEmail" defaultValue={artisan?.public_email} />
            <label className="flex items-center gap-2 text-sm text-stone-700 lg:col-span-2">
              <input name="allowPublicProducerName" type="checkbox" defaultChecked={artisan?.allow_public_producer_name ?? true} />
              Autoriser l&apos;affichage public du nom producteur/atelier sur la verification certificat
            </label>
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
    <div className="rounded-md border border-stone-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{label}</p>
      <p className="mt-2 min-h-5 text-sm font-semibold text-stone-950">{value || "Non renseigne"}</p>
    </div>
  );
}
