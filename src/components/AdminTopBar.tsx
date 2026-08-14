import { useStore } from '../store/useStore'
import { supabase } from '../lib/supabaseClient'

export default function AdminTopBar() {
  const { isAdmin, setIsAdmin } = useStore()

  if (!isAdmin) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAdmin(false)
  }

  return (
    <div className="admin-top-bar">
      <div className="admin-top-info">
        <span className="admin-indicator"></span>
        <strong>Modo Edición Activado</strong>
        <span className="admin-mobile-hide">— Puedes editar cualquier producto o información haciendo clic en los botones.</span>
      </div>
      <button onClick={handleLogout} className="btn-logout" type="button">
        Cerrar Sesión
      </button>
    </div>
  )
}
