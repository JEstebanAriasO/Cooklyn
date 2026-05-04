import { useState } from "react";
import { RESTRICTIONS } from "@/data/restrictions";
import type { MedicalRestriction, UserProfile } from "@/types/cooklyn";
import { useCooklyn } from "@/context/CooklynContext";
import { Heart, Plus, ShieldAlert, Stethoscope, Utensils, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { customConditionItemSchema, cautionIngredientItemSchema } from "@/lib/validators";
import { INGREDIENT_CATALOG } from "@/data/ingredients";
import { toast } from "sonner";

interface ControlledValue {
  restrictions: MedicalRestriction[];
  customConditions: string[];
  cautionIngredients: string[];
}

interface Props {
  value?: ControlledValue;
  onChange?: (val: ControlledValue) => void;
  variant?: "form" | "panel";
}

const SUGGESTED_CONDITIONS = ["Celiaquía", "Anemia", "Colesterol alto", "Intolerancia a la fructosa"];

export function HealthFilter({ value, onChange, variant = "form" }: Props) {
  const { user, setUser } = useCooklyn();

  const current: ControlledValue =
    value ?? {
      restrictions: user?.restrictions ?? [],
      customConditions: user?.customConditions ?? [],
      cautionIngredients: user?.cautionIngredients ?? [],
    };

  const update = (patch: Partial<ControlledValue>) => {
    const next = { ...current, ...patch };
    if (onChange) onChange(next);
    else if (user) {
      const merged: UserProfile = {
        name: user.name,
        email: user.email,
        restrictions: next.restrictions,
        customConditions: next.customConditions,
        cautionIngredients: next.cautionIngredients,
      };
      setUser({ ...merged, id: user.id });
    }
  };

  const toggleRestriction = (id: MedicalRestriction) => {
    update({
      restrictions: current.restrictions.includes(id)
        ? current.restrictions.filter((x) => x !== id)
        : [...current.restrictions, id],
    });
  };

  const [conditionInput, setConditionInput] = useState("");
  const [cautionInput, setCautionInput] = useState("");

  const addCondition = (raw: string) => {
    const parsed = customConditionItemSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const v = parsed.data;
    if (current.customConditions.length >= 10) {
      toast.error("Máximo 10 condiciones");
      return;
    }
    if (current.customConditions.some((c) => c.toLowerCase() === v.toLowerCase())) {
      toast.info("Ya está en tu lista");
      return;
    }
    update({ customConditions: [...current.customConditions, v] });
    setConditionInput("");
  };

  const removeCondition = (v: string) =>
    update({ customConditions: current.customConditions.filter((c) => c !== v) });

  const addCaution = (raw: string) => {
    const parsed = cautionIngredientItemSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    const v = parsed.data;
    if (current.cautionIngredients.length >= 20) {
      toast.error("Máximo 20 alimentos");
      return;
    }
    if (current.cautionIngredients.some((c) => c.toLowerCase() === v.toLowerCase())) {
      toast.info("Ya está en tu lista");
      return;
    }
    update({ cautionIngredients: [...current.cautionIngredients, v] });
    setCautionInput("");
  };

  const removeCaution = (v: string) =>
    update({ cautionIngredients: current.cautionIngredients.filter((c) => c !== v) });

  const cautionSuggestions = INGREDIENT_CATALOG.filter(
    (i) =>
      i.toLowerCase().includes(cautionInput.toLowerCase()) &&
      cautionInput.length >= 2 &&
      !current.cautionIngredients.some((c) => c.toLowerCase() === i.toLowerCase()),
  ).slice(0, 6);

  return (
    <div
      className={cn(
        "rounded-3xl border border-border p-5 space-y-6",
        variant === "panel" ? "bg-card shadow-soft" : "bg-background/60",
      )}
    >
      <fieldset>
        <legend className="px-1 flex items-center gap-2 font-display text-lg font-600">
          <ShieldAlert className="h-4 w-4 text-secondary" />
          Condiciones médicas comunes
        </legend>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Selecciona las que apliquen. Filtraremos ingredientes incompatibles.
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Condiciones médicas">
          {RESTRICTIONS.map((r) => {
            const active = current.restrictions.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggleRestriction(r.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-smooth",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-soft"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-primary/5",
                )}
              >
                {active && <Heart className="h-3.5 w-3.5 fill-current" />}
                {r.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="px-1 flex items-center gap-2 font-display text-lg font-600">
          <Stethoscope className="h-4 w-4 text-secondary" />
          Otras condiciones médicas
        </legend>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Escribe cualquier enfermedad o diagnóstico que debamos considerar.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            value={conditionInput}
            onChange={(e) => setConditionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCondition(conditionInput);
              }
            }}
            placeholder="Ej: hipotiroidismo"
            maxLength={60}
            className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Nueva condición médica"
          />
          <button
            type="button"
            onClick={() => addCondition(conditionInput)}
            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-smooth"
          >
            <Plus className="h-4 w-4" /> Agregar
          </button>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUGGESTED_CONDITIONS.filter(
            (s) => !current.customConditions.some((c) => c.toLowerCase() === s.toLowerCase()),
          ).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addCondition(s)}
              className="text-xs rounded-full border border-dashed border-border px-2.5 py-1 text-muted-foreground hover:bg-muted transition-smooth"
            >
              + {s}
            </button>
          ))}
        </div>

        {current.customConditions.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Condiciones agregadas">
            {current.customConditions.map((c) => (
              <li key={c}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-sm text-secondary-foreground">
                  {c}
                  <button
                    type="button"
                    onClick={() => removeCondition(c)}
                    aria-label={`Quitar ${c}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <fieldset>
        <legend className="px-1 flex items-center gap-2 font-display text-lg font-600">
          <Utensils className="h-4 w-4 text-secondary" />
          Alimentos a manejar con precaución
        </legend>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Te avisaremos cuando una receta los contenga.
        </p>

        <div className="relative flex gap-2">
          <input
            type="text"
            value={cautionInput}
            onChange={(e) => setCautionInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCaution(cautionInput);
              }
            }}
            placeholder="Ej: maní"
            maxLength={40}
            className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Nuevo alimento a vigilar"
          />
          <button
            type="button"
            onClick={() => addCaution(cautionInput)}
            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-smooth"
          >
            <Plus className="h-4 w-4" /> Agregar
          </button>

          {cautionSuggestions.length > 0 && (
            <ul
              role="listbox"
              className="absolute left-0 top-full z-10 mt-1 w-full max-w-xs rounded-xl border border-border bg-popover p-1 shadow-card"
            >
              {cautionSuggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => addCaution(s)}
                    className="w-full rounded-lg px-3 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {current.cautionIngredients.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Alimentos a vigilar">
            {current.cautionIngredients.map((c) => (
              <li key={c}>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-3 py-1 text-sm text-foreground">
                  {c}
                  <button
                    type="button"
                    onClick={() => removeCaution(c)}
                    aria-label={`Quitar ${c}`}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </fieldset>
    </div>
  );
}
