import { useState } from 'react'
import { WhatsAppIcon } from './ui/SharedUI'
import { WHATSAPP_NUMBER } from '../data/constants'

interface NavbarProps {
  activeSection: string
  setActiveSection: (s: string) => void
  cartCount: number
  onCartClick: () => void
}

const navLinks = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'historia', label: 'Nuestra Historia' },
  { id: 'tienda', label: 'Tienda' },
  { id: 'galeria', label: 'Galería' },
  { id: 'contacto', label: 'Contacto' },
]

export default function Navbar({ activeSection, setActiveSection, cartCount, onCartClick }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => setActiveSection('inicio')}>
        <img src="/galeria/logo.png" alt="logo" className="logo-img" />
      </div>
      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} type="button" aria-label="Menú">
        <span /><span /><span />
      </button>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(l => (
          <li key={l.id}>
            <button
              className={activeSection === l.id ? 'active' : ''}
              onClick={() => { setActiveSection(l.id); setMenuOpen(false) }}
              type="button"
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
      <button className="cart-btn" onClick={onCartClick} type="button" aria-label="Carrito">
        <span className="cart-icon">🛒</span>
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </nav>
  )
}

// Footer también va aquí por ser pequeño
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <img src="/galeria/logo.png" alt="Logo" className="footer-logo" />
        <div className="footer-info">
          <p>© 2025 Carnicería Hermanos Gómez · Tres generaciones de tradición</p>
          <p>General Díaz Porlier, 21 · 28001 Madrid · Tel: 91 402 59 92</p>
        </div>
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="footer-wa">
          <WhatsAppIcon width={28} height={28} />
        </a>
      </div>
    </footer>
  )
}