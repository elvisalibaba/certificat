import Link from "next/link";
import { Bell, Search, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell({
  title,
  nav,
  children,
}: {
  title: string;
  nav: { href: string; label: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f7f3]">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-[#071f18] p-5 text-white lg:block">
        <Link href="/" className="flex items-center gap-3 text-stone-950">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f7d618] text-stone-950">
            <ShieldCheck size={20} />
          </span>
          <span>
            <span className="block text-sm font-bold text-white">CertiArt RDC</span>
            <span className="text-xs text-white/60">Portail institutionnel</span>
          </span>
        </Link>
        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f7d618]">RDC Kinshasa</p>
          <p className="mt-2 text-sm leading-6 text-white/75">Certification des produits artisanaux et suivi administratif national.</p>
        </div>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={cn("block rounded-md px-3 py-2.5 text-sm font-medium text-white/75 hover:bg-white/10 hover:text-white")}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-5">
          <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-3 lg:hidden">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#071f18] text-[#f7d618]">
                  <ShieldCheck size={19} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-stone-950">CertiArt RDC</p>
                  <p className="truncate text-xs text-stone-500">Portail institutionnel</p>
                </div>
              </div>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#007a3d] lg:mt-0">Console securisee RDC</p>
              <h1 className="mt-1 break-words text-xl font-bold text-stone-950 sm:text-2xl">{title}</h1>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 text-sm text-stone-500 sm:min-w-72">
                <Search size={16} />
                <span className="truncate">Recherche dossier, certificat, artisan</span>
              </div>
              <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-700" aria-label="Notifications">
                <Bell size={17} />
              </button>
            </div>
          </div>
          <nav className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <div className="min-w-0 p-4 sm:p-5 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
