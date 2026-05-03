import React, { useState } from 'react';
import { Plus, Package } from 'lucide-react';

const Inventory = () => {
  const [ingredients] = useState([
    { id: '1', name: 'Harina de Trigo', quantity: '1kg' },
    { id: '2', name: 'Huevos', quantity: '12 unidades' },
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="text-orange-500" /> Mi Despensa
        </h1>
        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-colors">
          <Plus size={20} /> Agregar Ingrediente
        </button>
      </div>

      <div className="grid gap-4">
        {ingredients.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
            <span className="font-medium text-slate-700">{item.name}</span>
            <span className="text-slate-500 bg-slate-100 px-3 py-1 rounded-full text-sm">
              {item.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;