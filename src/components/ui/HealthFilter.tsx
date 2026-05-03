import { ShieldCheck } from 'lucide-react';

interface HealthFilterProps {
    selected: string[];
    onChange: (id: string) => void;
    restrictions: any[];
}

const HealthFilter = ({ selected, onChange, restrictions }: HealthFilterProps) => {
    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 mb-6">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
                <ShieldCheck className="text-green-500" size={20} />
                Filtros de Salud
            </div>
            <div className="flex flex-wrap gap-2">
                {restrictions.map((res) => (
                    <button
                        key={res.id}
                        onClick={() => onChange(res.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected.includes(res.id)
                            ? 'bg-green-500 text-white shadow-md shadow-green-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        {res.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HealthFilter;