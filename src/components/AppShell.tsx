import { Heart, History, Home, Package, User, Utensils } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useCooklyn } from "@/context/CooklynContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/inventario", label: "Inventario", icon: Package },
  { to: "/recetas", label: "Recetas", icon: Utensils },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/historial", label: "Historial", icon: History },
];

export function AppShell() {
  const { pathname } = useLocation();
  const { user } = useCooklyn();

  return (
    <div className="min-h-screen bg-gradient-leaf">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="Cooklyn — inicio">
            <img
              src="/cooklyn-logo.png"
              alt=""
              className="h-9 w-auto max-h-10 sm:h-10 sm:max-h-11 object-contain object-left rounded-xl shadow-soft ring-1 ring-primary/15 transition-smooth group-hover:shadow-glow"
              width={140}
              height={40}
              decoding="async"
              aria-hidden
            />
            <span className="font-display text-2xl font-700 tracking-tight text-primary">Cooklyn</span>
          </Link>

          <nav aria-label="Principal" className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-smooth",
                    active
                      ? "bg-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Link
                to="/perfil"
                className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm shadow-soft hover:bg-muted transition-smooth"
                aria-label="Perfil de usuario"
              >
                <User className="h-4 w-4 text-primary shrink-0" />
                <span className="hidden sm:inline max-w-[110px] truncate">{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition-smooth"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>

        <nav aria-label="Móvil" className="md:hidden flex items-center justify-around border-t border-border/60 bg-background/90 px-2 py-1">
          {NAV.map(({ to, label, icon: Icon }) => {
            const active = to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
            return (
              <Link
                key={to}
                to={to}
                aria-label={label}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px]",
                  active ? "text-primary font-semibold" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" /> {label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="container py-8 animate-fade-in">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-border/60 bg-card/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="font-display text-base text-foreground">Cooklyn · Cocina con lo que tienes</p>
          <p className="mt-1">Plataforma educativa con tips de Buenas Prácticas de Manufactura.</p>
        </div>
      </footer>
    </div>
  );
}
