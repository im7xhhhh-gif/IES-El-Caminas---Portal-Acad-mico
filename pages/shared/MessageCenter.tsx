import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { UserRole, Message } from '../../types';
import { Mail, Reply, Trash2, Search, CheckCircle2, Clock } from 'lucide-react';

export const MessageCenter: React.FC = () => {
  const { currentUser } = useAuth();
  const { messages, replyMessage, deleteMessage, markAsRead } = useData();
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  if (!currentUser) return null;

  // Filter messages based on role
  // Admin sees all. Teacher sees only those addressed to their name.
  const relevantMessages = messages.filter(m => {
    if (currentUser.role === UserRole.ADMIN) return true;
    return m.teacherName === currentUser.name;
  });

  const filteredMessages = relevantMessages.filter(m => {
    if (filter === 'unread') return m.status === 'sent';
    if (filter === 'replied') return m.status === 'replied';
    return true;
  }).sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());

  const handleExpand = (msg: Message) => {
    if (expandedId === msg.id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.id);
      setReplyText('');
      if (msg.status === 'sent' && currentUser.role !== UserRole.STUDENT) {
        markAsRead(msg.id);
      }
    }
  };

  const handleReply = (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    replyMessage(msgId, replyText);
    setExpandedId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
            {currentUser.role === UserRole.ADMIN ? 'Centro de Mensajes (Admin)' : 'Buzón de Mensajes'}
        </h2>
        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button onClick={() => setFilter('all')} className={`px-4 py-2 text-sm rounded transition-colors ${filter === 'all' ? 'bg-red-100 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>Todos</button>
            <button onClick={() => setFilter('unread')} className={`px-4 py-2 text-sm rounded transition-colors ${filter === 'unread' ? 'bg-red-100 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>Pendientes</button>
            <button onClick={() => setFilter('replied')} className={`px-4 py-2 text-sm rounded transition-colors ${filter === 'replied' ? 'bg-red-100 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>Respondidos</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredMessages.length > 0 ? (
            <div className="divide-y divide-gray-100">
                {filteredMessages.map(msg => (
                    <div key={msg.id} className={`transition-colors ${msg.status === 'sent' ? 'bg-red-50/50' : 'bg-white'}`}>
                        <div 
                            onClick={() => handleExpand(msg)}
                            className="p-4 cursor-pointer hover:bg-gray-50 flex items-start gap-4"
                        >
                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${msg.status === 'sent' ? 'bg-red-500' : 'bg-transparent'}`} />
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm truncate ${msg.status === 'sent' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                        {msg.studentName}
                                    </h4>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                        {new Date(msg.sentAt).toLocaleDateString()} {new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1 truncate font-medium">{msg.title}</p>
                                <p className="text-xs text-gray-400">{msg.subjectName}</p>
                            </div>
                        </div>

                        {expandedId === msg.id && (
                            <div className="px-10 pb-6 pt-2 animate-in slide-in-from-top-2">
                                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                    <p className="text-gray-800 whitespace-pre-line text-sm leading-relaxed">{msg.body}</p>
                                </div>

                                {msg.response ? (
                                    <div className="ml-4 pl-4 border-l-2 border-green-300">
                                        <p className="text-xs font-bold text-green-700 mb-1">Respuesta enviada:</p>
                                        <p className="text-sm text-gray-700">{msg.response}</p>
                                    </div>
                                ) : (
                                    <form onSubmit={(e) => handleReply(e, msg.id)} className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Responder al alumno:</label>
                                        <textarea
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none mb-3"
                                            rows={3}
                                            placeholder="Escribe tu respuesta..."
                                            required
                                        ></textarea>
                                        <div className="flex justify-between items-center">
                                             {currentUser.role === UserRole.ADMIN && (
                                                <button 
                                                    type="button"
                                                    onClick={() => { if(confirm('¿Borrar mensaje?')) deleteMessage(msg.id); }}
                                                    className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                                >
                                                    <Trash2 size={14}/> Eliminar
                                                </button>
                                             )}
                                             <div className="flex gap-2 ml-auto">
                                                <button
                                                    type="submit" 
                                                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
                                                >
                                                    <Reply size={16} /> Responder
                                                </button>
                                             </div>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="text-gray-400" size={24} />
                </div>
                <p className="text-gray-500">No tienes mensajes en esta bandeja.</p>
            </div>
        )}
      </div>
    </div>
  );
};