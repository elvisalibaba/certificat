import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  emerald: "border-l-[#007a3d] bg-white",
  amber: "border-l-[#f7d618] bg-white",
  red: "border-l-[#ce1021] bg-white",
  ink: "border-l-stone-950 bg-white",
};

export function KpiCard({
  label,
  value,
  detail,
  tone = "emerald",
  trend,
}: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: keyof typeof tones;
  trend?: string;
}) {
  return (
    <Card className={cn("overflow-hidden border-l-4 shadow-none", tones[tone])}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-stone-500">{label}</p>
          {trend ? <span className="rounded-md bg-stone-100 px-2 py-1 text-[11px] font-bold text-stone-700">{trend}</span> : null}
        </div>
        <p className="mt-3 text-3xl font-bold text-stone-950">{value}</p>
        {detail ? <p className="mt-2 text-xs leading-5 text-stone-500">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
