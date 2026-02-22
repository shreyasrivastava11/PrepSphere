import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MockTestPage from './pages/MockTestPage';
import PerformancePage from './pages/PerformancePage';
import ProfilePage from './pages/ProfilePage';
import QuestionSolvePage from './pages/QuestionSolvePage';
import QuestionsPage from './pages/QuestionsPage';
import RegisterPage from './pages/RegisterPage';
import ResultPage from './pages/ResultPage';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/home'} replace />} />
        <Route path="/home" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/questions/:id" element={<QuestionSolvePage />} />
          <Route path="/mock-test" element={<MockTestPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/home'} replace />} />
      </Routes>
    </Layout>
  );
}
