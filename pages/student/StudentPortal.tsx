
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentPortalProps {
  view: 's1' | 's2' | 'summary';
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ view }) => {
  const { currentUser } = useAuth();
  const { getStudentData, subjects } = useData();

  if (!currentUser) return null;

  const { grades, attendance } = getStudentData(currentUser.id);

  // Helper functions
  const getSubjectGrades = (subjectId: string) => {
    const grade = grades.find(g => g.subjectId === subjectId);
    return {
        s1: grade?.semester1,
        s2: grade?.semester2,
    };
  };

  // Strictly calculation for display in "Nota Final" column
  // Returns null if incomplete
  const calculateFinalGrade = (s1?: number, s2?: number) => {
    if (s1 === undefined || s2 === undefined || s1 === null || s2 === null || isNaN(s1) || isNaN(s2)) {
        return null; 
    }
    return parseFloat(((s1 + s2) / 2).toFixed(2));
  };

  const calculateAverage = (semester: 's1' | 's2' | 'final') => {
    let sum = 0;
    let count = 0;
    subjects.forEach(sub => {
      const { s1, s2 } = getSubjectGrades(sub.id);
      let val: number | undefined | null = undefined;
      
      if (semester === 's1') val = s1;
      else if (semester === 's2') val = s2;
      else val = calculateFinalGrade(s1, s2);

      if (val !== undefined && val !== null && !isNaN(val)) {
        sum += val;
        count++;
      }
    });
    return count > 0 ? (sum / count).toFixed(2) : '0.00';
  };

  interface StatusBadgeProps {
      s1?: number | null;
      s2?: number | null;
      view: 's1' | 's2' | 'summary';
  }

  const StatusBadge: React.FC<StatusBadgeProps> = ({ s1, s2, view }) => {
    const isValid = (n?: number | null) => n !== undefined && n !== null && !isNaN(n);
    
    // Determine the relevant score based on view
    let isPending = false;
    let isPass = false;

    if (view === 's1') {
        if (!isValid(s1)) isPending = true;
        else isPass = s1! >= 5;
    } else if (view === 's2') {
        if (!isValid(s2)) isPending = true;
        else isPass = s2! >= 5;
    } else {
        // Summary: Pending if any semester is missing
        if (!isValid(s1) || !isValid(s2)) isPending = true;
        else isPass = ((s1! + s2!) / 2) >= 5;
    }

    if (isPending) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-gray-200 bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wide rounded-sm">
                <Clock size={10} /> Pendiente
            </span>
        );
    }

    return (
        <span className={`inline-block px-2 py-0.5 border text-xs font-bold uppercase tracking-wide rounded-sm ${isPass ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {isPass ? 'APTO' : 'NO APTO'}
        </span>
    );
  };

  // Helper to render the grade with colors
  const renderGradeBadge = (score?: number | null) => {
    if (score === undefined || score === null || isNaN(score)) {
        return <span className="text-gray-300 font-light text-xl">-</span>;
    }

    const isPass = score >= 5;
    
    return (
        <span className={`inline-flex items-center justify-center w-14 py-1.5 rounded-md text-sm font-bold border transition-colors ${
            isPass 
            ? 'bg-green-50 text-green-700 border-green-200' 
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
            {score.toFixed(1)}
        </span>
    );
  };

  // View Configurations
  const getViewTitle = () => {
    switch(view) {
        case 's1': return 'Boletín de Notas - 1º Semestre';
        case 's2': return 'Boletín de Notas - 2º Semestre';
        case 'summary': return 'Expediente Académico Anual';
    }
  };

  // Evolution Data for Chart
  const chartData = subjects.map(sub => {
    const { s1, s2 } = getSubjectGrades(sub.id);
    // For charts, we use 0 if undefined to show gaps, or we could filter. 
    // Using 0 is standard for visual gap in area chart if connected, but let's just use what we have.
    return {
      name: sub.name.substring(0, 4) + '.',
      fullName: sub.name,
      Semestre1: s1 || 0,
      Semestre2: s2 || 0,
    };
  });

  return (
    <div className="space-y-8">
      {/* Institutional Header for the Page */}
      <div className="border-b-2 border-red-900 pb-4 mb-6">
         <h2 className="text-2xl font-bold text-red-900 uppercase tracking-tight">{getViewTitle()}</h2>
         <div className="flex justify-between items-end mt-2">
            <p className="text-sm text-gray-600">
                Alumno: <span className="font-bold text-gray-900 uppercase">{currentUser.name}</span> | NIA: {currentUser.id}
            </p>
            <p className="text-xs text-gray-500">Curso Académico {currentUser.academicYear || '2025-2026'}</p>
         </div>
      </div>

      {/* Summary Data - Plain Design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-300 divide-y md:divide-y-0 md:divide-x divide-gray-300 bg-gray-50">
        <div className="p-4 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Asignaturas Matriculadas</p>
            <p className="text-3xl font-bold text-gray-800">{subjects.length}</p>
        </div>
        
        <div className="p-4 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nota Media ({view === 's1' ? '1º Sem' : view === 's2' ? '2º Sem' : 'Global'})</p>
            <p className={`text-3xl font-bold ${parseFloat(calculateAverage(view === 'summary' ? 'final' : view)) >= 5 ? 'text-green-700' : 'text-red-700'}`}>
                {view === 's1' ? calculateAverage('s1') : view === 's2' ? calculateAverage('s2') : calculateAverage('final')}
            </p>
        </div>

        <div className="p-4 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Faltas de Asistencia (Horas)</p>
            <p className={`text-3xl font-bold ${attendance.reduce((acc, curr) => acc + curr.absences, 0) > 10 ? 'text-red-700' : 'text-gray-800'}`}>
                {attendance.reduce((acc, curr) => acc + curr.absences, 0)}
            </p>
        </div>
      </div>

      {/* Official Table */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase border-l-4 border-red-900 pl-3 mb-4">Detalle de Calificaciones</h3>
        <div className="overflow-x-auto border border-gray-300">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b border-gray-300">
                <th className="px-4 py-3 font-bold uppercase w-1/3">Módulo Profesional</th>
                <th className="px-4 py-3 font-bold uppercase">Docente</th>
                
                {view === 's1' && <th className="px-4 py-3 font-bold text-center border-l border-gray-300 w-32">Nota 1º Sem</th>}
                {view === 's2' && <th className="px-4 py-3 font-bold text-center border-l border-gray-300 w-32">Nota 2º Sem</th>}
                
                {view === 'summary' && (
                    <>
                        <th className="px-4 py-3 font-bold text-center border-l border-gray-300 bg-gray-50 text-gray-500 w-24">1º Sem</th>
                        <th className="px-4 py-3 font-bold text-center border-l border-gray-300 bg-gray-50 text-gray-500 w-24">2º Sem</th>
                        <th className="px-4 py-3 font-bold text-center border-l border-gray-300 bg-red-50 text-red-900 w-32">Nota Final</th>
                    </>
                )}

                <th className="px-4 py-3 font-bold text-center border-l border-gray-300 w-32">Calificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subjects.map((subject, idx) => {
                const { s1, s2 } = getSubjectGrades(subject.id);
                const final = calculateFinalGrade(s1, s2);

                return (
                  <tr key={subject.id} className={`hover:bg-red-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-medium text-gray-900 border-r border-gray-200">
                        {subject.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs uppercase border-r border-gray-200">
                       {subject.teacherName}
                    </td>

                    {/* Logic for S1 Panel */}
                    {view === 's1' && (
                        <td className="px-4 py-3 text-center border-r border-gray-200">
                            {renderGradeBadge(s1)}
                        </td>
                    )}

                    {/* Logic for S2 Panel */}
                    {view === 's2' && (
                        <td className="px-4 py-3 text-center border-r border-gray-200">
                            {renderGradeBadge(s2)}
                        </td>
                    )}

                    {/* Logic for Summary Panel */}
                    {view === 'summary' && (
                        <>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                {renderGradeBadge(s1)}
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                {renderGradeBadge(s2)}
                            </td>
                            <td className="px-4 py-3 text-center bg-red-50/30 border-r border-gray-200">
                                {renderGradeBadge(final)}
                            </td>
                        </>
                    )}

                    <td className="px-4 py-3 text-center">
                       <StatusBadge s1={s1} s2={s2} view={view} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500 italic text-right">* Las calificaciones mostradas tienen carácter informativo y no sustituyen al acta oficial de evaluación.</p>
      </div>

      {/* Evolution Chart (Extra) - Only visible on Summary */}
      {view === 'summary' && (
        <div className="mt-8 pt-6 border-t border-gray-300">
            <h3 className="text-sm font-bold text-gray-800 uppercase border-l-4 border-gray-500 pl-3 mb-4">Gráfica de Evolución</h3>
            <div className="bg-white border border-gray-300 p-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 10]} tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <Tooltip 
                            contentStyle={{ border: '1px solid #ccc', borderRadius: '0px', boxShadow: 'none' }}
                        />
                        <Area type="monotone" dataKey="Semestre1" stroke="#7f1d1d" fillOpacity={0.1} fill="#7f1d1d" strokeWidth={2} name="1º Sem" />
                        <Area type="monotone" dataKey="Semestre2" stroke="#64748b" fillOpacity={0.1} fill="#64748b" strokeWidth={2} name="2º Sem" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
      )}
    </div>
  );
};
