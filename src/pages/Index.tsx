import { Link } from "react-router-dom";
import { ArrowRight, ChefHat, Leaf, Loader2, ShieldCheck, Sparkles, Utensils } from "lucide-react";
import { useCooklyn } from "@/context/CooklynContext";
import { HomeRecipeCarousel } from "@/components/HomeRecipeCarousel";
import { useEffect, useState } from "react";
import { recipeService } from "@/services/recipeService";

const Index = () => {
  const { user } = useCooklyn();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setMatches([]);
      return;
    }
    setLoading(true);
    recipeService
      .getMatches(user.id)
      .then((data) => setMatches(Array.isArray(data) ? data : []))
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const invLink = user ? "/inventario" : "/login";
  const primaryTo = user ? "/recetas" : "/registro";
  const primaryLabel = user ? "Ver recetas" : "Crear mi perfil";

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-[2.5rem] bg-card shadow-card">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Leaf className="h-3.5 w-3.5" aria-hidden /> Abre y cocina
            </span>
            <h1 className="mt-4 font-display text-4xl font-700 leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Cocina con lo que <span className="text-primary">tienes</span> hoy en casa.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">
              Cooklyn analiza tu inventario, respeta tus restricciones de salud y te sugiere recetas con tips de Buenas Prácticas de Manufactura en cada paso.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to={primaryTo}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 hover:shadow-glow transition-smooth"
              >
                {primaryLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={invLink}
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-muted transition-smooth"
              >
                Mi inventario
              </Link>
            </div>
          </div>
          <div className="relative flex items-stretch justify-center bg-gradient-leaf p-4 md:p-6">
            <HomeRecipeCarousel />
          </div>
        </div>
      </section>

      {user && (
        <section aria-labelledby="sugerencias">
          <h2 id="sugerencias" className="font-display text-2xl font-700 mb-6">
            Sugerencias para ti
          </h2>
          {loading ? (
            <div className="flex justify-center py-12 text-muted-foreground">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : matches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {matches.map((recipe: any) => (
                <Link
                  key={recipe.id}
                  to={`/recetas/${recipe.id}`}
                  className="group rounded-3xl border border-border bg-card p-6 shadow-soft transition-smooth hover:shadow-card hover:border-primary/30"
                >
                  <h3 className="font-display text-xl font-700 group-hover:text-primary transition-colors">{recipe.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-primary" aria-hidden />
                    {recipe.ingredients?.length ?? 0} ingredientes · Ver receta
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground rounded-3xl border border-dashed border-border bg-card/50 p-8 text-center">
              Añade ingredientes en tu inventario para ver recetas que puedas cocinar hoy.
            </p>
          )}
        </section>
      )}

      <section aria-labelledby="pillars">
        <h2 id="pillars" className="sr-only">
          Características
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: ChefHat,
              title: "Recetas a tu medida",
              text: "Filtradas por lo que tienes en tu cocina y por tu perfil de salud.",
            },
            {
              icon: ShieldCheck,
              title: "Tips BPM en cada paso",
              text: "Aprende higiene, temperatura segura y manipulación correcta.",
            },
            {
              icon: Sparkles,
              title: "Favoritos & historial",
              text: "Guarda tus recetas preferidas y registra tus preparaciones.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border border-border bg-card p-6 shadow-soft transition-smooth hover:shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-xl font-600">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
