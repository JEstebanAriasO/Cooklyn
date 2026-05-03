import { useState, useEffect } from 'react';
import { Package, Plus, Trash2 } from 'lucide-react';
import AddIngredientModal from '../components/ui/AddIngredientModal';

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userId = localStorage.getItem('user_id');

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
            await fetch('http://localhost:3000/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ingredientId, quantity: "1 unidad" }),
            });
            setIsModalOpen(false);
            fetchInventory();
        } catch (error) {
            console.error("Error al añadir ingrediente:", error);
        }
    };

    // Función para eliminar un ingrediente del inventario
    const handleDelete = async (itemId: string) => {
        try {
            const res = await fetch(`http://localhost:3000/api/inventory/${itemId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Actualizamos la lista localmente para que el cambio sea inmediato
                fetchInventory();
            }
        } catch (error) {
            console.error("Error al eliminar el ingrediente:", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mi Despensa</h1>
                    <p className="text-slate-500">Gestiona tus ingredientes para obtener recetas.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-orange-500 transition-all shadow-lg shadow-slate-200"
                >
                    <Plus size={20} /> Añadir
                </button>
            </div>

            <div className="grid gap-3">
                {inventory.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 italic">Tu despensa está vacía.</p>
                    </div>
                ) : (
                    inventory.map((item: any) => (
                        <div key={item.id} className="bg-white p-5 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-orange-300 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-orange-500">
                                    <Package size={24} />
                                </div>
                                <span className="font-bold text-slate-800 text-lg">{item.ingredient.name}</span>
                            </div>

                            {/* Botón de eliminación conectado a handleDelete */}
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <AddIngredientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAdd}
            />
        </div>
    );
};

export default Inventory;