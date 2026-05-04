import { useState, useEffect } from "react";
import { X, Search, Plus, Loader2 } from "lucide-react";

const AddIngredientModal = ({ isOpen, onClose, onAdd }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.length > 1) {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:3000/api/ingredients/search?q=${searchTerm}`);
          const data = await res.json();
          setResults(data);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card w-full max-w-lg rounded-3xl shadow-card overflow-hidden animate-in fade-in zoom-in duration-200 border border-border">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/50">
          <h2 className="font-display text-xl font-700 text-foreground">Agregar ingrediente</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={20} className="text-muted-foreground" aria-hidden />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden />
            <input
              autoFocus
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-muted border-none rounded-2xl focus:ring-2 focus:ring-ring outline-none transition-smooth"
              placeholder="Ej: Cebolla, huevo, leche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-primary" aria-hidden />
              </div>
            ) : results.length > 0 ? (
              results.map((ing: any) => (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => onAdd(ing.id, ing.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-primary/10 rounded-2xl border border-transparent hover:border-primary/30 transition-all group"
                >
                  <span className="font-semibold text-foreground">{ing.name}</span>
                  <Plus size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden />
                </button>
              ))
            ) : searchTerm.length > 1 ? (
              <p className="text-center text-muted-foreground py-8">No se encontró ese ingrediente</p>
            ) : (
              <p className="text-center text-muted-foreground py-8 italic">Empieza a escribir para buscar...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIngredientModal;
