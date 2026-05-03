import React from 'react'; // <--- AGREGA ESTA LÍNEA
import { UtensilsCrossed } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <UtensilsCrossed className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-slate-900">Cooklyn Chef Helper</h1>
        <p className="text-slate-500 mt-2">Tu asistente de cocina está casi listo.</p>
      </div>
    </div>
  )
}

export default App