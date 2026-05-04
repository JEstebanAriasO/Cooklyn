import { useState, useEffect } from "react";
import { Sparkles, Utensils } from "lucide-react";

const Dashboard = ({ onSelectRecipe }: { onSelectRecipe: (id: string) => void }) => {
  const [matches, setMatches] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchMatches = async () => {
      const res = await fetch(`http://localhost:3000/api/recipes/match/${userId}`);
      const data = await res.json();
      setMatches(data);
    };
    fetchMatches();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="font-display text-3xl font-700 text-foreground flex items-center gap-2">
          ¡Hola, Esteban! <Sparkles className="text-primary" aria-hidden />
        </h1>
        <p className="text-muted-foreground italic">Esto es lo que puedes cocinar con lo que tienes ahora mismo:</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.length > 0 ? (
          matches.map((recipe: any) => (
            <button
              key={recipe.id}
              type="button"
              onClick={() => onSelectRecipe(recipe.id)}
              className="bg-card p-6 rounded-[2rem] border border-border text-left hover:border-primary/40 transition-all group shadow-soft hover:shadow-card"
            >
              <h3 className="font-display text-xl font-700 text-card-foreground mb-2 group-hover:text-primary transition-colors">
                {recipe.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Utensils size={16} aria-hidden /> <span>{recipe.ingredients.length} ingredientes</span>
              </div>
            </button>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted rounded-[2rem] border-2 border-dashed border-border">
            <p className="text-muted-foreground">No tienes ingredientes suficientes para ninguna receta completa.</p>
            <p className="text-sm text-muted-foreground font-700 mt-2 underline">¡Ve a tu despensa y agrega más!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
