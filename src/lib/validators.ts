import { z } from "zod";

export const RESTRICTION_IDS = [
  "gluten",
  "lactosa",
  "frutos_secos",
  "mariscos",
  "huevo",
  "soya",
  "vegetariano",
  "vegano",
  "diabetes",
  "hipertension",
] as const;

const customConditionSchema = z
  .string()
  .trim()
  .min(2, { message: "Mínimo 2 caracteres" })
  .max(60, { message: "Máximo 60 caracteres" });

const cautionIngredientSchema = z
  .string()
  .trim()
  .min(2, { message: "Mínimo 2 caracteres" })
  .max(40, { message: "Máximo 40 caracteres" })
  .regex(/^[\p{L}\s\-']+$/u, { message: "Solo letras, espacios y guiones" });

export const registerSchema = z.object({
  name: z.string().trim().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).max(80),
  email: z.string().trim().email({ message: "Correo electrónico inválido" }).max(255),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }).max(100),
  restrictions: z.array(z.enum(RESTRICTION_IDS)).max(10),
  customConditions: z.array(customConditionSchema).max(10, { message: "Máximo 10 condiciones" }),
  cautionIngredients: z.array(cautionIngredientSchema).max(20, { message: "Máximo 20 alimentos" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const customConditionItemSchema = customConditionSchema;
export const cautionIngredientItemSchema = cautionIngredientSchema;
