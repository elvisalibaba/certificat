import { BadgeCheck, Ban, ClockAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicHeader } from "@/components/public-header";

export default async function VerifyCodePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("public_certificate_verification")
    .select("*")
    .or(`public_code.eq.${code},certificate_number.eq.${code}`)
    .maybeSingle();

  const valid = data?.status === "valid";
  const Icon = valid ? BadgeCheck : data ? ClockAlert : Ban;

  return (
    <div className="min-h-screen bg-stone-50">
      <PublicHeader />
      <main className="mx-auto max-w-3xl px-5 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Icon className={valid ? "text-emerald-800" : "text-red-700"} />
              <CardTitle>{data ? "Certificat trouve" : "Certificat introuvable"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {data ? (
              <>
                <Badge tone={valid ? "green" : "red"}>{String(data.status).toUpperCase()}</Badge>
                <dl className="grid gap-3 text-sm md:grid-cols-2">
                  <Info label="Produit" value={data.product_name} />
                  <Info label="Numero" value={data.certificate_number} />
                  <Info label="Categorie" value={data.category} />
                  <Info label="Producteur" value={data.producer_public_name ?? "Non publie"} />
                  <Info label="Emission" value={new Date(data.issued_at).toLocaleDateString("fr-FR")} />
                  <Info label="Expiration" value={data.expires_at ? new Date(data.expires_at).toLocaleDateString("fr-FR") : "Non applicable"} />
                </dl>
              </>
            ) : (
              <p className="text-stone-600">Aucune certification publique ne correspond a ce code.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-stone-500">{label}</dt>
      <dd className="font-medium text-stone-950">{value}</dd>
    </div>
  );
}
