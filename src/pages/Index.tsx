import { useState, useEffect } from 'react';
import { Sparkles, Utensils, ArrowRight, PackageOpen } from 'lucide-react';

const Index = ({ onSelectRecipe, onGoToInventory }: {
    onSelectRecipe: (id: string) => void,
    onGoToInventory: () => void
}) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name') || 'Chef';

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                // Endpoint que creamos para filtrar recetas según inventario[cite: 2]
                const res = await fetch(`http://localhost:3000/api/recipes/match/${userId}`);
                const data = await res.json();
                setMatches(data);
            } catch (error) {
                console.error("Error al obtener sugerencias:", error);
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchMatches();
    }, [userId]);

    return (
        <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                        Panel de Control
                    </span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    ¡Qué bueno verte, {userName}! <Sparkles className="inline text-orange-500" />
                </h1>
                <p className="text-slate-500 text-lg mt-2">
                    Hoy tienes ingredientes para preparar estas delicias:
                </p>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[2.5rem]" />
                    ))}
                </div>
            ) : matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {matches.map((recipe: any) => (
                        <div
                            key={recipe.id}
                            onClick={() => onSelectRecipe(recipe.id)}
                            className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-orange-400 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-orange-100/50 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-500" />

                            <div className="relative z-10">
                                <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-orange-600 transition-colors">
                                    {recipe.title}
                                </h3>
                                <div className="flex items-center gap-4 text-slate-500 font-bold text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Utensils size={16} className="text-orange-500" />
                                        <span>{recipe.ingredients?.length} ingredientes</span>
                                    </div>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <div className="flex items-center gap-1.5 group-hover:text-orange-500 transition-colors">
                                        Ver receta <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-4 border-dashed border-white shadow-inner">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-md flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <PackageOpen size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Despensa incompleta</h2>
                    <p className="text-slate-500 max-w-xs mx-auto mb-8">
                        No tienes suficientes ingredientes para ninguna receta completa en este momento.
                    </p>
                    <button
                        onClick={onGoToInventory}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-orange-500 transition-all shadow-lg"
                    >
                        Ir a mi Inventario
                    </button>
                </div>
            )}
        </div>
    );
};

export default Index;