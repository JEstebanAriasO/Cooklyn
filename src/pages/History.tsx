import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History as HistoryIcon, Calendar, Utensils, Loader2, ChevronRight } from "lucide-react";

const History = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`http://localhost:3000/api/history/${userId}`);
        const data = await res.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener el historial:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-muted-foreground">Cargando tus logros culinarios...</p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700 space-y-10">
      <header>
        <h1 className="font-display text-4xl font-700 text-foreground flex items-center gap-3">
          <HistoryIcon className="text-primary h-9 w-9" aria-hidden /> Mi historial
        </h1>
        <p className="text-muted-foreground mt-2">Un registro de todo lo que has preparado en Cooklyn.</p>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-[3rem] border-2 border-dashed border-border shadow-soft">
          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6 text-muted-foreground">
            <Utensils size={40} />
          </div>
          <h2 className="font-display text-xl font-700 text-foreground">¿Aún no has cocinado?</h2>
          <p className="text-muted-foreground mt-2">Tus recetas preparadas aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record: any) => (
            <Link
              key={record.id}
              to={`/recetas/${record.recipeId}`}
              className="group bg-card p-6 rounded-[2rem] border border-border flex flex-col md:flex-row md:items-center justify-between hover:border-primary/40 hover:shadow-card transition-all"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Utensils size={28} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-700 text-card-foreground group-hover:text-primary transition-colors">
                    {record.recipe.title}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1 font-medium">
                    <Calendar size={14} aria-hidden />
                    <span>Cocinada el {formatDate(record.cookedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-2 text-primary font-700 text-sm uppercase tracking-wider">
                Ver de nuevo <ChevronRight size={18} aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
