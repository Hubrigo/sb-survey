import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/admin/DashboardPage.jsx';
import SurveyListPage from './pages/admin/SurveyListPage.jsx';
import SurveyBuilderPage from './pages/admin/SurveyBuilderPage.jsx';
import PublicSurveyListPage from './pages/public/PublicSurveyListPage.jsx';
import PublicSurveyDetailPage from './pages/public/PublicSurveyDetailPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import MainLayout from './components/layout/MainLayout.jsx';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}> 
        <Route index element={<Navigate to="/public" replace />} />
        <Route path="/public" element={<PublicSurveyListPage />} />
        <Route path="/public/:surveyId" element={<PublicSurveyDetailPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/surveys" element={<SurveyListPage />} />
        <Route path="/admin/surveys/new" element={<SurveyBuilderPage />} />
        <Route path="/admin/surveys/:surveyId" element={<SurveyBuilderPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/public" replace />} />
    </Routes>
  );
}

export default App;
