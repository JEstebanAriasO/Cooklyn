import { useEffect, useState } from 'react';
import { recipeService } from '../services/recipeService';
import { Utensils } from 'lucide-react';

interface RecipesProps {
    onSelectRecipe: (id: string) => void;
}

const Recipes = ({ onSelectRecipe }: RecipesProps) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                // En una fase real, el ID vendría del usuario logueado[cite: 1]
                const data = await recipeService.getAll();
                setRecipes(data);
            } catch (error) {
                console.error("Error al cargar recetas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    if (loading) return <p className="text-center mt-10">Buscando recetas...</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Utensils className="text-orange-500" /> Recetas Disponibles
            </h1>

            {recipes.length === 0 ? (
                <p className="text-slate-500 text-center py-10">
                    No hay recetas que coincidan con tus ingredientes todavía.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.map((recipe: any) => (
                        <div key={recipe.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="h-48 bg-slate-200 flex items-center justify-center text-slate-400">
                                {/* Aquí irá la imagen de la receta después */}
                                Sin imagen
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-slate-800">{recipe.title}</h3>
                                <p className="text-slate-500 text-sm mt-1 line-clamp-2">{recipe.description}</p>
                                <button
                                    onClick={() => onSelectRecipe(recipe.id)}
                                    className="mt-4 w-full bg-orange-100 text-orange-600 font-semibold py-2 rounded-lg hover:bg-orange-200 transition-colors"
                                >
                                    Ver Receta
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Recipes;