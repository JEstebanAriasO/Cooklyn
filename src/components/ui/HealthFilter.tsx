import { ShieldCheck } from "lucide-react";

interface HealthFilterProps {
  selected: string[];
  onChange: (id: string) => void;
  restrictions: any[];
}

const HealthFilter = ({ selected, onChange, restrictions }: HealthFilterProps) => {
  return (
    <div className="bg-card p-4 rounded-2xl border border-border mb-6 shadow-soft">
      <div className="flex items-center gap-2 mb-4 text-foreground font-700">
        <ShieldCheck className="text-success" size={20} aria-hidden />
        Filtros de salud
      </div>
      <div className="flex flex-wrap gap-2">
        {restrictions.map((res) => (
          <button
            key={res.id}
            type="button"
            onClick={() => onChange(res.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
              selected.includes(res.id)
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
