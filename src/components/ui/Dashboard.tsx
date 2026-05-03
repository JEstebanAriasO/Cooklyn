// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Sparkles, Utensils } from 'lucide-react';

const Dashboard = ({ onSelectRecipe }: { onSelectRecipe: (id: string) => void }) => {
    const [matches, setMatches] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchMatches = async () => {
            const res = await fetch(`http://localhost:3000/api/recipes/match/${userId}`);
            const data = await res.json();
            setMatches(data);
        };
        fetchMatches();
    }, [userId]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
                    ¡Hola, Esteban! <Sparkles className="text-orange-500" />
                </h1>
                <p className="text-slate-500 italic">Esto es lo que puedes cocinar con lo que tienes ahora mismo:</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.length > 0 ? (
                    matches.map((recipe: any) => (
                        <button
                            key={recipe.id}
                            onClick={() => onSelectRecipe(recipe.id)}
                            className="bg-white p-6 rounded-[2rem] border border-slate-200 text-left hover:border-orange-400 transition-all group shadow-sm hover:shadow-md"
                        >
                            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-orange-600 transition-colors">
                                {recipe.title}
                            </h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                <Utensils size={16} /> <span>{recipe.ingredients.length} ingredientes</span>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-slate-100 rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400">No tienes ingredientes suficientes para ninguna receta completa.</p>
                        <p className="text-sm text-slate-400 font-bold mt-2 underline">¡Ve a tu despensa y agrega más!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;