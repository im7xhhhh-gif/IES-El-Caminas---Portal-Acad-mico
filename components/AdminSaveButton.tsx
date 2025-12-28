import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';
import { useData } from '../context/DataContext';

interface AdminSaveButtonProps {
    className?: string;
    label?: string;
    onSave?: () => void; // Optional additional callback
}

export const AdminSaveButton: React.FC<AdminSaveButtonProps> = ({ className, label = "Guardar Cambios", onSave }) => {
    const { saveData } = useData();
    const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (status === 'success') {
            timer = setTimeout(() => setStatus('idle'), 3000);
        }
        return () => clearTimeout(timer);
    }, [status]);

    const handleClick = async () => {
        if (status === 'saving') return;
        
        setStatus('saving');
        await saveData();
        if (onSave) onSave();
        setStatus('success');
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleClick}
                disabled={status === 'saving'}
                className={`flex items-center gap-2 px-4 py-2 rounded-sm font-bold text-sm uppercase tracking-wide transition-all shadow-sm ${
                    status === 'success' 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-slate-700 text-white hover:bg-slate-800'
                } disabled:opacity-80 disabled:cursor-wait ${className}`}
            >
                {status === 'saving' ? (
                    <Loader2 size={16} className="animate-spin" />
                ) : status === 'success' ? (
                    <CheckCircle2 size={16} />
                ) : (
                    <Save size={16} />
                )}
                <span>{status === 'saving' ? 'Guardando...' : status === 'success' ? 'Guardado' : label}</span>
            </button>
            
            {/* Feedback Toast (positioned absolutely relative to button or fixed if preferred, sticking to relative for local context) */}
            {status === 'success' && (
                <div className="absolute top-full right-0 mt-2 w-max animate-in fade-in slide-in-from-top-1 z-50">
                    <div className="bg-green-800 text-white text-xs py-2 px-3 rounded shadow-lg flex items-center gap-2">
                        <CheckCircle2 size={12} />
                        Cambios actualizados en base de datos
                    </div>
                </div>
            )}
        </div>
    );
};