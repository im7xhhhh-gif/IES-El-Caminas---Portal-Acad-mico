import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, BookOpen, Mail, User, CalendarDays, PieChart, MessageSquare, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, logout, isAdmin } = useAuth();

  if (!currentUser) return <>{children}</>;

  const isTeacher = currentUser.role === UserRole.TEACHER;

  // Navigation Links Definition
  type NavItem = {
      to: string;
      icon: any;
      label: string;
      end?: boolean;
  };

  const adminLinks: NavItem[] = [
    { to: "/admin", icon: LayoutDashboard, label: "Panel General", end: true },
    { to: "/admin/students", icon: Users, label: "Alumnado" },
    { to: "/admin/academic", icon: BookOpen, label: "Gestión Académica" },
    { to: "/admin/messages", icon: Mail, label: "Mensajería" },
  ];

  const teacherLinks: NavItem[] = [
    { to: "/teacher", icon: Mail, label: "Buzón Docente", end: true },
  ];

  const studentLinks: NavItem[] = [
    { to: "/student/summary", icon: PieChart, label: "Resumen Expediente" },
    { to: "/student/semester-1", icon: CalendarDays, label: "Notas 1º Semestre" },
    { to: "/student/semester-2", icon: CalendarDays, label: "Notas 2º Semestre" },
    { to: "/student/contact", icon: MessageSquare, label: "Contacto" },
    { to: "/student/profile", icon: User, label: "Mi Ficha" },
  ];

  const links = isAdmin ? adminLinks : isTeacher ? teacherLinks : studentLinks;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* 1. Header Institucional (Logos y Nombre) */}
      <header className="bg-white border-b border-gray-300 h-20 px-4 md:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          {/* Logo Simulado Conselleria */}
          <div className="flex items-center gap-3">
             <Shield className="h-10 w-10 text-gray-800" strokeWidth={1.5} />
             <div className="flex flex-col border-l-2 border-gray-800 pl-4 h-10 justify-center">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 leading-none mb-1">Generalitat Valenciana</span>
                <span className="text-sm font-bold text-gray-800 leading-none">Conselleria d'Educació</span>
             </div>
          </div>
          
          {/* Nombre Centro */}
          <div className="hidden md:block h-8 w-px bg-gray-300 mx-2"></div>
          <div className="hidden md:flex flex-col justify-center">
             <h1 className="text-xl font-bold text-red-900 leading-tight">IES EL CAMINAS</h1>
             <p className="text-xs text-gray-500 uppercase tracking-wide">Código de Centro: 12004213</p>
          </div>
        </div>

        {/* User Info & Logout - Top Right */}
        <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-800">{currentUser.name}</p>
                <p className="text-xs text-gray-500 uppercase">
                    {currentUser.role === UserRole.ADMIN ? 'Administrador' : currentUser.role === UserRole.TEACHER ? 'Docente' : 'Alumno'}
                </p>
            </div>
            <button 
                onClick={logout}
                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-red-200 text-red-900 hover:bg-red-50 text-xs font-bold uppercase tracking-wide rounded-sm transition-colors"
                title="Cerrar Sesión"
            >
                <LogOut size={14} />
                <span className="hidden sm:inline">Desconectar</span>
            </button>
        </div>
      </header>

      {/* 2. Barra de Navegación Horizontal */}
      <nav className="bg-red-900 text-white shadow-md shrink-0 sticky top-0 z-50">
        <div className="px-4 md:px-8 max-w-7xl mx-auto overflow-x-auto">
            <div className="flex h-12 items-center gap-1">
                {links.map((link) => (
                    <NavLink 
                        key={link.to} 
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) => 
                            `flex items-center gap-2 px-4 h-12 text-sm font-medium border-b-4 transition-colors whitespace-nowrap ${
                                isActive 
                                ? 'bg-red-800 border-white text-white' 
                                : 'border-transparent text-red-100 hover:text-white hover:bg-red-800'
                            }`
                        }
                    >
                        <link.icon size={16} />
                        <span>{link.label}</span>
                    </NavLink>
                ))}
            </div>
        </div>
      </nav>

      {/* 3. Contenido Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white border border-gray-300 shadow-sm p-6 md:p-8 min-h-[500px]">
            {children}
        </div>
      </main>

      {/* 4. Footer Institucional */}
      <footer className="bg-gray-200 border-t border-gray-300 py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
                <span className="font-bold text-gray-700 uppercase">IES El Caminas</span>
                <span>C/ Ficticia s/n, 12006 Castellón de la Plana</span>
                <span>Tel: 964 00 00 00 | Email: 12004213@edu.gva.es</span>
            </div>
            <div className="flex gap-4">
                <a href="#" className="hover:underline hover:text-red-900">Aviso Legal</a>
                <a href="#" className="hover:underline hover:text-red-900">Política de Privacidad</a>
                <a href="#" className="hover:underline hover:text-red-900">Accesibilidad</a>
            </div>
            <div>
                © {new Date().getFullYear()} Generalitat Valenciana
            </div>
        </div>
      </footer>
    </div>
  );
};