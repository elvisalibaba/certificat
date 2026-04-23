import { BadgeCheck, QrCode, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PublicHeader } from "@/components/public-header";
import { QrScanner } from "@/components/qr-scanner";

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#f5f2ea]">
      <PublicHeader />
      <main>
        <section className="bg-[#073b2a] text-white">
          <div className="mx-auto max-w-7xl px-5 py-12">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#f4c430]">
              <BadgeCheck size={16} /> Verification officielle
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-5xl">Verifier l&apos;authenticite d&apos;un certificat artisanal.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
              Le resultat public affiche uniquement les informations autorisees : produit, numero, statut, dates et producteur si publication autorisee.
            </p>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Recherche par numero</CardTitle>
              <CardDescription>Utilisez le numero imprime sur le certificat PDF.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action="/verify/search" className="space-y-3">
                <Input name="code" placeholder="CERT-ART-2026-000001" />
                <Button type="submit" className="w-full"><Search size={18} /> Verifier</Button>
              </form>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><QrCode size={20} /> Scanner un QR code</CardTitle>
              <CardDescription>Autorisez la camera et presentez le code devant l&apos;objectif.</CardDescription>
            </CardHeader>
            <CardContent>
              <QrScanner />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
