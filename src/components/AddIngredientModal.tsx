import { useState } from "react";
import { X, Plus } from "lucide-react";

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (ingredientId: string) => void;
}

const AddIngredientModal = ({ isOpen, onClose, onAdd }: AddIngredientModalProps) => {
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const ingredients = [
    { id: "1", name: "Arroz" },
    { id: "2", name: "Huevo" },
    { id: "3", name: "Leche" },
    { id: "4", name: "Pan" },
  ];

  const handleAdd = () => {
    if (selectedIngredient) {
      onAdd(selectedIngredient);
      setSelectedIngredient("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-secondary/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-3xl p-6 w-full max-w-md border border-border shadow-card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl font-700 text-foreground">Añadir ingrediente</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} aria-hidden />
          </button>
        </div>
        <select
          value={selectedIngredient}
          onChange={(e) => setSelectedIngredient(e.target.value)}
          className="w-full p-3 border border-border bg-muted rounded-2xl mb-4 text-foreground"
        >
          <option value="">Seleccionar ingrediente</option>
          {ingredients.map((ing) => (
            <option key={ing.id} value={ing.id}>
              {ing.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedIngredient}
          className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-700 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-soft"
        >
          <Plus size={18} className="inline mr-2" aria-hidden /> Añadir
        </button>
      </div>
    </div>
  );
};

export default AddIngredientModal;
