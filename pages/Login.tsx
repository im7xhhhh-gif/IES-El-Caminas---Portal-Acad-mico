
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Shield, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { InputField } from '../components/InputField';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const { resetToDefaults } = useData();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Las credenciales introducidas no son válidas.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex flex-col">
      {/* Header Login */}
      <header className="bg-white border-b border-gray-300 py-4 px-8 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <Shield className="h-8 w-8 text-gray-800" />
             <div className="border-l border-gray-400 pl-3">
                 <h1 className="text-sm font-bold text-gray-800 uppercase leading-none">Generalitat Valenciana</h1>
                 <p className="text-xs text-gray-500">Conselleria d'Educació</p>
             </div>
         </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-300 shadow-md rounded-sm p-8">
          
          <div className="text-center mb-8 border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-red-900 mb-2">Acceso Identificado</h2>
            <p className="text-sm text-gray-600">IES El Caminas - Portal de Gestión Académica</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 rounded-sm text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
                <InputField 
                    label="Usuario / NIA"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej: 1234567"
                    required
                />
                
                <InputField 
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="pt-2">
                <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-900 hover:bg-red-800 text-white font-bold py-3 px-4 rounded-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm uppercase tracking-wide text-sm"
                >
                {loading ? 'Autenticando...' : 'Acceder'}
                {!loading && <ArrowRight size={16} />}
                </button>
            </div>
          </form>

          {/* Reset Data Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
             <p className="text-xs text-gray-400 mb-3">¿Problemas con los datos o credenciales?</p>
             <button 
               onClick={resetToDefaults}
               className="text-xs font-bold text-gray-500 hover:text-red-700 flex items-center justify-center gap-2 mx-auto transition-colors"
               title="Esto borrará los datos locales y restaurará los usuarios originales"
             >
                <RefreshCw size={12} />
                Restaurar Datos de Fábrica
             </button>
          </div>
        </div>
      </div>
      
      <footer className="text-center py-4 text-xs text-gray-500 border-t border-gray-300 bg-white">
        © Generalitat Valenciana. Todos los derechos reservados.
      </footer>
    </div>
  );
};
