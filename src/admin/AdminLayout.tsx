import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Package, Folder, Settings, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './Admin.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Panel Admin</h2>
          <a href="/" target="_blank" rel="noreferrer" className="view-store-link">Ver Tienda</a>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/products" className={({isActive}) => isActive ? 'active' : ''}>
            <Package size={20} /> Productos
          </NavLink>
          <NavLink to="/admin/categories" className={({isActive}) => isActive ? 'active' : ''}>
            <Folder size={20} /> Categorías
          </NavLink>
          <NavLink to="/admin/store" className={({isActive}) => isActive ? 'active' : ''}>
            <Settings size={20} /> Info Tienda
          </NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
