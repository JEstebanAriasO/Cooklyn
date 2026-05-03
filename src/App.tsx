import { useState } from 'react';
import { LogOut } from 'lucide-react';
// Importación de las páginas principales
import Index from './pages/Index';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
    // 1. ESTADOS: 'dashboard' es ahora la puerta de entrada principal
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('cooklyn_token'));
    const [showRegister, setShowRegister] = useState(false);

    // 2. LÓGICA DE SESIÓN[cite: 1]
    const handleLogout = () => {
        localStorage.removeItem('cooklyn_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        setIsAuth(false);
        setSelectedRecipeId(null);
        setActiveTab('dashboard'); // Al cerrar sesión, reseteamos a inicio
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

            {/* NAVEGACIÓN PROFESIONAL: Logo + Tabs + Logout[cite: 1, 4] */}
            {isAuth && !selectedRecipeId && (
                <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 p-4 flex justify-between items-center px-8 shadow-sm">
                    {/* Identidad Visual del Proyecto */}
                    <div className="font-black text-xl tracking-tighter text-slate-900">
                        COOK<span className="text-orange-500">LYN</span>
                    </div>

                    {/* Menú de Pestañas[cite: 1] */}
                    <div className="flex gap-4 md:gap-10">
                        {[
                            { id: 'dashboard', label: 'Inicio' },
                            { id: 'inventory', label: 'Despensa' },
                            { id: 'recipes', label: 'Explorar' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-sm font-black transition-all relative py-1 ${activeTab === tab.id
                                        ? 'text-orange-500 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500 after:rounded-full'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Acciones de Cuenta[cite: 1] */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors font-bold text-xs uppercase tracking-widest"
                    >
                        <LogOut size={16} />
                        <span className="hidden md:inline">Salir</span>
                    </button>
                </nav>
            )}

            <main className="py-4">
                {!isAuth ? (
                    /* FLUJO DE AUTENTICACIÓN[cite: 1] */
                    showRegister ? (
                        <Register onSwitchToLogin={() => setShowRegister(false)} />
                    ) : (
                        <Login
                            onSwitchToRegister={() => setShowRegister(true)}
                            onLoginSuccess={() => setIsAuth(true)}
                        />
                    )
                ) : (
                    /* VISTAS DE LA APLICACIÓN[cite: 1] */
                    <div className="animate-in fade-in slide-in-from-top-1 duration-500">
                        {selectedRecipeId ? (
                            <RecipeDetail
                                recipeId={selectedRecipeId}
                                onBack={() => setSelectedRecipeId(null)}
                            />
                        ) : (
                            <>
                                {activeTab === 'dashboard' && (
                                    <Index
                                        onSelectRecipe={(id) => setSelectedRecipeId(id)}
                                        onGoToInventory={() => setActiveTab('inventory')}
                                    />
                                )}
                                {activeTab === 'inventory' && <Inventory />}
                                {activeTab === 'recipes' && (
                                    <Recipes onSelectRecipe={(id: string) => setSelectedRecipeId(id)} />
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;