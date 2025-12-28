
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { UserRole } from '../../types';
import { Search, CalendarDays, PieChart, Clock } from 'lucide-react';
import { AdminSaveButton } from '../../components/AdminSaveButton';

export const AcademicManager: React.FC = () => {
  const { users, subjects, grades, attendance, updateGrade, updateAttendance } = useData();
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'s1' | 's2' | 'summary' | 'attendance'>('s1');

  const students = users.filter(u => u.role === UserRole.STUDENT);
  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Helper to safely display values (avoids NaN in input)
  const safeValue = (val: number | undefined) => {
    if (val === undefined || isNaN(val)) return '';
    return val;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión Académica</h2>
            <p className="text-sm text-gray-500">Edición de notas y control de asistencia</p>
        </div>
        {/* Global Save Button for this panel */}
        <AdminSaveButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Student Selector */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 h-fit">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Search size={16} />
            Seleccionar Alumno
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {students.map(student => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentId(student.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedStudentId === student.id ? 'bg-red-600 text-white' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                {student.name}
              </button>
            ))}
            {students.length === 0 && <p className="text-gray-400 text-sm">No hay alumnos registrados.</p>}
          </div>
        </div>

        {/* Editor Area */}
        <div className="md:col-span-3">
          {selectedStudent ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-[600px]">
              
              {/* Header with Tabs */}
              <div className="border-b border-gray-200">
                  <div className="p-6 pb-4 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h3>
                        <p className="text-gray-500 text-sm">Modificando expediente académico</p>
                    </div>
                  </div>
                  
                  <div className="flex px-6 gap-6 overflow-x-auto">
                      <button 
                        onClick={() => setActiveTab('s1')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 's1' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                         <CalendarDays size={16}/> 1º Semestre
                      </button>
                      <button 
                        onClick={() => setActiveTab('s2')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 's2' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                         <CalendarDays size={16}/> 2º Semestre
                      </button>
                      <button 
                        onClick={() => setActiveTab('summary')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'summary' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                         <PieChart size={16}/> Resumen Anual
                      </button>
                      <button 
                        onClick={() => setActiveTab('attendance')}
                        className={`pb-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'attendance' ? 'border-orange-600 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                      >
                         <Clock size={16}/> Asistencia
                      </button>
                  </div>
              </div>
              
              <div className="p-6 flex-1 bg-gray-50/30">
                <table className="w-full text-left bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-gray-600">Asignatura</th>
                      <th className="px-6 py-4 font-semibold text-gray-600 text-right w-48">
                        {activeTab === 'attendance' ? 'Horas de Falta' : 'Calificación'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subjects.map(subject => {
                      const gradeEntry = grades.find(g => g.studentId === selectedStudent.id && g.subjectId === subject.id);
                      const s1 = gradeEntry?.semester1;
                      const s2 = gradeEntry?.semester2;
                      const currentAbsences = attendance.find(a => a.studentId === selectedStudent.id && a.subjectId === subject.id)?.absences ?? 0;

                      // Calculate auto final safely
                      let final: string | number = '-';
                      if (s1 !== undefined && s2 !== undefined) final = ((s1 + s2) / 2).toFixed(2);
                      else if (s1 !== undefined) final = s1.toFixed(2) + ' (Prov.)';
                      else if (s2 !== undefined) final = s2.toFixed(2) + ' (Prov.)';

                      return (
                        <tr key={subject.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-800">
                              {subject.name}
                              <div className="text-xs text-gray-400 font-normal">{subject.teacherName}</div>
                          </td>
                          <td className="px-6 py-4 flex justify-end">
                            
                            {/* Input for Semester 1 */}
                            {activeTab === 's1' && (
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    className={`w-24 text-center border rounded-md py-2 px-3 focus:ring-2 outline-none transition-colors font-bold text-lg ${s1 !== undefined && s1 < 5 ? 'border-red-300 bg-red-50 text-red-700' : 'border-red-200 focus:ring-red-200 text-red-800'}`}
                                    value={safeValue(s1)}
                                    placeholder="-"
                                    onChange={(e) => {
                                        const valStr = e.target.value;
                                        // If empty, pass undefined to clear
                                        if (valStr === '') {
                                            updateGrade(selectedStudent.id, subject.id, 1, undefined);
                                            return;
                                        }
                                        let val = parseFloat(valStr);
                                        if (isNaN(val)) return;
                                        if (val > 10) val = 10;
                                        if (val < 0) val = 0;
                                        updateGrade(selectedStudent.id, subject.id, 1, val);
                                    }}
                                />
                            )}

                            {/* Input for Semester 2 */}
                            {activeTab === 's2' && (
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    className={`w-24 text-center border rounded-md py-2 px-3 focus:ring-2 outline-none transition-colors font-bold text-lg ${s2 !== undefined && s2 < 5 ? 'border-red-300 bg-red-50 text-red-700' : 'border-purple-200 focus:ring-purple-200 text-purple-800'}`}
                                    value={safeValue(s2)}
                                    placeholder="-"
                                    onChange={(e) => {
                                        const valStr = e.target.value;
                                        if (valStr === '') {
                                            updateGrade(selectedStudent.id, subject.id, 2, undefined);
                                            return;
                                        }
                                        let val = parseFloat(valStr);
                                        if (isNaN(val)) return;
                                        if (val > 10) val = 10;
                                        if (val < 0) val = 0;
                                        updateGrade(selectedStudent.id, subject.id, 2, val);
                                    }}
                                />
                            )}

                            {/* Summary View (Read Only Calculation) */}
                            {activeTab === 'summary' && (
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-400 flex flex-col items-end">
                                        <span>S1: <b>{safeValue(s1) || '-'}</b></span>
                                        <span>S2: <b>{safeValue(s2) || '-'}</b></span>
                                    </div>
                                    <div className={`w-32 py-2 px-3 text-center rounded-md font-bold text-sm ${typeof final === 'string' && final.includes('Prov') ? 'bg-orange-50 text-orange-800 border border-orange-200' : parseFloat(final as string) >= 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {final}
                                    </div>
                                </div>
                            )}

                            {/* Attendance Edit */}
                            {activeTab === 'attendance' && (
                              <div className="flex items-center justify-center gap-3">
                                <button 
                                  onClick={() => updateAttendance(selectedStudent.id, subject.id, Math.max(0, currentAbsences - 1))}
                                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
                                >
                                  -
                                </button>
                                <span className="w-12 text-center font-bold text-gray-800 text-lg">{currentAbsences}</span>
                                <button 
                                  onClick={() => updateAttendance(selectedStudent.id, subject.id, currentAbsences + 1)}
                                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
                                >
                                  +
                                </button>
                              </div>
                            )}

                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-gray-200 border-dashed p-12 text-gray-400">
              <Search size={48} className="mb-4 opacity-50" />
              <p className="text-lg">Selecciona un alumno del menú lateral para comenzar a editar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
