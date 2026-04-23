import Link from "next/link";
import { Building2, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="bg-[#063a28] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span className="inline-flex min-w-0 items-center gap-2">
            <ShieldCheck size={14} />
            <span className="break-words">Republique Democratique du Congo - Agence Nationale de Certification Artisanale</span>
          </span>
          <span className="flex flex-wrap gap-4 text-white/85">
            <span className="inline-flex items-center gap-1"><Mail size={13} /> contact@certiart.cd</span>
            <span className="inline-flex items-center gap-1"><MapPin size={13} /> Kinshasa, RDC</span>
          </span>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-stone-950">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#0b5d3b] text-white shadow-sm sm:h-12 sm:w-12">
            <ShieldCheck size={20} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-lg font-bold tracking-tight">CertiArt RDC</span>
            <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-stone-500 sm:block">Certification artisanale officielle</span>
          </span>
        </Link>
        <nav className="flex gap-2 overflow-x-auto pb-1 lg:items-center lg:overflow-visible lg:pb-0">
          <Button asChild variant="ghost"><Link href="/">Accueil</Link></Button>
          <Button asChild variant="ghost"><Link href="/verify">Verifier</Link></Button>
          <Button asChild variant="outline"><Link href="/login">Connexion</Link></Button>
          <Button asChild><Link href="/register"><Building2 size={17} /> Espace artisan</Link></Button>
        </nav>
      </div>
    </header>
  );
}
