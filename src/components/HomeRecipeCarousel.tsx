import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { recipeService } from "@/services/recipeService";
import { recipePlaceholder, resolveRecipeImage } from "@/lib/recipeImages";

interface Props {
  count?: number;
  intervalMs?: number;
}

export function HomeRecipeCarousel({ count = 6, intervalMs = 4000 }: Props) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await recipeService.getAll();
        if (!cancelled) setSlides(Array.isArray(all) ? all.slice(0, count) : []);
      } catch {
        if (!cancelled) setSlides([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [count]);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) return;
    const id = window.setInterval(() => api.scrollNext(), intervalMs);
    return () => window.clearInterval(id);
  }, [api, paused, intervalMs]);

  if (slides.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-dashed border-border bg-muted/40 p-8 text-center text-muted-foreground">
        Cargando recetas destacadas…
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Carousel opts={{ loop: true, align: "start" }} setApi={setApi} className="h-full w-full" aria-label="Recetas destacadas">
        <CarouselContent className="h-full">
          {slides.map((r) => {
            const img = resolveRecipeImage(r as { imageUrl?: string; title?: string });
            const mins = parseInt(String((r as { cookingTime?: string }).cookingTime ?? "20"), 10) || 20;
            const badge = (r as { difficulty?: string }).difficulty || "Receta";
            return (
              <CarouselItem key={r.id} className="h-full">
                <Link
                  to={`/recetas/${r.id}`}
                  className="group relative block h-full min-h-[320px] w-full overflow-hidden rounded-3xl"
                >
                  <img
                    src={img}
                    alt={r.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = recipePlaceholder(String(r?.title ?? "Cooklyn"));
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-background">
                    <span className="inline-block rounded-full bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
                      {badge}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-700 leading-tight text-white drop-shadow-md md:text-3xl">{r.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/90">
                      <Clock className="h-3.5 w-3.5" aria-hidden /> {mins} min
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="left-3 hidden md:flex" />
        <CarouselNext className="right-3 hidden md:flex" />
      </Carousel>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5 md:hidden">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-white" : "w-1.5 bg-white/60"}`}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
