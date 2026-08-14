import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabaseClient'
import { useState } from 'react'

export default function AdminTopBar() {
  const { isAdmin, setIsAdmin, categories: storeCategories, fetchData } = useStore()
  const [isMigrating, setIsMigrating] = useState(false)

  if (!isAdmin) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAdmin(false)
  }

  const handleMigrate = async () => {
    if (!window.confirm("¿Seguro que quieres migrar los datos jarcodeados a Supabase?")) return;
    setIsMigrating(true);
    try {
      const { categories } = await import('../data/categories');
      
      // First migrate some store settings
      const { WHATSAPP_NUMBER } = await import('../data/constants');
      await supabase.from('store_info').upsert([
        { key: 'whatsapp_number', value: WHATSAPP_NUMBER },
        { key: 'store_name', value: 'Carnicería Hermanos Gómez' }
      ]);

      // Then loop all categories and their products
      for (const cat of categories) {
        await supabase.from('categories').upsert({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          color: cat.color
        });
        
        for (const prod of cat.products) {
          await supabase.from('products').upsert({
            id: prod.id,
            category_id: cat.id,
            name: prod.name,
            price: prod.price,
            emoji: prod.emoji,
            image: prod.image,
            description: prod.description
          });
        }
      }
      alert('Migración exitosa, datos subidos a Supabase.');
      await fetchData();
    } catch (err: any) {
      alert("Error en migración: " + err.message);
    }
    setIsMigrating(false);
  }

  return (
    <div className="admin-top-bar">
      <div className="admin-top-info">
        <span className="admin-indicator"></span>
        <strong>Modo Edición Activado</strong>
        <span className="admin-mobile-hide">— Puedes editar cualquier producto o información haciendo clic en los botones.</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {storeCategories.length === 0 && (
          <button onClick={handleMigrate} disabled={isMigrating} className="btn-migrate" style={{ background: '#eab308', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isMigrating ? 'Migrando...' : 'Migrar Datos a DB'}
          </button>
        )}
        <button onClick={handleLogout} className="btn-logout" type="button">
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
