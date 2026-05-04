import { useState, type ComponentType } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User as UserIcon, Lock } from "lucide-react";
import { HealthFilter } from "@/components/HealthFilter";
import type { MedicalRestriction } from "@/types/cooklyn";
import { registerSchema } from "@/lib/validators";
import { toast } from "sonner";

const HEALTH_KEY = "cooklyn_health_profile";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restrictions, setRestrictions] = useState<MedicalRestriction[]>([]);
  const [customConditions, setCustomConditions] = useState<string[]>([]);
  const [cautionIngredients, setCautionIngredients] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = registerSchema.safeParse({
      name,
      email,
      password,
      restrictions,
      customConditions,
      cautionIngredients,
    });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((iss) => {
        const k = iss.path[0]?.toString() ?? "_";
        if (!fieldErrors[k]) fieldErrors[k] = iss.message;
      });
      setErrors(fieldErrors);
      toast.error("Revisa los datos del formulario");
      return;
    }

    const d = parsed.data;
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: d.name,
          email: d.email,
          password: d.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error ?? "No se pudo crear la cuenta");
        return;
      }

      localStorage.setItem(
        HEALTH_KEY,
        JSON.stringify({
          restrictions: d.restrictions,
          customConditions: d.customConditions,
          cautionIngredients: d.cautionIngredients,
        }),
      );
      toast.success("¡Cuenta creada! Inicia sesión para continuar.");
      navigate("/login");
    } catch {
      toast.error("No se pudo conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
          <UserIcon className="h-10 w-10" aria-hidden />
        </div>
        <h1 className="mt-4 font-display text-4xl font-700">Crea tu perfil</h1>
        <p className="mt-2 text-muted-foreground">Personaliza tu experiencia con Cooklyn en menos de un minuto.</p>
      </div>

      <form onSubmit={submit} className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-card md:p-8" noValidate>
        <Field label="Nombre completo" icon={UserIcon} id="name" error={errors.name}>
          <input
            id="name"
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Ana Pérez"
            aria-invalid={!!errors.name}
          />
        </Field>
        <Field label="Correo electrónico" icon={Mail} id="email" error={errors.email}>
          <input
            id="email"
            type="email"
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="ana@correo.com"
            aria-invalid={!!errors.email}
          />
        </Field>
        <Field label="Contraseña" icon={Lock} id="pw" error={errors.password}>
          <input
            id="pw"
            type="password"
            minLength={6}
            maxLength={100}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="Mínimo 6 caracteres"
            aria-invalid={!!errors.password}
          />
        </Field>

        <HealthFilter
          value={{ restrictions, customConditions, cautionIngredients }}
          onChange={(v) => {
            setRestrictions(v.restrictions);
            setCustomConditions(v.customConditions);
            setCautionIngredients(v.cautionIngredients);
          }}
        />
        {(errors.restrictions || errors.customConditions || errors.cautionIngredients) && (
          <p className="text-sm text-destructive">
            {errors.restrictions || errors.customConditions || errors.cautionIngredients}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-smooth hover:bg-primary/90 hover:shadow-glow disabled:opacity-60"
        >
          {submitting ? "Creando cuenta…" : "Crear cuenta y continuar"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="font-700 text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>

      <style>{`
        .input { width:100%; border-radius: 0.875rem; border:1px solid hsl(var(--input)); background:hsl(var(--background)); padding: 0.65rem 0.85rem 0.65rem 2.5rem; font-size: 0.9rem; outline:none; transition: all .2s; }
        .input:focus { border-color: hsl(var(--ring)); box-shadow: 0 0 0 3px hsl(var(--ring) / 0.15); }
        .input[aria-invalid="true"] { border-color: hsl(var(--destructive)); }
      `}</style>
    </div>
  );
};

function Field({
  label,
  icon: Icon,
  id,
  error,
  children,
}: {
  label: string;
  icon: ComponentType<{ className?: string }>;
  id: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default Register;
