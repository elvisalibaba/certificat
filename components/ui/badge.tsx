import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-800 ring-emerald-700/15",
  amber: "bg-amber-50 text-amber-800 ring-amber-700/15",
  red: "bg-red-50 text-red-800 ring-red-700/15",
  blue: "bg-sky-50 text-sky-800 ring-sky-700/15",
  stone: "bg-stone-100 text-stone-700 ring-stone-700/10",
};

export function Badge({
  tone = "stone",
  className,
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1", tones[tone], className)}>
      {children}
    </span>
  );
}
