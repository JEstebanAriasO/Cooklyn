import { useEffect, useRef, useState } from "react";
import { Carrot, Loader2, Plus, Search, X } from "lucide-react";
import AddIngredientModal from "@/components/ui/AddIngredientModal";
import { useCooklyn } from "@/context/CooklynContext";

const TEAL = "#2D6A6A";
const TAG_BG = "#E0F2F1";
const INPUT_BG = "#F4F4EE";

export type InventoryRow = {
  id: string;
  ingredientId: string;
  ingredient: { name: string };
};

interface Props {
  inventory: InventoryRow[];
  onRefresh: () => void;
}

export function IngredientInventory({ inventory, onRefresh }: Props) {
  const { user } = useCooklyn();
  const userId = user?.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setLoading(true);
        try {
          const res = await fetch(
            `http://localhost:3000/api/ingredients/search?q=${encodeURIComponent(searchTerm.trim())}`,
          );
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          const skip = new Set(inventory.map((i) => i.ingredientId));
          setResults(list.filter((ing: { id: string }) => !skip.has(ing.id)));
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm, inventory]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!searchWrapRef.current?.contains(e.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const addIngredient = async (ingredientId: string) => {
    if (!userId) return;
    try {
      await fetch("http://localhost:3000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ingredientId, quantity: "1 unidad" }),
      });
      setSearchTerm("");
      setResults([]);
      onRefresh();
    } catch {
      console.error("Error al añadir ingrediente");
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/inventory/${itemId}`, { method: "DELETE" });
      if (res.ok) onRefresh();
    } catch {
      console.error("Error al eliminar");
    }
  };

  const count = inventory.length;
  const countLabel =
    count === 1 ? "1 ingrediente en tu cocina." : `${count} ingredientes en tu cocina.`;

  return (
    <article className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-card sm:p-8">
      <header className="mb-6 flex gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "hsl(var(--muted))" }}
        >
          <Carrot className="h-5 w-5" style={{ color: TEAL }} aria-hidden />
        </div>
        <div>
          <h2 className="font-display text-xl font-700 text-foreground sm:text-2xl">Mi inventario</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Agrega lo que tienes en casa y descubre qué puedes cocinar.
          </p>
        </div>
      </header>

      <div ref={searchWrapRef} className="relative">
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-2.5 sm:py-3"
          style={{ backgroundColor: INPUT_BG }}
        >
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej. tomate, pollo, albahaca..."
            className="min-w-0 flex-1 border-0 bg-transparent py-1 text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Buscar ingrediente para agregar"
          />
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl px-4 py-2 text-sm font-600 text-white transition hover:opacity-95 active:scale-[0.98]"
            style={{ backgroundColor: TEAL }}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden /> Agregar
          </button>
        </div>

        {(loading || results.length > 0) && searchTerm.trim().length > 1 && (
          <ul
            className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-auto rounded-xl border border-border bg-card py-1 shadow-card"
            role="listbox"
          >
            {loading ? (
              <li className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
              </li>
            ) : (
              results.map((ing) => (
                <li key={ing.id} role="option">
                  <button
                    type="button"
                    onClick={() => addIngredient(ing.id)}
                    className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-foreground hover:bg-muted/80"
                  >
                    {ing.name}
                    <Plus className="h-4 w-4 text-muted-foreground" aria-hidden />
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {inventory.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Ingredientes en tu cocina">
          {inventory.map((item) => (
            <li key={item.id}>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-600"
                style={{ backgroundColor: TAG_BG, color: TEAL }}
              >
                {item.ingredient.name}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="rounded-full p-0.5 hover:bg-black/5"
                  aria-label={`Quitar ${item.ingredient.name}`}
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 text-sm text-muted-foreground">{countLabel}</p>

      <AddIngredientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(ingredientId: string) => addIngredient(ingredientId)}
      />
    </article>
  );
}
