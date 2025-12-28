
import React from 'react';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { Users, BookOpen, GraduationCap, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { users, subjects, grades } = useData();

  const studentCount = users.filter(u => u.role === UserRole.STUDENT).length;
  const subjectCount = subjects.length;
  
  // Calculate stats per subject
  const chartData = subjects.map(sub => {
    const subGrades = grades.filter(g => g.subjectId === sub.id);
    let totalScore = 0;
    let count = 0;

    subGrades.forEach(g => {
        // Calculate average for this student in this subject
        let studentTotal = 0;
        let studentDivisor = 0;
        
        if (g.semester1 !== undefined) { studentTotal += g.semester1; studentDivisor++; }
        if (g.semester2 !== undefined) { studentTotal += g.semester2; studentDivisor++; }
        
        if (studentDivisor > 0) {
            totalScore += (studentTotal / studentDivisor);
            count++;
        }
    });

    const avg = count > 0 ? totalScore / count : 0;
    return {
      name: sub.name.substring(0, 15) + '...',
      fullName: sub.name,
      average: parseFloat(avg.toFixed(2))
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel de Control <span className="text-gray-500 text-lg font-normal ml-2">| Curso 2025-2026</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Alumnos</p>
            <p className="text-3xl font-bold text-gray-800">{studentCount}</p>
          </div>
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center text-red-900">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Asignaturas</p>
            <p className="text-3xl font-bold text-gray-800">{subjectCount}</p>
          </div>
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
            <BookOpen size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Ciclo</p>
                <p className="text-xl font-bold text-gray-800">DAM</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <GraduationCap size={24} />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">Evaluación</p>
                <p className="text-xl font-bold text-gray-800">1º y 2º Sem</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <TrendingUp size={24} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Promedio por Asignatura (Global)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 10]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="average" radius={[0, 4, 4, 0]}>
                   {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.average >= 5 ? '#16a34a' : '#ef4444'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
           <h3 className="text-lg font-bold text-gray-800 mb-4">Información del Centro</h3>
           <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Nombre</span>
                  <span className="font-medium">IES El Caminas</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Código Centro</span>
                  <span className="font-medium">12004213</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Estudios</span>
                  <span className="font-medium">Desarrollo de Aplicaciones Multiplataforma</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-500">Ubicación</span>
                  <span className="font-medium">Castellón, España</span>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-sm text-red-900 mt-4">
                  <p><strong>Nota Informativa:</strong> El periodo de evaluación finaliza el próximo 15 de Junio. Asegúrese de que todas las actas estén cerradas.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
