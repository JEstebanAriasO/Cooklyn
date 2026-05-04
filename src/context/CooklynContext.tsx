import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CooklynUser, MedicalRestriction, UserProfile } from "@/types/cooklyn";

const HEALTH_KEY = "cooklyn_health_profile";

function loadHealth(): Pick<UserProfile, "restrictions" | "customConditions" | "cautionIngredients"> {
  try {
    const raw = localStorage.getItem(HEALTH_KEY);
    if (!raw)
      return { restrictions: [], customConditions: [], cautionIngredients: [] };
    const p = JSON.parse(raw);
    return {
      restrictions: (p.restrictions ?? []) as MedicalRestriction[],
      customConditions: p.customConditions ?? [],
      cautionIngredients: p.cautionIngredients ?? [],
    };
  } catch {
    return { restrictions: [], customConditions: [], cautionIngredients: [] };
  }
}

function persistHealth(u: Pick<UserProfile, "restrictions" | "customConditions" | "cautionIngredients">) {
  localStorage.setItem(
    HEALTH_KEY,
    JSON.stringify({
      restrictions: u.restrictions,
      customConditions: u.customConditions,
      cautionIngredients: u.cautionIngredients,
    }),
  );
}

function hydrateUser(): CooklynUser | null {
  if (!localStorage.getItem("cooklyn_token")) return null;
  const id = localStorage.getItem("user_id");
  const name = localStorage.getItem("user_name");
  const email = localStorage.getItem("user_email") ?? "";
  if (!id || !name) return null;
  const h = loadHealth();
  return {
    id,
    name,
    email,
    restrictions: h.restrictions,
    customConditions: h.customConditions,
    cautionIngredients: h.cautionIngredients,
  };
}

interface CooklynState {
  user: CooklynUser | null;
  setSession: (payload: { token: string; user: { id: string; name: string; email?: string } }) => void;
  /** Actualiza perfil + preferencias de salud (persistido en localStorage). */
  setUser: (u: UserProfile & { id?: string }) => void;
  logout: () => void;
}

const CooklynCtx = createContext<CooklynState | null>(null);

export function CooklynProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<CooklynUser | null>(() => hydrateUser());

  useEffect(() => {
    const onStorage = () => setUserState(hydrateUser());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setSession = useCallback((payload: { token: string; user: { id: string; name: string; email?: string } }) => {
    localStorage.setItem("cooklyn_token", payload.token);
    localStorage.setItem("user_id", payload.user.id);
    localStorage.setItem("user_name", payload.user.name);
    if (payload.user.email) localStorage.setItem("user_email", payload.user.email);
    const h = loadHealth();
    const next: CooklynUser = {
      id: payload.user.id,
      name: payload.user.name,
      email: payload.user.email ?? "",
      restrictions: h.restrictions,
      customConditions: h.customConditions,
      cautionIngredients: h.cautionIngredients,
    };
    setUserState(next);
    persistHealth(next);
  }, []);

  const setUser = useCallback((u: UserProfile & { id?: string }) => {
    setUserState((prev) => {
      if (!prev) {
        const id = u.id ?? localStorage.getItem("user_id");
        if (!id) return null;
        const next: CooklynUser = {
          id,
          name: u.name,
          email: u.email,
          restrictions: u.restrictions,
          customConditions: u.customConditions,
          cautionIngredients: u.cautionIngredients,
        };
        persistHealth(next);
        return next;
      }
      const next: CooklynUser = {
        ...prev,
        name: u.name,
        email: u.email,
        restrictions: u.restrictions,
        customConditions: u.customConditions,
        cautionIngredients: u.cautionIngredients,
      };
      persistHealth(next);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("cooklyn_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    localStorage.removeItem(HEALTH_KEY);
    setUserState(null);
  }, []);

  const value = useMemo<CooklynState>(
    () => ({ user, setSession, setUser, logout }),
    [user, setSession, setUser, logout],
  );

  return <CooklynCtx.Provider value={value}>{children}</CooklynCtx.Provider>;
}

export function useCooklyn() {
  const ctx = useContext(CooklynCtx);
  if (!ctx) throw new Error("useCooklyn must be used within CooklynProvider");
  return ctx;
}
