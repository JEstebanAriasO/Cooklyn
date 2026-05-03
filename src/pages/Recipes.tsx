import { useEffect, useState } from 'react';
import { recipeService } from '../services/recipeService';
import HealthFilter from '../components/ui/HealthFilter';
import { Utensils, Filter, Loader2 } from 'lucide-react';

interface RecipesProps {
    onSelectRecipe: (id: string) => void;
}

const Recipes = ({ onSelectRecipe }: RecipesProps) => {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
    const [restrictions, setRestrictions] = useState<any[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Cargar datos iniciales (Recetas y Restricciones)
    useEffect(() => {
        const loadData = async () => {
            try {
                const [recipesData, restrictionsData] = await Promise.all([
                    recipeService.getAll(),
                    fetch('http://localhost:3000/api/restrictions').then(res => res.json())
                ]);
                setRecipes(recipesData);
                setFilteredRecipes(recipesData);
                setRestrictions(restrictionsData);
            } catch (error) {
                console.error("Error cargando datos de Cooklyn:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // 2. Lógica de filtrado en el Frontend
    useEffect(() => {
        if (selectedFilters.length === 0) {
            setFilteredRecipes(recipes);
        } else {
            // Filtramos las recetas que tengan al menos una de las etiquetas seleccionadas
            const filtered = recipes.filter(recipe =>
                recipe.ingredients.some((ri: any) =>
                    // Aquí podrías filtrar por categorías o etiquetas médicas asociadas
                    selectedFilters.includes(ri.ingredient.category || '')
                )
            );
            setFilteredRecipes(filtered);
        }
    }, [selectedFilters, recipes]);

    const toggleFilter = (id: string) => {
        setSelectedFilters(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Buscando las mejores recetas para ti...</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Utensils className="text-orange-500" />
                    ¿Qué cocinamos hoy?
                </h1>
                <p className="text-slate-500 mt-2">
                    Basado en los ingredientes de tu despensa y tus preferencias.
                </p>
            </header>

            {/* Componente de Filtros Médicos/Salud */}
            <HealthFilter
                restrictions={restrictions}
                selected={selectedFilters}
                onChange={toggleFilter}
            />

            <div className="flex items-center gap-2 mb-6 text-slate-600">
                <Filter size={18} />
                <span className="text-sm font-medium">
                    Mostrando {filteredRecipes.length} recetas
                </span>
            </div>

            {filteredRecipes.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                    <p className="text-slate-400 text-lg">
                        No encontramos recetas con esos filtros. <br />
                        ¡Prueba agregando más ingredientes a tu inventario!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRecipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="h-48 bg-slate-100 relative">
                                {recipe.imageUrl ? (
                                    <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 uppercase tracking-widest font-bold">
                                        Cooklyn
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
                                    {recipe.difficulty || 'Media'}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-orange-500 transition-colors">
                                    {recipe.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                    {recipe.description || 'Haz clic para ver los ingredientes y pasos de preparación.'}
                                </p>

                                <button
                                    onClick={() => onSelectRecipe(recipe.id)}
                                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-2xl hover:bg-orange-500 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-orange-200"
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