import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StoreFront from './StoreFront';
import AdminLogin from './admin/AdminLogin';
import { supabase } from './lib/supabaseClient';
import { useStore } from './store/useStore';

export default function App() {
  const { fetchData, loading, setIsAdmin, isAdmin } = useStore();

  useEffect(() => {
    // Fetch store data
    fetchData();

    // Check auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
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

        <Route path="/admin/*" element={isAdmin ? <Navigate to="/" /> : <AdminLogin />} />
      </Routes>
    </Router>
  );
}
