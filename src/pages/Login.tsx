import React, { useState } from 'react';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';

interface LoginProps {
    onSwitchToRegister: () => void;
    onLoginSuccess: () => void;
}

const Login = ({ onSwitchToRegister, onLoginSuccess }: LoginProps) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('cooklyn_token', data.token); // Guardamos el token
                localStorage.setItem('user_id', data.user.id);
                onLoginSuccess();
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Error al conectar con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Bienvenido</h2>
                    <p className="text-slate-500 mt-2">Ingresa tus credenciales para continuar.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Correo</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                placeholder="tu@correo.com"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                placeholder="••••••••"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={18} /> Entrar</>}
                    </button>
                </form>

                <p className="mt-6 text-center text-slate-500 text-sm">
                    ¿No tienes cuenta?{' '}
                    <button onClick={onSwitchToRegister} className="text-orange-600 font-bold hover:underline">
                        Regístrate gratis
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;