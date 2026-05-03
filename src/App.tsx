import { useState } from 'react';
import Inventory from './pages/Inventory';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';

function App() {
    const [activeTab, setActiveTab] = useState('inventory');
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Navegación - Solo se muestra si no estamos viendo el detalle de una receta */}
            {!selectedRecipeId && (
                <nav className="bg-white border-b border-slate-200 p-4 flex justify-center gap-8">
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
            </main>
        </div>
    );
}

export default App;