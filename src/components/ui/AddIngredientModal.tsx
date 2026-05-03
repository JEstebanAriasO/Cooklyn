import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Loader2 } from 'lucide-react';

const AddIngredientModal = ({ isOpen, onClose, onAdd }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
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
        }, 300); // Debounce para no saturar el servidor de Express
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">Agregar Ingrediente</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            autoFocus
                            type="text"
                            className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="Ej: Cebolla, Huevo, Leche..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-orange-500" /></div>
                        ) : results.length > 0 ? (
                            results.map((ing: any) => (
                                <button
                                    key={ing.id}
                                    onClick={() => onAdd(ing.id, ing.name)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-orange-50 rounded-2xl border border-transparent hover:border-orange-200 transition-all group"
                                >
                                    <span className="font-semibold text-slate-700">{ing.name}</span>
                                    <Plus size={18} className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))
                        ) : searchTerm.length > 1 ? (
                            <p className="text-center text-slate-400 py-8">No se encontró ese ingrediente</p>
                        ) : (
                            <p className="text-center text-slate-400 py-8 italic">Empieza a escribir para buscar...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddIngredientModal;