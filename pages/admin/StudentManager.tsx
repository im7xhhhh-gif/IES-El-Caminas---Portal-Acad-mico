
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { User, UserRole } from '../../types';
import { Plus, Trash2, Edit2, Search, X, Eye, Fingerprint } from 'lucide-react';
import { InputField } from '../../components/InputField';

export const StudentManager: React.FC = () => {
  const { users, addUser, updateUser, updateStudentId, deleteUser } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    username: '',
    password: '',
    academicYear: '2025-2026',
    group: '1º Desarrollo de Aplicaciones Multiplataforma'
  });

  const students = users.filter(u => 
    u.role === UserRole.STUDENT && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenEditModal = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({ 
          id: user.id, 
          name: user.name, 
          username: user.username, 
          password: user.password || '',
          academicYear: user.academicYear || '2025-2026',
          group: user.group || '1º Desarrollo de Aplicaciones Multiplataforma'
      });
    } else {
      setSelectedUser(null);
      // Generate a simple ID for new users
      setFormData({ 
          id: Date.now().toString(), 
          name: '', 
          username: '', 
          password: '',
          academicYear: '2025-2026',
          group: '1º Desarrollo de Aplicaciones Multiplataforma'
      });
    }
    setIsEditModalOpen(true);
  };

  const handleOpenViewModal = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
        // If ID changed, we need to cascade update
        if (selectedUser.id !== formData.id) {
            updateStudentId(selectedUser.id, formData.id);
            // After changing ID, update other fields using the new ID
            updateUser({ 
                ...selectedUser, 
                id: formData.id, 
                name: formData.name, 
                username: formData.username, 
                password: formData.password || undefined,
                role: UserRole.STUDENT,
                academicYear: formData.academicYear,
                group: formData.group
            });
        } else {
            updateUser({ 
                ...selectedUser, 
                name: formData.name, 
                username: formData.username,
                password: formData.password || undefined,
                role: UserRole.STUDENT,
                academicYear: formData.academicYear,
                group: formData.group
            });
        }
    } else {
      addUser({
        id: formData.id,
        role: UserRole.STUDENT,
        name: formData.name,
        username: formData.username,
        password: formData.password,
        academicYear: formData.academicYear,
        group: formData.group
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-300 pb-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 uppercase">Gestión de Alumnado</h2>
            <p className="text-sm text-gray-500">Administración de expedientes</p>
        </div>
        <button 
          onClick={() => handleOpenEditModal()} 
          className="flex items-center gap-2 bg-red-900 text-white px-4 py-2 rounded-sm hover:bg-red-800 transition-colors shadow-sm text-sm uppercase font-bold tracking-wide"
        >
          <Plus size={16} />
          <span>Alta Alumno</span>
        </button>
      </div>

      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="p-4 border-b border-gray-300 bg-gray-50 flex items-center gap-2">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Filtrar por nombre, NIA o usuario..." 
            className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-600 border-b border-gray-300">
                <th className="px-6 py-3 font-bold uppercase w-32">NIA</th>
                <th className="px-6 py-3 font-bold uppercase">Nombre Completo</th>
                <th className="px-6 py-3 font-bold uppercase">Usuario Acceso</th>
                <th className="px-6 py-3 font-bold uppercase text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length > 0 ? (
                students.map((student, idx) => (
                  <tr key={student.id} className={`hover:bg-red-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-3 font-mono text-gray-900 font-bold">{student.id}</td>
                    <td className="px-6 py-3 font-medium text-gray-800">{student.name}</td>
                    <td className="px-6 py-3 text-gray-600">{student.username}</td>
                    <td className="px-6 py-3 text-right flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenViewModal(student)}
                        className="p-1.5 text-gray-600 hover:bg-white hover:text-red-900 border border-transparent hover:border-red-900 rounded-sm transition-all"
                        title="Ver Perfil"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenEditModal(student)}
                        className="p-1.5 text-red-800 hover:bg-white border border-transparent hover:border-red-900 rounded-sm transition-all"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm('¿Confirma la baja definitiva del alumno y el borrado de su expediente?')) deleteUser(student.id); }}
                        className="p-1.5 text-red-700 hover:bg-white border border-transparent hover:border-red-700 rounded-sm transition-all"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                    No se han encontrado registros que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-400 shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200 rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 uppercase">
                {selectedUser ? 'Editar Expediente' : 'Nueva Alta'}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              <div className="p-3 bg-red-50 border border-red-200 mb-4 text-xs text-red-900">
                <strong>Instrucción:</strong> El NIA (Número de Identificación del Alumno) debe ser único.
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-1">
                     <InputField 
                        label="NIA (ID Alumno)" 
                        value={formData.id} 
                        onChange={(e) => setFormData({...formData, id: e.target.value})}
                        required
                        className="font-mono bg-gray-50"
                     />
                  </div>
                  <div className="md:col-span-1">
                     <InputField 
                        label="Nombre y Apellidos" 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                     />
                  </div>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4 mb-4">
                  <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Datos Académicos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField 
                        label="Curso Académico" 
                        value={formData.academicYear} 
                        onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                        required
                      />
                      <InputField 
                        label="Grupo / Ciclo" 
                        value={formData.group} 
                        onChange={(e) => setFormData({...formData, group: e.target.value})}
                        required
                      />
                  </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Credenciales de Acceso</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        label="Usuario" 
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                    />
                    <InputField 
                        label="Contraseña" 
                        type="password"
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required={!selectedUser}
                        placeholder={selectedUser ? "Sin cambios" : ""}
                    />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-sm text-sm font-bold uppercase"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-red-900 text-white rounded-sm hover:bg-red-800 transition-colors text-sm font-bold uppercase shadow-sm"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-400 shadow-xl w-full max-w-sm animate-in fade-in zoom-in duration-200 rounded-sm overflow-hidden">
            <div className="bg-red-900 p-4 relative flex justify-between items-center">
              <h2 className="text-white font-bold uppercase text-sm">Ficha Resumen</h2>
              <button 
                onClick={() => setIsViewModalOpen(false)} 
                className="text-red-200 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
                
                <div className="border border-gray-200 p-4 bg-gray-50 space-y-3">
                    <div>
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">NIA</p>
                        <p className="text-base font-mono font-bold text-gray-900">{selectedUser.id}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Alumno</p>
                        <p className="text-base text-gray-900">{selectedUser.name}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Grupo</p>
                        <p className="text-sm text-gray-900">{selectedUser.group || 'No asignado'}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Curso Académico</p>
                        <p className="text-sm text-gray-900">{selectedUser.academicYear || '2025-2026'}</p>
                    </div>
                </div>

                <button 
                  onClick={() => { setIsViewModalOpen(false); handleOpenEditModal(selectedUser); }}
                  className="w-full mt-2 py-2 text-sm text-red-900 bg-white border border-red-900 hover:bg-red-50 rounded-sm transition-colors font-bold uppercase"
                >
                    Modificar Datos
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
