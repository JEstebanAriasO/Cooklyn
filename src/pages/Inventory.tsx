import { useState, useEffect } from 'react';
import { Plus, Package, Loader2 } from 'lucide-react';
import { ingredientService } from '../services/ingredientService';

const Inventory = () => {
    // Cambiamos el estado estático por uno que inicie vacío
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hook para cargar datos al montar el componente
    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const data = await ingredientService.getAll();
            setIngredients(data);
        } catch (error) {
            console.error("Error cargando ingredientes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddIngredient = async () => {
        const name = prompt("Nombre del nuevo ingrediente:");
        if (!name) return;

        try {
            // Guardamos en la base de datos[cite: 1]
            await ingredientService.create(name, "General");
            // Refrescamos la lista para ver el cambio[cite: 1]
            fetchIngredients();
        } catch (error) {
            alert("No se pudo guardar el ingrediente");
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
                    <Package className="text-orange-500" /> Mi Despensa
                </h1>
                <button
                    onClick={handleAddIngredient}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-all shadow-md active:scale-95"
                >
                    <Plus size={20} /> Agregar Ingrediente
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {ingredients.length === 0 ? (
                        <p className="text-center text-slate-500 py-10 italic">No hay ingredientes en tu despensa.</p>
                    ) : (
                        ingredients.map((item: any) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm hover:border-orange-200 transition-colors">
                                <span className="font-medium text-slate-700">{item.name}</span>
                                <span className="text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs">
                                    {item.quantity || 'Sin cantidad'}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Inventory;