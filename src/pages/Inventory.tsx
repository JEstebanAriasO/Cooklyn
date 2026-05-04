import { useState, useEffect } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import AddIngredientModal from "../components/ui/AddIngredientModal";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = localStorage.getItem("user_id");

  const fetchInventory = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/inventory/${userId}`);
      const data = await res.json();
      setInventory(data);
    } catch (error) {
      console.error("Error al obtener el inventario:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchInventory();
  }, [userId]);

  const handleAdd = async (ingredientId: string) => {
    try {
      await fetch("http://localhost:3000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ingredientId, quantity: "1 unidad" }),
      });
      setIsModalOpen(false);
      fetchInventory();
    } catch (error) {
      console.error("Error al añadir ingrediente:", error);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/inventory/${itemId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchInventory();
      }
    } catch (error) {
      console.error("Error al eliminar el ingrediente:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-700 text-foreground tracking-tight">Mi despensa</h1>
          <p className="text-muted-foreground">Gestiona tus ingredientes para obtener recetas.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-secondary text-secondary-foreground px-6 py-3 rounded-2xl font-700 flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-smooth shadow-soft"
        >
          <Plus size={20} aria-hidden /> Añadir
        </button>
      </div>

      <div className="grid gap-3">
        {inventory.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
            <p className="text-muted-foreground italic">Tu despensa está vacía.</p>
          </div>
        ) : (
          inventory.map((item: any) => (
            <div
              key={item.id}
              className="bg-card p-5 rounded-3xl border border-border flex justify-between items-center group hover:border-primary/30 transition-all shadow-soft"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-primary">
                  <Package size={24} aria-hidden />
                </div>
                <span className="font-700 text-card-foreground text-lg">{item.ingredient.name}</span>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} aria-hidden />
              </button>
            </div>
          ))
        )}
      </div>

      <AddIngredientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAdd} />
    </div>
  );
};

export default Inventory;
