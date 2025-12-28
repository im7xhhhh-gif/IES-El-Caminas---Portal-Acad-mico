import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Send, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export const ContactTeachers: React.FC = () => {
  const { currentUser } = useAuth();
  const { subjects, messages, sendMessage } = useData();
  const [isComposing, setIsComposing] = useState(false);
  const [form, setForm] = useState({
    subjectId: '',
    title: '',
    body: ''
  });

  if (!currentUser) return null;

  const myMessages = messages.filter(m => m.studentId === currentUser.id).sort((a, b) => 
    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedSubject = subjects.find(s => s.id === form.subjectId);
    if (!selectedSubject) return;

    sendMessage({
      studentId: currentUser.id,
      studentName: currentUser.name,
      teacherName: selectedSubject.teacherName,
      subjectId: selectedSubject.id,
      subjectName: selectedSubject.name,
      title: form.title,
      body: form.body
    });

    setForm({ subjectId: '', title: '', body: '' });
    setIsComposing(false);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'replied': return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-700"><CheckCircle2 size={12}/> Respondido</span>;
      case 'read': return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700"><CheckCircle2 size={12}/> Leído</span>;
      default: return <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-700"><Clock size={12}/> Enviado</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Contacto con Profesores</h2>
        <button 
          onClick={() => setIsComposing(!isComposing)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Nuevo Mensaje</span>
        </button>
      </div>

      {isComposing && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Redactar Mensaje</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asignatura</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  value={form.subjectId}
                  onChange={e => setForm({...form, subjectId: e.target.value})}
                  required
                >
                  <option value="">Selecciona una asignatura</option>
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name} (Prof. {sub.teacherName})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Resumen de la consulta"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="Escribe tu consulta aquí..."
                value={form.body}
                onChange={e => setForm({...form, body: e.target.value})}
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsComposing(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Send size={16} />
                Enviar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {myMessages.length > 0 ? (
          myMessages.map(msg => (
            <div key={msg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-50 bg-gray-50 flex flex-col md:flex-row justify-between md:items-center gap-2">
                <div>
                    <h4 className="font-bold text-gray-800">{msg.title}</h4>
                    <p className="text-sm text-gray-500">Para: <span className="font-medium text-gray-700">{msg.teacherName}</span> • {msg.subjectName}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{new Date(msg.sentAt).toLocaleDateString()}</span>
                    {getStatusBadge(msg.status)}
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="text-gray-700 whitespace-pre-line">
                    {msg.body}
                </div>
                
                {msg.response && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 mt-4">
                        <p className="text-xs font-bold text-red-700 mb-1 flex items-center gap-1">
                            <CheckCircle2 size={12}/> Respuesta del Profesor ({new Date(msg.repliedAt!).toLocaleDateString()})
                        </p>
                        <p className="text-gray-800 whitespace-pre-line">{msg.response}</p>
                    </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-gray-400" size={24} />
            </div>
            <p className="text-gray-500 font-medium">No has enviado ningún mensaje todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
};