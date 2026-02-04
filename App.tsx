import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './services/LanguageContext';
import { DataProvider, useData } from './services/DataContext';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { LibraryPortal } from './pages/student/LibraryPortal';
import { LibraryAdminDashboard } from './pages/library/LibraryAdminDashboard';
import { UserRole } from './types';

// Extract inner component to use useData hook
const AppRoutes: React.FC = () => {
  const { userRole, logout } = useData();

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    if (!userRole) {
      return <Navigate to="/" replace />;
    }
    return (
      <>
        <Navbar onLogout={logout} showNotifications={userRole === UserRole.STUDENT} />
        {children}
      </>
    );
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          !userRole ? (
            <Landing onRoleSelect={() => {}} />
          ) : userRole === UserRole.STUDENT ? (
            <Navigate to="/student/dashboard" replace />
          ) : (
            <Navigate to="/library/dashboard" replace />
          )
        } 
      />
      
      <Route 
        path="/auth/student" 
        element={<AuthPage role={UserRole.STUDENT} />} 
      />
      
      <Route 
        path="/auth/library" 
        element={<AuthPage role={UserRole.LIBRARY_ADMIN} />} 
      />

      <Route 
        path="/student/dashboard" 
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/student/library/:id" 
        element={
          <ProtectedRoute>
            <LibraryPortal />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/library/dashboard" 
        element={
          <ProtectedRoute>
            <LibraryAdminDashboard />
          </ProtectedRoute>
        } 
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
    </LanguageProvider>
  );
}