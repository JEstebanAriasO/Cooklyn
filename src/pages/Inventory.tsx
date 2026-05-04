import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { IngredientInventory, type InventoryRow } from "@/components/IngredientInventory";
import { InventoryRecipeMatches } from "@/components/InventoryRecipeMatches";
import { HealthFilter } from "@/components/HealthFilter";
import { useCooklyn } from "@/context/CooklynContext";

const TEAL = "#2D6A6A";

const Inventory = () => {
  const { user } = useCooklyn();
  const userId = user?.id;
  const [inventory, setInventory] = useState<InventoryRow[]>([]);

  const refreshInventory = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`http://localhost:3000/api/inventory/${userId}`);
      const data = await res.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener el inventario:", error);
    }
  }, [userId]);

  useEffect(() => {
    refreshInventory();
  }, [refreshInventory]);

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#eef6f4] py-2">
      <div className="mx-auto max-w-5xl space-y-6 px-4 pb-10 pt-2 sm:px-6">
        <header>
          <h1 className="font-display text-4xl font-700 tracking-tight text-foreground">Tu cocina</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Mantén tu inventario y restricciones al día para recibir mejores recomendaciones.
          </p>
        </header>

        <IngredientInventory inventory={inventory} onRefresh={refreshInventory} />

        {user && <HealthFilter variant="panel" />}

        <InventoryRecipeMatches inventory={inventory} />

        <Link
          to="/recetas"
          className="flex items-center justify-between gap-4 rounded-2xl p-6 text-white shadow-card transition-smooth hover:brightness-[1.03] active:scale-[0.99]"
          style={{ backgroundColor: TEAL }}
        >
          <div>
            <p className="font-display text-xl font-600">Explora el catálogo completo</p>
            <p className="mt-1 text-sm text-white/85">
              Mira todas las recetas disponibles, no solo las que ya puedes cocinar.
            </p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 opacity-95" aria-hidden />
        </Link>
      </div>
    </div>
  );
};

export default Inventory;
