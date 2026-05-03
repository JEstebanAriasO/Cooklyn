import React, { useState } from 'react';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import { LogOut } from 'lucide-react';

function App() {
    // 1. Estados inicializados con persistencia básica
    const [activeTab, setActiveTab] = useState('inventory');
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('cooklyn_token'));
    const [showRegister, setShowRegister] = useState(false);

    // 2. Función para limpiar la sesión
    const handleLogout = () => {
        localStorage.removeItem('cooklyn_token');
        localStorage.removeItem('user_id');
        setIsAuth(false);
        setSelectedRecipeId(null);
        setActiveTab('inventory');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* Navegación mejorada con Logout a la derecha */}
            {isAuth && !selectedRecipeId && (
                <nav className="bg-white border-b border-slate-200 p-4 flex justify-between items-center px-8 shadow-sm">
                    {/* Espaciador para equilibrar el layout */}
                    <div className="w-10 md:w-32" />

                    <div className="flex gap-8">
                        <button
                            onClick={() => setActiveTab('inventory')}
                            className={`font-semibold transition-colors ${activeTab === 'inventory' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-400'}`}
                        >
                            Inventario
                        </button>
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`font-semibold transition-colors ${activeTab === 'recipes' ? 'text-orange-500' : 'text-slate-500 hover:text-orange-400'}`}
                        >
                            Recetas
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors font-medium text-sm md:w-32 justify-end"
                    >
                        <LogOut size={18} />
                        <span className="hidden md:inline">Cerrar Sesión</span>
                    </button>
                </nav>
            )}

            <main className="py-4">
                {!isAuth ? (
                    showRegister ? (
                        <Register onSwitchToLogin={() => setShowRegister(false)} />
                    ) : (
                        <Login
                            onSwitchToRegister={() => setShowRegister(true)}
                            onLoginSuccess={() => setIsAuth(true)}
                        />
                    )
                ) : (
                    <>
                        {selectedRecipeId ? (
                            <RecipeDetail
                                recipeId={selectedRecipeId}
                                onBack={() => setSelectedRecipeId(null)}
                            />
                        ) : activeTab === 'inventory' ? (
                            <Inventory />
                        ) : (
                            <Recipes onSelectRecipe={(id: string) => setSelectedRecipeId(id)} />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default App;