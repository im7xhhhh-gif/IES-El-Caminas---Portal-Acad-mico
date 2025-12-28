
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentManager } from './pages/admin/StudentManager';
import { AcademicManager } from './pages/admin/AcademicManager';
import { StudentPortal } from './pages/student/StudentPortal';
import { StudentProfile } from './pages/student/StudentProfile';
import { ContactTeachers } from './pages/student/ContactTeachers';
import { MessageCenter } from './pages/shared/MessageCenter';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: UserRole | UserRole[] }> = ({ children, requiredRole }) => {
  const { currentUser, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow if no specific role required, or if user has ONE of the required roles
  if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(currentUser!.role)) {
        if (currentUser?.role === UserRole.ADMIN) return <Navigate to="/admin" replace />;
        if (currentUser?.role === UserRole.TEACHER) return <Navigate to="/teacher" replace />;
        if (currentUser?.role === UserRole.STUDENT) return <Navigate to="/student/summary" replace />;
        return <Navigate to="/login" replace />;
      }
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { currentUser } = useAuth();

    const getRedirectPath = () => {
        if (!currentUser) return "/login";
        if (currentUser.role === UserRole.ADMIN) return "/admin";
        if (currentUser.role === UserRole.TEACHER) return "/teacher";
        return "/student/summary";
    }

    return (
        <Routes>
            <Route path="/login" element={currentUser ? <Navigate to={getRedirectPath()} /> : <Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <Layout>
                        <AdminDashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/admin/students" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <Layout>
                        <StudentManager />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/admin/academic" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <Layout>
                        <AcademicManager />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/admin/messages" element={
                <ProtectedRoute requiredRole={UserRole.ADMIN}>
                    <Layout>
                        <MessageCenter />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Teacher Routes */}
            <Route path="/teacher" element={
                <ProtectedRoute requiredRole={UserRole.TEACHER}>
                    <Layout>
                        <MessageCenter />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Student Routes */}
            <Route path="/student" element={<Navigate to="/student/summary" replace />} />
            
            <Route path="/student/profile" element={
                <ProtectedRoute requiredRole={UserRole.STUDENT}>
                    <Layout>
                        <StudentProfile />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/student/semester-1" element={
                <ProtectedRoute requiredRole={UserRole.STUDENT}>
                    <Layout>
                        <StudentPortal view="s1" />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/student/semester-2" element={
                <ProtectedRoute requiredRole={UserRole.STUDENT}>
                    <Layout>
                        <StudentPortal view="s2" />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/student/summary" element={
                <ProtectedRoute requiredRole={UserRole.STUDENT}>
                    <Layout>
                        <StudentPortal view="summary" />
                    </Layout>
                </ProtectedRoute>
            } />

            <Route path="/student/contact" element={
                <ProtectedRoute requiredRole={UserRole.STUDENT}>
                    <Layout>
                        <ContactTeachers />
                    </Layout>
                </ProtectedRoute>
            } />

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <DataProvider>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
      </DataProvider>
    </HashRouter>
  );
};

export default App;
