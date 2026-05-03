import { useEffect, useState } from 'react';
import { ChevronLeft, Clock, ChefHat, CheckCircle, Loader2 } from 'lucide-react';

const RecipeDetail = ({ recipeId, onBack }: { recipeId: string, onBack: () => void }) => {
    const [recipe, setRecipe] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isCooking, setIsCooking] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                // Obtenemos los detalles reales desde tu API
                const res = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
                const data = await res.json();
                setRecipe(data);
            } catch (error) {
                console.error("Error al cargar la receta:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    const handleCook = async () => {
        const userId = localStorage.getItem('user_id');
        setIsCooking(true);

        try {
            const res = await fetch('http://localhost:3000/api/recipes/cook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, recipeId }),
            });

            if (res.ok) {
                alert("¡Buen provecho! Se han descontado los ingredientes de tu despensa.");
                onBack(); // Regresamos a la lista principal
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
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-orange-500 w-12 h-12" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-orange-500 mb-6 transition-colors font-medium">
                <ChevronLeft size={20} /> Volver a recetas
            </button>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl shadow-slate-100">
                {/* Cabecera con Imagen */}
                <div className="h-72 bg-slate-100 flex items-center justify-center text-slate-400 relative">
                    <img
                        src={`https://source.unsplash.com/800x600/?cooking,${recipe?.title}`}
                        alt={recipe?.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="p-10">
                    <h1 className="text-4xl font-black text-slate-900 mb-6">{recipe?.title}</h1>

                    <div className="flex gap-4 mb-10">
                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl text-sm font-bold">
                            <Clock size={18} className="text-orange-500" /> {recipe?.cookingTime || '20'} min
                        </div>
                        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl text-sm font-bold">
                            <ChefHat size={18} className="text-orange-500" /> {recipe?.difficulty || 'Media'}
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-5">Ingredientes necesarios</h2>
                    <div className="grid gap-3 mb-10">
                        {recipe?.ingredients?.map((ri: any) => (
                            <div key={ri.id} className="flex items-center gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                                <span className="text-slate-700 font-medium">
                                    {ri.quantity} de <span className="font-bold">{ri.ingredient.name}</span>
                                </span>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-5">Instrucciones de preparación</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg mb-10">
                        {recipe?.instructions}
                    </p>

                    {/* Botón de Acción Principal */}
                    <button
                        onClick={handleCook}
                        disabled={isCooking}
                        className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] hover:bg-orange-500 transition-all duration-300 shadow-lg flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
                    >
                        {isCooking ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <CheckCircle size={24} />
                                ¡Cocinar esta receta!
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;