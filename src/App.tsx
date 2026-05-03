import { useState } from 'react';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Register from './pages/Register';
import Login from './pages/Login'; // Asegúrate de que este archivo exista

function App() {
    // 1. Estados únicos y organizados
    const [activeTab, setActiveTab] = useState('inventory');
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* Navegación: Solo se muestra si el usuario está logueado y no está viendo una receta específica */}
            {isAuth && !selectedRecipeId && (
                <nav className="bg-white border-b border-slate-200 p-4 flex justify-center gap-8 shadow-sm">
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
                </nav>
            )}

            <main className="py-4">
                {/* Lógica de Renderizado Condicional */}
                {!isAuth ? (
                    // Flujo de Autenticación
                    showRegister ? (
                        <Register onSwitchToLogin={() => setShowRegister(false)} />
                    ) : (
                        <Login
                            onSwitchToRegister={() => setShowRegister(true)}
                            onLoginSuccess={() => setIsAuth(true)}
                        />
                    )
                ) : (
                    // Flujo de la Aplicación (Usuario Autenticado)
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