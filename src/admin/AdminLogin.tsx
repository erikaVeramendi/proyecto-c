import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import './Admin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setIsAdmin } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciales incorrectas o error de conexión. Intenta de nuevo.');
    } else if (data.session) {
      setIsAdmin(true);
      navigate('/'); // Go back to storefront as an Admin
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-hero">
        <div className="login-glow"></div>
        <div className="admin-login-card premium-glass">
          <div className="login-icon-container">
            <ShieldCheck size={48} className="shield-icon" />
          </div>
          
          <h2>Acceso Clasificado</h2>
          <p className="login-subtitle">Introduce tus credenciales para habilitar el Modo Edición WYSIWYG.</p>
          
          <form onSubmit={handleLogin} className="premium-form">
            {error && <div className="premium-alert error">{error}</div>}
            
            <div className="form-group premium-group">
              <label>Correo Electrónico</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="administrador@correo.com"
                required 
              />
            </div>
            
            <div className="form-group premium-group relative-group">
              <label>Contraseña</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••••••"
                  required 
                />
                <button 
                  type="button" 
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary login-btn">
              {loading ? 'Autenticando...' : 'Habilitar Modo Edición'}
            </button>
          </form>
          
          <div className="back-to-store">
            <button onClick={() => navigate('/')} className="btn-link">
              ← Volver a la Tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
