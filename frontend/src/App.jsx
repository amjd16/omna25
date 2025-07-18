import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import NotaryHeadDashboard from './components/notary-head/NotaryHeadDashboard';
import NotaryDashboard from './components/notary/NotaryDashboard';
import './App.css';
import './styles/mobile.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" dir="rtl">
          <Routes>
            {/* الصفحة الرئيسية - توجيه إلى تسجيل الدخول */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* صفحة تسجيل الدخول */}
            <Route path="/login" element={<Login />} />
            
            {/* لوحة تحكم مدير النظام */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* لوحة تحكم رئيس قلم التوثيق */}
            <Route 
              path="/notary-head/dashboard" 
              element={
                <ProtectedRoute requiredRole="notary_head">
                  <NotaryHeadDashboard />
                </ProtectedRoute>
              } 
            />

            {/* لوحة تحكم الأمين الشرعي */}
            <Route 
              path="/notary/dashboard" 
              element={
                <ProtectedRoute requiredRole="notary">
                  <NotaryDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* صفحة 404 */}
            <Route path="*" element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">الصفحة المطلوبة غير موجودة</p>
                  <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    العودة للرئيسية
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
