import Link from "next/link";
import { loginAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PublicHeader } from "@/components/public-header";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-stone-50">
      <PublicHeader />
      <main className="mx-auto flex max-w-md flex-col px-5 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>Acces securise aux espaces metier.</CardDescription>
          </CardHeader>
          <CardContent>
            {params.error ? (
              <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{params.error}</p>
            ) : null}
            <form action={loginAction} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" name="password" type="password" required className="mt-2" />
              </div>
              <Button className="w-full">Se connecter</Button>
            </form>
            <p className="mt-4 text-sm text-stone-600">
              Pas encore inscrit ? <Link className="font-medium text-emerald-900" href="/register">Creer un compte</Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
