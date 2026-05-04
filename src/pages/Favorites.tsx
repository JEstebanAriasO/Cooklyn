import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";

const Favorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      const res = await fetch(`http://localhost:3000/api/favorites/${userId}`);
      const data = await res.json();
      setFavorites(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchFavorites();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="font-display text-4xl font-700 text-foreground flex items-center gap-3">
        <Heart className="text-primary h-9 w-9 fill-primary/20" aria-hidden />
        Mis favoritos
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-[2rem] border border-border shadow-inner">
          <p className="text-muted-foreground italic">No tienes recetas favoritas aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((recipe: any) => (
            <Link
              key={recipe.id}
              to={`/recetas/${recipe.id}`}
              className="bg-card p-6 rounded-[2rem] border border-border hover:border-primary/40 transition-all group shadow-soft hover:shadow-card"
            >
              <h3 className="font-display text-xl font-700 group-hover:text-primary transition-colors">{recipe.title}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
