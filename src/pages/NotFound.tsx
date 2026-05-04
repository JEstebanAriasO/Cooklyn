import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: ruta inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 p-10 text-center">
      <h1 className="font-display text-5xl font-700 text-foreground">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">No encontramos esta página.</p>
      <Link to="/" className="mt-6 text-primary font-semibold underline-offset-4 hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
