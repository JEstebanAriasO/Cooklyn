import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChefHat } from "lucide-react";
import { recipePlaceholder, resolveRecipeImage } from "@/lib/recipeImages";
import { cn } from "@/lib/utils";
import type { InventoryRow } from "@/components/IngredientInventory";

const TEAL = "#2D6A6A";
const EMPTY_BG = "#fafaf6";

const THRESHOLDS = [50, 75, 100] as const;

function matchPercent(recipe: { ingredients?: { ingredientId: string }[] }, userIds: Set<string>): number {
  const ids = recipe.ingredients?.map((ri) => ri.ingredientId) ?? [];
  if (ids.length === 0) return 0;
  const have = ids.filter((id) => userIds.has(id)).length;
  return Math.round((have / ids.length) * 100);
}

interface Props {
  inventory: InventoryRow[];
}

export function InventoryRecipeMatches({ inventory }: Props) {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [threshold, setThreshold] = useState<(typeof THRESHOLDS)[number]>(50);

  useEffect(() => {
    fetch("http://localhost:3000/api/recipes")
      .then((r) => r.json())
      .then((d) => setRecipes(Array.isArray(d) ? d : []))
      .catch(() => setRecipes([]));
  }, []);

  const userIds = useMemo(() => new Set(inventory.map((i) => i.ingredientId)), [inventory]);

  const matched = useMemo(() => {
    return recipes
      .map((r) => ({ recipe: r, pct: matchPercent(r, userIds) }))
      .filter((x) => x.pct >= threshold)
      .sort((a, b) => b.pct - a.pct || String(a.recipe.title).localeCompare(String(b.recipe.title)));
  }, [recipes, userIds, threshold]);

  const matchCount = matched.length;

  return (
    <article className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <header className="flex gap-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "hsl(var(--muted))" }}
          >
            <ChefHat className="h-5 w-5" style={{ color: TEAL }} aria-hidden />
          </div>
          <div>
            <h2 className="font-display text-xl font-700 text-foreground sm:text-2xl">
              Puedes cocinar con tu inventario
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Recetas con al menos {threshold}% de tus ingredientes.
            </p>
          </div>
        </header>

        <div
          className="flex flex-wrap gap-2 lg:justify-end lg:pt-0.5"
          role="group"
          aria-label="Umbral de coincidencia"
        >
          {THRESHOLDS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setThreshold(t)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-600 transition-smooth",
                threshold === t
                  ? "text-white shadow-soft"
                  : "bg-[#e8e8e4] text-foreground hover:bg-[#deded8]",
              )}
              style={threshold === t ? { backgroundColor: TEAL } : undefined}
            >
              ≥ {t}%
            </button>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        {matchCount} {matchCount === 1 ? "receta coincide" : "recetas coinciden"} con tu inventario.
      </p>

      {matchCount === 0 ? (
        <div
          className="mt-6 rounded-2xl border border-dashed border-neutral-300/90 p-8 text-center text-sm leading-relaxed text-muted-foreground"
          style={{ backgroundColor: EMPTY_BG }}
        >
          Ninguna receta alcanza el {threshold}% con tu inventario actual. Agrega más ingredientes o baja el
          umbral.{" "}
          <Link to="/recetas" className="font-700 underline-offset-2 hover:underline" style={{ color: TEAL }}>
            Explorar todo el catálogo.
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {matched.map(({ recipe, pct }) => {
            const img = resolveRecipeImage(recipe);
            return (
              <li key={recipe.id}>
                <Link
                  to={`/recetas/${recipe.id}`}
                  className="flex gap-4 rounded-2xl border border-border bg-card/50 p-4 transition-smooth hover:border-[#2D6A6A]/35 hover:shadow-soft"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <img
                      src={img}
                      alt=""
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = recipePlaceholder(String(recipe.title ?? "Cooklyn"));
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base font-600 text-foreground leading-snug">{recipe.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{pct}% de ingredientes en tu cocina</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
