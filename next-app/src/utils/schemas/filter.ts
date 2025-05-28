import { regions } from "@/lib/constants/regions";
import * as z from "zod";

const populationSchema = z.object({
  age: z.number().min(0),
  sexe: z.enum(["HOMME", "FEMME"]),
  revenusMoyen: z.number().min(0),
  tauxChomage: z.number().min(0).max(100),
  dernierDiplome: z.string(),
});

const transportSchema = z.object({});

export const filterSchema = z.object({
  region: z.enum(regions.map((el) => el.name) as [string, ...string[]]),
  population: populationSchema,
});
