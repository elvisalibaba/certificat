import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") return value;
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }, z.string().max(max).optional());

const optionalPositiveNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  return Number(value);
}, z.number().positive().optional());

export const productSchema = z.object({
  name: z.string().trim().min(2, "Le nom du produit doit avoir au moins 2 caracteres.").max(180),
  category: z.string().trim().min(2, "La categorie doit avoir au moins 2 caracteres.").max(120),
  subcategory: optionalText(120),
  description: z.string().trim().min(20, "La description doit avoir au moins 20 caracteres.").max(3000),
  rawMaterials: optionalText(2000),
  manufacturingProcess: optionalText(3000),
  origin: optionalText(180),
  usage: optionalText(1000),
  dimensions: optionalText(120),
  weight: optionalText(120),
  localName: optionalText(180),
  brandName: optionalText(180),
  productCode: optionalText(120),
  batchNumber: optionalText(120),
  annualProductionVolume: optionalText(180),
  unitPrice: optionalPositiveNumber,
  currency: optionalText(8),
  targetMarket: optionalText(300),
  packagingDescription: optionalText(1000),
  shelfLife: optionalText(1000),
  qualityStandardClaimed: optionalText(1000),
  environmentalImpact: optionalText(1000),
  safetyInformation: optionalText(1000),
});

export type ProductInput = z.infer<typeof productSchema>;
