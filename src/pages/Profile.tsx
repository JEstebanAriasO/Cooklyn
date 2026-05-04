import { Link, useNavigate } from "react-router-dom";
import { useCooklyn } from "@/context/CooklynContext";
import { HealthFilter } from "@/components/HealthFilter";
import { LogOut, Mail } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { user, logout } = useCooklyn();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-dashed border-border bg-card p-10 text-center">
        <p className="text-muted-foreground">Inicia sesión para ver tu perfil.</p>
        <Link to="/login" className="mt-3 inline-block font-medium text-primary hover:underline">
          Entrar →
        </Link>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="flex flex-wrap items-center gap-4 rounded-3xl bg-card p-6 shadow-card">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-hero text-2xl font-display font-700 text-primary-foreground">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-700 truncate">{user.name}</h1>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden /> {user.email || "—"}
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-smooth"
              aria-label="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
              <AlertDialogDescription>
                Se cerrará tu sesión en este dispositivo. Tus datos de salud guardados localmente se borrarán si continúas.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Sí, cerrar sesión
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      <HealthFilter variant="panel" />
    </div>
  );
};

export default Profile;
