import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface AddIngredientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (ingredientId: string) => void;
}

const AddIngredientModal = ({ isOpen, onClose, onAdd }: AddIngredientModalProps) => {
    const [selectedIngredient, setSelectedIngredient] = useState('');

    // Lista de ejemplo de ingredientes, en producción vendría de la API
    const ingredients = [
        { id: '1', name: 'Arroz' },
        { id: '2', name: 'Huevo' },
        { id: '3', name: 'Leche' },
        { id: '4', name: 'Pan' },
    ];

    const handleAdd = () => {
        if (selectedIngredient) {
            onAdd(selectedIngredient);
            setSelectedIngredient('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900">Añadir Ingrediente</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                <select
                    value={selectedIngredient}
                    onChange={(e) => setSelectedIngredient(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-2xl mb-4"
                >
                    <option value="">Seleccionar ingrediente</option>
                    {ingredients.map((ing) => (
                        <option key={ing.id} value={ing.id}>{ing.name}</option>
                    ))}
                </select>
                <button
                    onClick={handleAdd}
                    disabled={!selectedIngredient}
                    className="w-full bg-orange-500 text-white py-3 rounded-2xl font-bold hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                    <Plus size={18} className="inline mr-2" /> Añadir
                </button>
            </div>
        </div>
    );
};

export default AddIngredientModal;