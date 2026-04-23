import { registerAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicHeader } from "@/components/public-header";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-stone-50">
      <PublicHeader />
      <main className="mx-auto flex max-w-md flex-col px-5 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Compte artisan</CardTitle>
            <CardDescription>Creer un compte pour soumettre vos produits.</CardDescription>
          </CardHeader>
          <CardContent>
            {params.error ? (
              <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{params.error}</p>
            ) : null}
            <form action={registerAction} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Nom complet</Label>
                <Input id="fullName" name="fullName" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" name="password" type="password" minLength={8} required className="mt-2" />
              </div>
              <Button className="w-full">S&apos;inscrire</Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
