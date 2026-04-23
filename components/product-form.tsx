"use client";

import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/lib/validators/product";
import { createProductAction } from "@/app/artisan/products/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProductForm() {
  const { register, formState } = useForm<ProductInput>({
    resolver: zodResolver(productSchema) as Resolver<ProductInput>,
  });

  return (
    <form className="grid gap-5 lg:grid-cols-2" action={createProductAction}>
      <Field label="Nom du produit" error={formState.errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <Field label="Categorie" error={formState.errors.category?.message}>
        <Input {...register("category")} />
      </Field>
      <Field label="Sous-categorie">
        <Input {...register("subcategory")} />
      </Field>
      <Field label="Origine">
        <Input {...register("origin")} />
      </Field>
      <Field label="Nom local">
        <Input {...register("localName")} />
      </Field>
      <Field label="Marque / label commercial">
        <Input {...register("brandName")} />
      </Field>
      <Field label="Code produit">
        <Input {...register("productCode")} />
      </Field>
      <Field label="Numero de lot">
        <Input {...register("batchNumber")} />
      </Field>
      <Field label="Volume annuel de production">
        <Input {...register("annualProductionVolume")} />
      </Field>
      <Field label="Prix unitaire indicatif">
        <Input type="number" step="0.01" {...register("unitPrice")} />
      </Field>
      <Field label="Devise">
        <Input placeholder="USD" {...register("currency")} />
      </Field>
      <Field label="Marche cible">
        <Input {...register("targetMarket")} />
      </Field>
      <Field label="Dimensions">
        <Input {...register("dimensions")} />
      </Field>
      <Field label="Poids">
        <Input {...register("weight")} />
      </Field>
      <Field label="Description" error={formState.errors.description?.message} wide>
        <Textarea {...register("description")} />
      </Field>
      <Field label="Matieres premieres" wide>
        <Textarea {...register("rawMaterials")} />
      </Field>
      <Field label="Procede de fabrication" wide>
        <Textarea {...register("manufacturingProcess")} />
      </Field>
      <Field label="Conditionnement / emballage" wide>
        <Textarea {...register("packagingDescription")} />
      </Field>
      <Field label="Duree de vie / conservation" wide>
        <Textarea {...register("shelfLife")} />
      </Field>
      <Field label="Normes ou qualite revendiquees" wide>
        <Textarea {...register("qualityStandardClaimed")} />
      </Field>
      <Field label="Impact environnemental" wide>
        <Textarea {...register("environmentalImpact")} />
      </Field>
      <Field label="Informations de securite" wide>
        <Textarea {...register("safetyInformation")} />
      </Field>
      <div className="lg:col-span-2 flex justify-end gap-3">
        <Button type="button" variant="outline">Enregistrer brouillon</Button>
        <Button type="submit">Soumettre</Button>
      </div>
    </form>
  );
}

function Field({ label, error, wide, children }: { label: string; error?: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={wide ? "lg:col-span-2" : undefined}>
      <Label>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
