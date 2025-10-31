import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PreferencesProvider } from './contexts/PreferencesContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Sidebar from './components/layout/Sidebar';
import NotificationCenter from './components/notifications/NotificationCenter';
import { usePreferences } from './contexts/PreferencesContext';
import MarcacionesPage from './pages/marcaciones/MarcacionesPage';
import MaterialesPage from './pages/materiales/MaterialesPage';
import StockPage from './pages/stock/StockPage';
import DistributionPage from './pages/distribution/DistributionPage';
import CoverageDashboardPage from './components/dashboard/CoverageDashboard';
import MaterialDetailDashboard from './components/dashboard/MaterialDetailDashboard';
import GeneralDistributionDashboard from './components/dashboard/GeneralDistributionDashboard';
import RepresentativesList from './components/representatives/RepresentativesList';
import './App.css';

const AppContent = () => {
  const { sidebarCollapsed } = usePreferences();

  return (
    <div className="app">
      <Sidebar />
      <div className={`app-content with-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/marcaciones" replace />} />
          <Route path="/marcaciones" element={<MarcacionesPage />} />
          <Route path="/marcaciones/:id/dashboard" element={<CoverageDashboardPage />} />
          <Route path="/marcaciones/:id/material/:materialId" element={<MaterialDetailDashboard />} />
          <Route path="/marcaciones/:id/general-distribution" element={<GeneralDistributionDashboard />} />
          <Route path="/representantes" element={<RepresentativesList />} />
          <Route path="/materiales" element={<MaterialesPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/distribucion" element={<DistributionPage />} />
        </Routes>
      </div>
      <NotificationCenter />
    </div>
  );
};

function App() {
  return (
    <PreferencesProvider>
      <NotificationProvider>
        <Router>
          <AppContent />
        </Router>
      </NotificationProvider>
    </PreferencesProvider>
  );
}

export default App;
