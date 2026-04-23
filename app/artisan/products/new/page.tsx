import { AppShell } from "@/components/app-shell";
import { ProductForm } from "@/components/product-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const nav = [
  { href: "/artisan/dashboard", label: "Tableau de bord" },
  { href: "/artisan/products", label: "Produits" },
  { href: "/artisan/requests", label: "Demandes" },
  { href: "/artisan/payments", label: "Paiements" },
];

export default function NewProductPage() {
  return (
    <AppShell title="Nouveau produit" nav={nav}>
      <Card>
        <CardHeader>
          <CardTitle>Soumission produit</CardTitle>
          <CardDescription>Renseignez les informations techniques avant ajout des pieces.</CardDescription>
        </CardHeader>
        <CardContent><ProductForm /></CardContent>
      </Card>
    </AppShell>
  );
}
