import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide text-xs">{label}</label>
      <input
        className={`w-full px-3 py-2 border rounded-sm focus:ring-1 focus:ring-red-900 focus:border-red-900 outline-none transition-all text-sm shadow-sm ${error ? 'border-red-600 bg-red-50' : 'border-gray-400 bg-white'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-bold text-red-700 flex items-center gap-1">
        ⚠ {error}
      </p>}
    </div>
  );
};