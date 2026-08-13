import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StoreFront from './StoreFront';
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import ManageProducts from './admin/ManageProducts';
import ManageStore from './admin/ManageStore';
import ManageCategories from './admin/ManageCategories';
import { supabase } from './lib/supabaseClient';
import { useStore } from './store/useStore';

export default function App() {
  const { fetchData, loading } = useStore();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Fetch store data
    fetchData();

    // Check auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  if (loading) {
    return <div className="loading-screen" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando tienda...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rutas de la tienda cliente */}
        <Route path="/*" element={<StoreFront />} />

        {/* Rutas del panel de administración */}
        <Route path="/admin/login" element={session ? <Navigate to="/admin" /> : <AdminLogin />} />
        
        <Route path="/admin" element={session ? <AdminLayout /> : <Navigate to="/admin/login" />}>
          <Route index element={<Navigate to="products" />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="categories" element={<ManageCategories />} />
          <Route path="store" element={<ManageStore />} />
        </Route>
      </Routes>
    </Router>
  );
}
