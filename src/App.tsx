import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CooklynProvider } from "@/context/CooklynContext";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/Inventory";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster richColors position="top-center" />
      <CooklynProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/recetas/:id" element={<RecipeDetail />} />
              <Route path="/recetas" element={<Recipes />} />
              <Route
                path="/inventario"
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favoritos"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/historial"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CooklynProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
