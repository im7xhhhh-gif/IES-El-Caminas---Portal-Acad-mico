
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Fingerprint, ShieldCheck } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      
      <div className="mb-6 border-b border-gray-300 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 uppercase">Ficha del Alumno</h2>
        <p className="text-sm text-gray-500">Datos identificativos registrados en el sistema</p>
      </div>

      <div className="bg-white border border-gray-300 shadow-sm flex flex-col md:flex-row">
        
        {/* Left Column: Role & Status (No Photo) */}
        <div className="md:w-64 bg-gray-50 border-r border-gray-300 p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-3">{currentUser.name}</h3>
            <span className="inline-block px-3 py-1 bg-red-900 text-white text-xs font-bold uppercase tracking-wider">
                Alumno Oficial
            </span>
            <div className="mt-8 w-full pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Estado Matricula</p>
                <p className="text-green-700 font-bold text-sm flex items-center justify-center gap-1">
                    <ShieldCheck size={14} /> ACTIVA
                </p>
            </div>
        </div>

        {/* Right Column: Data Fields */}
        <div className="flex-1 p-8">
            <h4 className="text-sm font-bold text-red-900 uppercase tracking-wide border-b border-red-900 pb-2 mb-6">Datos Personales</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Número de Identificación (NIA)</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200">
                        <Fingerprint size={16} className="text-gray-400" />
                        <span className="font-mono text-lg font-bold text-gray-900">{currentUser.id}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                        <span className="text-lg text-gray-900">{currentUser.name}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grupo / Curso</label>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                        <span className="text-md text-gray-900">{currentUser.group || 'No asignado'}</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Año Académico</label>
                    <div className="p-3 bg-gray-50 border border-gray-200">
                        <span className="text-md text-gray-900">{currentUser.academicYear || '2025-2026'}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 border border-yellow-200 bg-yellow-50 text-xs text-yellow-800 flex gap-2 items-start">
                <span className="font-bold text-lg leading-none">⚠</span>
                <p>
                    <span className="font-bold">Nota Importante:</span> Los datos aquí mostrados son los que constan en la secretaría del centro. 
                    Para solicitar cualquier modificación, deberá personarse en secretaría con la documentación acreditativa pertinente.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
