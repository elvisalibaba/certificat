import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export type RecordListItem = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  status?: string;
};

export function RecordList({
  title,
  description,
  items,
  empty = "Aucune donnee trouvee dans Supabase.",
}: {
  title: string;
  description?: string;
  items: RecordListItem[];
  empty?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length ? items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 rounded-md border border-stone-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-stone-950">{item.title}</p>
              {item.subtitle ? <p className="mt-1 text-xs text-stone-500">{item.subtitle}</p> : null}
              {item.meta ? <p className="mt-1 text-xs font-medium text-[#0b5d3b]">{item.meta}</p> : null}
            </div>
            {item.status ? <StatusBadge status={item.status} /> : null}
          </div>
        )) : <p className="text-sm text-stone-500">{empty}</p>}
      </CardContent>
    </Card>
  );
}
