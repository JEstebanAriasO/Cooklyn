import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { useCooklyn } from "@/context/CooklynContext";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { setSession } = useCooklyn();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok && data.token) {
        setSession({
          token: data.token,
          user: {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
          },
        });
        localStorage.setItem("user_name", data.user.name);
        if (data.user.email) localStorage.setItem("user_email", data.user.email);
        toast.success("¡Bienvenido de nuevo!");
        navigate(from, { replace: true });
      } else {
        toast.error("Credenciales incorrectas");
      }
    } catch {
      toast.error("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="bg-card w-full max-w-md rounded-3xl border border-border shadow-card p-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-700 text-foreground">Bienvenido</h2>
          <p className="text-muted-foreground mt-2">Ingresa tus credenciales para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Correo</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-2xl outline-none focus:ring-2 focus:ring-ring transition-smooth"
                placeholder="tu@correo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="password"
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-2xl outline-none focus:ring-2 focus:ring-ring transition-smooth"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-700 py-4 rounded-2xl hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2 shadow-soft"
          >
            {loading ? <Loader2 className="animate-spin" /> : <LogIn size={18} />}
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-muted-foreground text-sm">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="text-primary font-700 hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
