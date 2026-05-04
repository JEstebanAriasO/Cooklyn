import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  ChefHat,
  CheckCircle,
  Loader2,
  ShoppingCart,
  AlertCircle,
  Heart,
} from "lucide-react";
import { recipePlaceholder, resolveRecipeImage } from "@/lib/recipeImages";

/** Soporta "1. Paso. 2. Paso." (seed) o una línea por paso. */
function parseInstructionSteps(raw: string | undefined | null): string[] {
  if (!raw?.trim()) return [];
  const trimmed = raw.trim();
  if (/\d+\.\s/.test(trimmed)) {
    const parts = trimmed.split(/\s*(?=\d+\.\s)/).filter(Boolean);
    const steps = parts.map((p) => p.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
    if (steps.length > 0) return steps;
  }
  return trimmed
    .split(/\n+/)
    .map((s) => s.replace(/^\d+[\).\s]+/, "").trim())
    .filter(Boolean);
}

const RecipeDetail = () => {
  const { id: recipeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<any>(null);
  const [missingIngredients, setMissingIngredients] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isCooking, setIsCooking] = useState(false);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!recipeId) return;
    const fetchRecipeData = async () => {
      try {
        const recipeRes = await fetch(`http://localhost:3000/api/recipes/${recipeId}`);
        if (!recipeRes.ok) {
          setRecipe(null);
          return;
        }
        const recipeData = await recipeRes.json();
        setRecipe(recipeData);

        if (userId) {
          const missingRes = await fetch(`http://localhost:3000/api/recipes/${recipeId}/missing-ingredients/${userId}`);
          const missingData = await missingRes.json();
          setMissingIngredients(Array.isArray(missingData) ? missingData : []);

          const favRes = await fetch(`http://localhost:3000/api/favorites/${userId}`);
          const favs = await favRes.json();
          const list = Array.isArray(favs) ? favs : [];
          setIsFavorite(list.some((f: any) => f.id === recipeId));
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [recipeId, userId]);

  const toggleFavorite = async () => {
    if (!userId || !recipeId) return;
    try {
      const res = await fetch("http://localhost:3000/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, recipeId }),
      });
      const data = await res.json();
      setIsFavorite(data.isFavorite);
    } catch {
      console.error("Error al actualizar favoritos");
    }
  };

  const handleCook = async () => {
    if (!userId || !recipeId) return;
    setIsCooking(true);
    try {
      const res = await fetch("http://localhost:3000/api/recipes/cook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, recipeId }),
      });

      if (res.ok) {
        alert("¡Buen provecho! Ingredientes descontados de tu despensa.");
        navigate("/historial");
      } else {
        const error = await res.json().catch(() => ({}));
        alert(error.error || "Algo salió mal al cocinar.");
      }
    } catch {
      alert("Error de conexión con el servidor.");
    } finally {
      setIsCooking(false);
    }
  };

  if (!recipeId) {
    return (
      <p className="text-center text-muted-foreground">
        Receta no válida. <Link to="/recetas">Volver</Link>
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        <Loader2 className="animate-spin text-primary mr-2" aria-hidden /> Analizando ingredientes...
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Receta no encontrada.</p>
        <Link to="/recetas" className="text-primary font-medium hover:underline">
          Volver a recetas
        </Link>
      </div>
    );
  }

  const canCook = userId ? missingIngredients.length === 0 : false;
  const imageUrl = resolveRecipeImage(recipe);
  const instructionSteps = parseInstructionSteps(recipe?.instructions);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
      >
        <ChevronLeft size={20} aria-hidden /> Volver
      </button>

      <div className="bg-card rounded-[2.5rem] border border-border overflow-hidden shadow-card">
        <div className="h-72 bg-muted flex items-center justify-center text-muted-foreground relative">
          <img
            src={imageUrl}
            alt={recipe?.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = recipePlaceholder(String(recipe?.title ?? "Cooklyn"));
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="p-10">
          <div className="flex justify-between items-start mb-6 gap-4">
            <h1 className="font-display text-4xl font-700 text-foreground tracking-tight">{recipe?.title}</h1>
            {userId && (
              <button
                type="button"
                onClick={toggleFavorite}
                className={`p-4 rounded-2xl transition-all shadow-soft border shrink-0 ${
                  isFavorite
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : "bg-muted border-border text-muted-foreground hover:text-destructive"
                }`}
                aria-pressed={isFavorite}
              >
                <Heart size={24} className={isFavorite ? "fill-destructive text-destructive" : ""} />
              </button>
            )}
          </div>

          <div className="flex gap-4 mb-10 flex-wrap">
            <div className="flex items-center gap-2 text-foreground bg-muted border border-border px-5 py-2.5 rounded-2xl text-sm font-700">
              <Clock size={18} className="text-primary" aria-hidden /> {recipe?.cookingTime || "20"} min
            </div>
            <div className="flex items-center gap-2 text-foreground bg-muted border border-border px-5 py-2.5 rounded-2xl text-sm font-700">
              <ChefHat size={18} className="text-primary" aria-hidden /> {recipe?.difficulty || "Media"}
            </div>
          </div>

          {userId && missingIngredients.length > 0 && (
            <div className="mb-10 p-6 bg-warning/10 border border-warning/30 rounded-3xl">
              <h3 className="text-warning font-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <ShoppingCart size={18} aria-hidden /> Te faltan estos ingredientes:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {missingIngredients.map((mi: any) => (
                  <div
                    key={mi.id || mi.ingredientId}
                    className="flex items-center gap-2 text-warning bg-card/80 p-2 rounded-xl border border-warning/20 text-sm"
                  >
                    <AlertCircle size={14} aria-hidden />
                    <span className="font-semibold">{mi.ingredient.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="font-display text-2xl font-700 text-foreground mb-5">Ingredientes necesarios</h2>
          <div className="grid gap-3 mb-10">
            {recipe?.ingredients?.map((ri: any) => {
              const isMissing = userId
                ? missingIngredients.some((mi) => mi.ingredientId === ri.ingredientId)
                : false;
              return (
                <div
                  key={ri.id || ri.ingredientId}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                    isMissing ? "bg-muted border-border opacity-60" : "bg-primary/5 border-primary/20"
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${isMissing ? "bg-muted-foreground/40" : "bg-primary"}`} />
                  <span className={`font-medium ${isMissing ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {ri.quantity || "1 unidad"} de <span className="font-700">{ri.ingredient.name}</span>
                  </span>
                </div>
              );
            })}
          </div>

          <section
            className="mb-10 rounded-2xl bg-[#faf9f6] px-6 py-8 sm:px-8 sm:py-10"
            aria-labelledby="recipe-step-instructions-heading"
          >
            <h2
              id="recipe-step-instructions-heading"
              className="font-display text-2xl font-700 tracking-tight text-[#3d4f5c] mb-8 sm:mb-10 pt-1"
            >
              Instrucciones paso a paso
            </h2>
            {instructionSteps.length > 0 ? (
              <ol className="list-none m-0 p-0">
                {instructionSteps.map((step, i) => (
                  <li key={i} className="flex gap-[15px] items-stretch">
                    <div className="flex w-10 shrink-0 items-center py-[15px]">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] font-700 text-[15px] text-[#3d4f5c]"
                        aria-hidden
                      >
                        {i + 1}
                      </div>
                    </div>
                    <div
                      className={`min-w-0 flex-1 flex items-center py-[15px] text-[#3d4f5c] ${
                        i < instructionSteps.length - 1 ? "border-b border-[#eeeeee]" : ""
                      }`}
                    >
                      <p className="m-0 font-sans text-base font-normal leading-relaxed">{step}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="m-0 font-sans text-base font-normal leading-relaxed whitespace-pre-line text-[#3d4f5c]">
                {recipe?.instructions}
              </p>
            )}
          </section>

          {userId ? (
            <button
              type="button"
              onClick={handleCook}
              disabled={isCooking || !canCook}
              className={`w-full font-700 py-5 rounded-[1.5rem] shadow-soft flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] ${
                canCook
                  ? "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
              }`}
            >
              {isCooking ? (
                <Loader2 className="animate-spin" size={24} aria-hidden />
              ) : canCook ? (
                <>
                  <CheckCircle size={24} aria-hidden /> ¡Cocinar esta receta!
                </>
              ) : (
                <>
                  <ShoppingCart size={24} aria-hidden /> Faltan ingredientes
                </>
              )}
            </button>
          ) : (
            <p className="text-center text-muted-foreground text-sm">
              <Link to="/login" className="text-primary font-700 hover:underline">
                Inicia sesión
              </Link>{" "}
              para marcar favoritos y registrar cuando cocinas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
