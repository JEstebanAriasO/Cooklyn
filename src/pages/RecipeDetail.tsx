import { useEffect, useState } from 'react';
import {
    ChevronLeft, Clock, ChefHat, CheckCircle,
    Loader2, ShoppingCart, AlertCircle, Heart
} from 'lucide-react';

const RecipeDetail = ({ recipeId, onBack }: { recipeId: string, onBack: () => void }) => {
    const [recipe, setRecipe] = useState<any>(null);
    const [missingIngredients, setMissingIngredients] = useState<any[]>([]);
    const [isFavorite, setIsFavorite] = useState(false); // Estado para el corazón
    const [loading, setLoading] = useState(true);
    const [isCooking, setIsCooking] = useState(false);

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchRecipeData = async () => {
            try {
                // 1. Cargar detalles de la receta[cite: 12]
                const recipeRes = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
                const recipeData = await recipeRes.json();
                setRecipe(recipeData);

                // 2. Cargar ingredientes faltantes[cite: 12]
                const missingRes = await fetch(`http://localhost:3000/api/recipes/${recipeId}/missing-ingredients/${userId}`);
                const missingData = await missingRes.json();
                setMissingIngredients(missingData);

                // 3. Verificar si ya es favorita (Petición opcional al backend o check local)
                const favRes = await fetch(`http://localhost:3000/api/favorites/${userId}`);
                const favs = await favRes.json();
                setIsFavorite(favs.some((f: any) => f.id === recipeId));

            } catch (error) {
                console.error("Error al cargar datos:", error);
            } finally {
                setLoading(false);
            }
        };

        if (recipeId && userId) fetchRecipeData();
    }, [recipeId, userId]);

    // Función para guardar/quitar de favoritos
    const toggleFavorite = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/favorites/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, recipeId }),
            });
            const data = await res.json();
            setIsFavorite(data.isFavorite);
        } catch (err) {
            console.error("Error al actualizar favoritos");
        }
    };

    const handleCook = async () => {
        setIsCooking(true);
        try {
            const res = await fetch('http://localhost:3000/api/recipes/cook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, recipeId }),
            });

            if (res.ok) {
                alert("¡Buen provecho! Ingredientes descontados de tu despensa.");
                onBack();
            } else {
                const error = await res.json();
                alert(error.error || "Algo salió mal al cocinar.");
            }
        } catch (err) {
            alert("Error de conexión con el servidor.");
        } finally {
            setIsCooking(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin text-orange-500 mr-2" /> Analizando ingredientes...
        </div>
    );

    const canCook = missingIngredients.length === 0;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-orange-500 mb-6 transition-colors font-medium">
                <ChevronLeft size={20} /> Volver a recetas
            </button>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-100">
                <div className="h-72 bg-slate-100 flex items-center justify-center text-slate-400 relative">
                    <img
                        src={`https://source.unsplash.com/800x600/?cooking,${recipe?.title}`}
                        alt={recipe?.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="p-10">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{recipe?.title}</h1>
                        <button
                            onClick={toggleFavorite}
                            className={`p-4 rounded-2xl transition-all shadow-sm border ${isFavorite
                                    ? 'bg-rose-50 border-rose-100 text-rose-500'
                                    : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-rose-400'
                                }`}
                        >
                            <Heart size={24} className={isFavorite ? "fill-rose-500" : ""} />
                        </button>
                    </div>

                    <div className="flex gap-4 mb-10">
                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl text-sm font-bold">
                            <Clock size={18} className="text-orange-500" /> {recipe?.cookingTime || '20'} min
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl text-sm font-bold">
                            <ChefHat size={18} className="text-orange-500" /> {recipe?.difficulty || 'Media'}
                        </div>
                    </div>

                    {/* SECCIÓN DE INGREDIENTES FALTANTES[cite: 12] */}
                    {missingIngredients.length > 0 && (
                        <div className="mb-10 p-6 bg-rose-50 border border-rose-100 rounded-3xl">
                            <h3 className="text-rose-800 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <ShoppingCart size={18} /> Te faltan estos ingredientes:
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {missingIngredients.map((mi: any) => (
                                    <div key={mi.id || mi.ingredientId} className="flex items-center gap-2 text-rose-600 bg-white/50 p-2 rounded-xl border border-rose-200/50 text-sm">
                                        <AlertCircle size={14} />
                                        <span className="font-semibold">{mi.ingredient.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-slate-800 mb-5">Ingredientes necesarios</h2>
                    <div className="grid gap-3 mb-10">
                        {recipe?.ingredients?.map((ri: any) => {
                            const isMissing = missingIngredients.some(mi => mi.ingredientId === ri.ingredientId);
                            return (
                                <div key={ri.id || ri.ingredientId} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${isMissing ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-orange-50/50 border-orange-100/50'}`}>
                                    <div className={`w-2.5 h-2.5 rounded-full ${isMissing ? 'bg-slate-300' : 'bg-orange-500'}`} />
                                    <span className={`font-medium ${isMissing ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                        {ri.quantity || '1 unidad'} de <span className="font-bold">{ri.ingredient.name}</span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-5">Instrucciones</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        {recipe?.instructions}
                    </p>

                    <button
                        onClick={handleCook}
                        disabled={isCooking || !canCook}
                        className={`w-full font-black py-5 rounded-[1.5rem] shadow-lg flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98]
                            ${canCook
                                ? 'bg-slate-900 text-white hover:bg-orange-500'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'}`}
                    >
                        {isCooking ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : canCook ? (
                            <><CheckCircle size={24} /> ¡Cocinar esta receta!</>
                        ) : (
                            <><ShoppingCart size={24} /> Faltan ingredientes</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;