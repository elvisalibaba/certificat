import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FileSearch,
  Landmark,
  LockKeyhole,
  Microscope,
  QrCode,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicHeader } from "@/components/public-header";

const services = [
  [ClipboardCheck, "Depot encadre", "Constitution du dossier, pieces techniques, images et documents obligatoires."],
  [FileSearch, "Instruction administrative", "Controle documentaire, demandes de complements et historique complet."],
  [Microscope, "Inspection et laboratoire", "Missions terrain, essais techniques, observations et recommandations."],
  [QrCode, "Certification publique", "PDF officiel, QR code unique et verification publique limitee."],
] satisfies [LucideIcon, string, string][];

const steps = [
  "Creation du compte artisan",
  "Enregistrement de l atelier",
  "Soumission du produit",
  "Controle et decision",
  "Paiement autorise",
  "Certificat verifiable",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f2ea]">
      <PublicHeader />
      <main>
        <section className="relative overflow-hidden bg-[#073b2a] text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[radial-gradient(circle_at_20%_15%,#f4c430_0,transparent_26%),linear-gradient(135deg,#0f6b45_0%,#073b2a_48%,#24150f_100%)]" />
          </div>
          <div className="relative mx-auto grid min-h-[auto] max-w-7xl gap-8 px-4 py-10 sm:px-5 sm:py-14 lg:min-h-[620px] lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="min-w-0">
              <div className="inline-flex max-w-full items-center gap-2 border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f9df78] sm:tracking-[0.18em]">
                <Landmark size={16} /> Portail officiel RDC
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
                Certification des produits artisanaux de la RDC
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
                Une plateforme institutionnelle basee a Kinshasa pour instruire les demandes, suivre les inspections, valider les analyses laboratoire et publier des certificats verifiables par QR code.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/register">Soumettre un produit <ArrowRight size={18} /></Link>
                </Button>
                <Button asChild size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white/15">
                  <Link href="/verify">Verifier un certificat</Link>
                </Button>
              </div>
            </div>

            <div className="grid min-w-0 gap-4">
              <div className="rounded-lg border border-white/15 bg-white p-5 text-stone-950 shadow-2xl">
                <div className="flex flex-col gap-3 border-b border-stone-200 pb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0b5d3b]">Dossier en cours - RDC</p>
                    <h2 className="mt-2 text-xl font-bold sm:text-2xl">Atelier Kimbangu Kinshasa</h2>
                  </div>
                  <span className="rounded-md bg-[#f4c430] px-3 py-1 text-xs font-bold text-stone-950">Inspection</span>
                </div>
                <div className="mt-5 space-y-4">
                  {[
                    ["Pieces fournies", "12/12", "100%"],
                    ["Controle terrain", "Planifie", "65%"],
                    ["Analyse labo", "A affecter", "30%"],
                  ].map(([label, value, width]) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-stone-700">{label}</span>
                        <span className="font-semibold text-stone-950">{value}</span>
                      </div>
                      <div className="h-2 rounded-full bg-stone-100">
                        <div className="h-2 rounded-full bg-[#0b5d3b]" style={{ width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ["50 USD", "Frais"],
                  ["18", "Statuts"],
                  ["RDC", "Juridiction"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg border border-white/15 bg-white/10 p-4 text-white">
                    <p className="text-xl font-bold sm:text-2xl">{value}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/65">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-stone-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-5 sm:grid-cols-2 xl:grid-cols-4">
            {services.map(([Icon, title, text]) => (
              <Card key={title} className="shadow-none transition hover:-translate-y-1 hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#0b5d3b]/10 text-[#0b5d3b]">
                    <Icon size={22} />
                  </div>
                  <h2 className="mt-5 text-lg font-bold text-stone-950">{title}</h2>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-5 sm:py-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0b5d3b]">Processus officiel</p>
            <h2 className="mt-3 text-2xl font-bold text-stone-950 sm:text-3xl">Un parcours clair, controle et auditable.</h2>
            <p className="mt-4 text-sm leading-7 text-stone-600">
              Chaque decision conserve l&apos;auteur, la date, le commentaire et le statut precedent. Les paiements et certificats ne sont declenches qu&apos;apres validation administrative.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg border border-stone-200 bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#f4c430] text-sm font-bold text-stone-950">
                  {index + 1}
                </span>
                <div>
              <h3 className="font-semibold text-stone-950">{step}</h3>
              <p className="mt-1 text-xs leading-5 text-stone-500">Trace dans le dossier et visible selon le role.</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#0b5d3b] text-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-5 lg:grid-cols-3">
            {([
              [Building2, "Espace artisans RDC", "Profils, ateliers, produits, demandes, paiements et certificats."],
              [LockKeyhole, "Administration securisee", "RBAC, RLS, audit logs et operations sensibles cote serveur."],
              [BadgeCheck, "Confiance publique", "Verification du statut valide, suspendu, revoque ou expire."],
            ] satisfies [LucideIcon, string, string][]).map(([Icon, title, text]) => (
              <div key={title} className="border-l border-white/25 pl-5">
                <Icon className="text-[#f4c430]" size={25} />
                <h2 className="mt-4 text-xl font-bold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/75">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
