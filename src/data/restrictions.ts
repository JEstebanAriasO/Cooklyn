import type { RestrictionInfo } from "@/types/cooklyn";

export const RESTRICTIONS: RestrictionInfo[] = [
  { id: "gluten", label: "Sin gluten", excludes: ["harina", "pan", "trigo", "pasta", "cebada", "centeno"] },
  { id: "lactosa", label: "Sin lactosa", excludes: ["leche", "queso", "mantequilla", "yogur", "crema", "nata"] },
  { id: "frutos_secos", label: "Sin frutos secos", excludes: ["nuez", "almendra", "maní", "cacahuate", "avellana", "pistacho"] },
  { id: "mariscos", label: "Sin mariscos", excludes: ["camarón", "pulpo", "calamar", "langosta", "mejillón"] },
  { id: "huevo", label: "Sin huevo", excludes: ["huevo", "clara", "yema"] },
  { id: "soya", label: "Sin soya", excludes: ["soya", "tofu", "edamame"] },
  { id: "vegetariano", label: "Vegetariano", excludes: ["pollo", "res", "cerdo", "pescado", "carne", "tocino", "jamón"] },
  { id: "vegano", label: "Vegano", excludes: ["pollo", "res", "cerdo", "pescado", "carne", "leche", "queso", "huevo", "miel", "mantequilla"] },
  { id: "diabetes", label: "Diabetes", excludes: ["azúcar", "miel", "jarabe"] },
  { id: "hipertension", label: "Hipertensión", excludes: ["sal", "embutido", "tocino"] },
];
