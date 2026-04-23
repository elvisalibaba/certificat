import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const navs = {
  artisan: [
    { href: "/artisan/dashboard", label: "Tableau de bord" },
    { href: "/artisan/profile", label: "Profil" },
    { href: "/artisan/workshop", label: "Atelier" },
    { href: "/artisan/products", label: "Produits" },
    { href: "/artisan/requests", label: "Demandes" },
    { href: "/artisan/payments", label: "Paiements" },
    { href: "/artisan/certificates", label: "Certificats" },
  ],
  inspector: [
    { href: "/inspector/dashboard", label: "Tableau de bord" },
    { href: "/inspector/missions", label: "Missions" },
  ],
  lab: [
    { href: "/lab/dashboard", label: "Tableau de bord" },
    { href: "/lab/tests", label: "Tests" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Tableau de bord" },
    { href: "/admin/artisans", label: "Artisans" },
    { href: "/admin/products", label: "Produits" },
    { href: "/admin/requests", label: "Demandes" },
    { href: "/admin/inspections", label: "Inspections" },
    { href: "/admin/lab", label: "Laboratoire" },
    { href: "/admin/payments", label: "Paiements" },
    { href: "/admin/certificates", label: "Certificats" },
    { href: "/admin/settings", label: "Parametres" },
  ],
};

export function SimpleRolePage({
  role,
  title,
  description,
  children,
}: {
  role: keyof typeof navs;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <AppShell title={title} nav={navs[role]}>
      <div className="space-y-5">
        <Card className="overflow-hidden shadow-none">
          <CardHeader className="border-b border-stone-200 bg-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007a3d]">Console operationnelle RDC</p>
            <CardTitle className="mt-1">{title}</CardTitle>
          </CardHeader>
          <CardContent className="p-5 text-sm leading-6 text-stone-600">{description}</CardContent>
        </Card>
        {children}
      </div>
    </AppShell>
  );
}
