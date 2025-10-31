import { Link, useLocation } from 'react-router-dom';
import { usePreferences } from '../../contexts/PreferencesContext';
import './Sidebar.css';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const Sidebar = () => {
  const { theme, sidebarCollapsed, toggleTheme, toggleSidebar } = usePreferences();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    { id: 'marcaciones', label: 'Marcaciones', icon: 'assignment', path: '/marcaciones' },
    { id: 'representantes', label: 'Representantes', icon: 'people', path: '/representantes' },
    { id: 'materiales', label: 'Materiales', icon: 'inventory_2', path: '/materiales' },
    { id: 'stock', label: 'Gestión de Stock', icon: 'warehouse', path: '/stock' },
    { id: 'distribucion', label: 'Distribución', icon: 'local_shipping', path: '/distribucion' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="material-icons logo-icon">medical_services</span>
          {!sidebarCollapsed && <span className="logo-text">MM Distribution</span>}
        </div>
        <button className="sidebar-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
          <span className="material-icons">
            {sidebarCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            title={sidebarCollapsed ? item.label : ''}
          >
            <span className="material-icons">{item.icon}</span>
            {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
          <span className="material-icons">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
          {!sidebarCollapsed && (
            <span className="nav-label">
              {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
