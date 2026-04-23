"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const operators = ["Airtel Money", "Orange Money", "M-Pesa", "Afrimoney"];

export function MobileMoneySimulator() {
  const [operator, setOperator] = useState(operators[0]);
  const [phone, setPhone] = useState("+243");
  const [status, setStatus] = useState<"idle" | "pending" | "confirmed">("idle");

  const reference = useMemo(() => {
    const suffix = phone.replace(/\D/g, "").slice(-4).padStart(4, "0");
    return `RDC-MM-${suffix}-${operator.split(" ")[0].toUpperCase()}`;
  }, [operator, phone]);

  return (
    <Card className="overflow-hidden shadow-none">
      <CardHeader className="border-b border-stone-200 bg-stone-950 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f7d618] text-stone-950">
            <Smartphone size={19} />
          </span>
          <div>
            <CardTitle className="text-white">Simulation Mobile Money RDC</CardTitle>
            <CardDescription className="text-white/65">Test de paiement avant integration provider.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 p-5 md:grid-cols-[1fr_0.85fr]">
        <div className="space-y-4">
          <div>
            <Label htmlFor="operator">Operateur</Label>
            <select
              id="operator"
              value={operator}
              onChange={(event) => setOperator(event.target.value)}
              className="mt-2 h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm"
            >
              {operators.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="mobile-money-phone">Numero payeur</Label>
            <Input id="mobile-money-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+243 81 000 0000" />
          </div>
          <Button
            type="button"
            onClick={() => {
              setStatus("pending");
              window.setTimeout(() => setStatus("confirmed"), 700);
            }}
            className="w-full"
          >
            Simuler la demande STK
          </Button>
        </div>
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">Reference</p>
          <p className="mt-2 break-all text-lg font-bold text-stone-950">{reference}</p>
          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-stone-600">Montant</span><strong>50 USD</strong></div>
            <div className="flex justify-between"><span className="text-stone-600">Pays</span><strong>RDC</strong></div>
            <div className="flex justify-between"><span className="text-stone-600">Statut</span><strong>{status === "idle" ? "Pret" : status === "pending" ? "En attente" : "Confirme"}</strong></div>
          </div>
          {status === "confirmed" ? (
            <div className="mt-5 flex items-center gap-2 rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
              <CheckCircle2 size={17} /> Paiement simule confirme
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
