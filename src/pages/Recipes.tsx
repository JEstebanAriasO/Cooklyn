import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { recipeService } from "../services/recipeService";
import HealthFilter from "../components/ui/HealthFilter";
import { Utensils, Filter, Loader2 } from "lucide-react";

const Recipes = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [restrictions, setRestrictions] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [recipesData, restrictionsData] = await Promise.all([
          recipeService.getAll(),
          fetch("http://localhost:3000/api/restrictions").then((res) => res.json()),
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

  useEffect(() => {
    if (selectedFilters.length === 0) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.ingredients.some((ri: any) => selectedFilters.includes(ri.ingredient.category || "")),
      );
      setFilteredRecipes(filtered);
    }
  }, [selectedFilters, recipes]);

  const toggleFilter = (id: string) => {
    setSelectedFilters((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-muted-foreground font-medium">Buscando las mejores recetas para ti...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="font-display text-4xl font-700 text-foreground flex items-center gap-3">
          <Utensils className="text-primary h-9 w-9" aria-hidden />
          ¿Qué cocinamos hoy?
        </h1>
        <p className="text-muted-foreground mt-2">Basado en los ingredientes de tu despensa y tus preferencias.</p>
      </header>

      <HealthFilter restrictions={restrictions} selected={selectedFilters} onChange={toggleFilter} />

      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter size={18} aria-hidden />
        <span className="text-sm font-medium">Mostrando {filteredRecipes.length} recetas</span>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="bg-card border-2 border-dashed border-border rounded-3xl p-12 text-center shadow-soft">
          <p className="text-muted-foreground text-lg">
            No encontramos recetas con esos filtros. <br />
            ¡Prueba agregando más ingredientes a tu inventario!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="group bg-card rounded-3xl border border-border overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-48 bg-muted relative">
                {recipe.imageUrl ? (
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground uppercase tracking-widest font-700">
                    Cooklyn
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-card/90 backdrop-blur px-3 py-1 rounded-full text-xs font-700 text-primary shadow-soft">
                  {recipe.difficulty || "Media"}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-display font-700 text-xl text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {recipe.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {recipe.description || "Haz clic para ver los ingredientes y pasos de preparación."}
                </p>

                <Link
                  to={`/recetas/${recipe.id}`}
                  className="inline-flex w-full justify-center rounded-2xl bg-secondary px-4 py-3 text-center text-sm font-700 text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-soft"
                >
                  Ver receta
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
