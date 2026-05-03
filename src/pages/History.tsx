import { useState, useEffect } from 'react';
import { History as HistoryIcon, Calendar, Utensils, Loader2, ChevronRight } from 'lucide-react';

const History = ({ onSelectRecipe }: { onSelectRecipe: (id: string) => void }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/history/${userId}`);
                const data = await res.json();
                setHistory(data);
            } catch (error) {
                console.error("Error al obtener el historial:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchHistory();
    }, [userId]);

    // Función para dar formato a la fecha de MySQL
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
            <p className="text-slate-500">Cargando tus logros culinarios...</p>
        </div>
    );

    return (
        <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-700">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                    <HistoryIcon className="text-orange-500" /> Mi Historial
                </h1>
                <p className="text-slate-500 mt-2">Un registro de todo lo que has preparado en Cooklyn.</p>
            </header>

            {history.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Utensils size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">¿Aún no has cocinado?</h2>
                    <p className="text-slate-500 mt-2">Tus recetas preparadas aparecerán aquí automáticamente.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((record: any) => (
                        <div
                            key={record.id}
                            onClick={() => onSelectRecipe(record.recipeId)}
                            className="group bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between hover:border-orange-400 hover:shadow-lg hover:shadow-orange-100/50 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                    <Utensils size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 group-hover:text-orange-600 transition-colors">
                                        {record.recipe.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-1 font-medium">
                                        <Calendar size={14} />
                                        <span>Cocinada el {formatDate(record.cookedAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex items-center gap-2 text-orange-500 font-bold text-sm uppercase tracking-wider">
                                Ver de nuevo <ChevronRight size={18} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;