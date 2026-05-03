// src/pages/Favorites.tsx
import { useState, useEffect } from 'react';
import { Heart, Utensils, Loader2 } from 'lucide-react';

const Favorites = ({ onSelectRecipe }: { onSelectRecipe: (id: string) => void }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchFavorites = async () => {
            const res = await fetch(`http://localhost:3000/api/favorites/${userId}`);
            const data = await res.json();
            setFavorites(data);
            setLoading(false);
        };
        fetchFavorites();
    }, [userId]);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" /></div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-2">
                Mis Favoritos
            </h1>

            {/* Agregamos validación: Array.isArray(favorites) */}
            {!Array.isArray(favorites) || favorites.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-200 shadow-inner">
                    <p className="text-slate-400 italic">No tienes recetas favoritas aún.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((recipe: any) => (
                        <div
                            key={recipe.id}
                            onClick={() => onSelectRecipe(recipe.id)}
                            className="bg-white p-6 rounded-[2rem] border border-slate-200 hover:border-orange-400 transition-all cursor-pointer group"
                        >
                            <h3 className="text-xl font-bold group-hover:text-orange-500">{recipe.title}</h3>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;