import { useEffect, useState } from 'react';
import { ChevronLeft, Clock, ChefHat } from 'lucide-react';

const RecipeDetail = ({ recipeId, onBack }: { recipeId: string, onBack: () => void }) => {
    const [recipe, setRecipe] = useState<any>(null);

    useEffect(() => {
        // Aquí llamaríamos a recipeService.getById(recipeId)
        // Por ahora, para probar la UI, simulamos la carga de datos.
        setRecipe({ title: 'Arroz con Huevo' });
    }, [recipeId]);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-orange-500 mb-6 transition-colors">
                <ChevronLeft size={20} /> Volver a recetas
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="h-64 bg-slate-100 flex items-center justify-center text-slate-400">
                    Imagen de la Receta
                </div>

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">{recipe?.title || "Arroz con Huevo"}</h1>

                    <div className="flex gap-6 mb-8">
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full text-sm">
                            <Clock size={18} className="text-orange-500" /> 15 min
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full text-sm">
                            <ChefHat size={18} className="text-orange-500" /> Fácil
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4">Ingredientes necesarios</h2>
                    <ul className="grid gap-2 mb-8">
                        <li className="flex items-center gap-2 text-slate-700">
                            <div className="w-2 h-2 bg-orange-500 rounded-full" /> 1 taza de Arroz
                        </li>
                        <li className="flex items-center gap-2 text-slate-700">
                            <div className="w-2 h-2 bg-orange-500 rounded-full" /> 2 Huevos
                        </li>
                    </ul>

                    <h2 className="text-xl font-semibold mb-4">Instrucciones</h2>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                        1. Cocina el arroz con dos tazas de agua y sal al gusto.
                        2. En una sartén aparte, fríe los huevos con un poco de aceite.
                        3. Sirve el arroz caliente y coloca los huevos encima. ¡Disfruta!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;