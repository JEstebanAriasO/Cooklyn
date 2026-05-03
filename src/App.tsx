import { useState } from 'react';
import { LogOut } from 'lucide-react';
// Importación de las páginas principales
import Index from './pages/Index';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Register from './pages/Register';
import Login from './pages/Login';
import Favorites from './pages/Favorites'; // Nueva página integrada

function App() {
    // 1. ESTADOS PRINCIPALES
    const [activeTab, setActiveTab] = useState('dashboard');
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem('cooklyn_token'));
    const [showRegister, setShowRegister] = useState(false);

    // 2. LÓGICA DE SESIÓN[cite: 5]
    const handleLogout = () => {
        localStorage.removeItem('cooklyn_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        setIsAuth(false);
        setSelectedRecipeId(null);
        setActiveTab('dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-900">

            {/* NAVEGACIÓN PROFESIONAL[cite: 5] */}
            {isAuth && !selectedRecipeId && (
                <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 p-4 flex justify-between items-center px-8 shadow-sm">
                    {/* Identidad Visual */}
                    <div className="font-black text-xl tracking-tighter text-slate-900">
                        COOK<span className="text-orange-500">LYN</span>
                    </div>

                    {/* Menú de Pestañas dinámico (Incluye Favoritos ahora)[cite: 5] */}
                    <div className="flex gap-4 md:gap-10">
                        {[
                            { id: 'dashboard', label: 'Inicio' },
                            { id: 'inventory', label: 'Despensa' },
                            { id: 'recipes', label: 'Explorar' },
                            { id: 'favorites', label: 'Favoritos' } // Pestaña integrada
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

                    {/* Botón de Salida */}
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
                    /* FLUJO DE AUTENTICACIÓN[cite: 11, 14] */
                    showRegister ? (
                        <Register onSwitchToLogin={() => setShowRegister(false)} />
                    ) : (
                        <Login
                            onSwitchToRegister={() => setShowRegister(true)}
                            onLoginSuccess={() => setIsAuth(true)}
                        />
                    )
                ) : (
                    /* VISTAS DE LA APLICACIÓN[cite: 5, 9, 10, 13] */
                    <div className="animate-in fade-in slide-in-from-top-1 duration-500">
                        {selectedRecipeId ? (
                            // Vista de Detalle[cite: 12]
                            <RecipeDetail
                                recipeId={selectedRecipeId}
                                onBack={() => setSelectedRecipeId(null)}
                            />
                        ) : (
                            <>
                                {/* Renderizado condicional basado en la pestaña activa */}
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
                                {activeTab === 'favorites' && (
                                    <Favorites onSelectRecipe={(id: string) => setSelectedRecipeId(id)} />
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