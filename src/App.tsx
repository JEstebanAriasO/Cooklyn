import React from 'react';
import Inventory from './pages/Inventory'; // Importamos tu nueva página

function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Ahora App renderiza el Inventario en lugar del texto de prueba */}
            <Inventory />
        </div>
    );
}

export default App;