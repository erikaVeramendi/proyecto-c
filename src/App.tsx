import { useState, useEffect, useRef } from 'react'
import './App.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface CartItem {
  id: string
  name: string
  category: string
  price: number
  unit: string
  quantity: number
  emoji: string
}

interface Product {
  id: string
  name: string
  price: number
  unit: string
  emoji: string
  description: string
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
  products: Product[]
}

// ─── Data ────────────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '59176446793'

const reviews = [
  { name: 'María González', stars: 5, text: 'La mejor carnicería de Madrid. Llevo 20 años comprando aquí y la calidad nunca falla.', date: 'Hace 2 semanas' },
  { name: 'Carlos Martínez', stars: 5, text: 'Los cortes de ternera son excepcionales. Un negocio con mucha historia y tradición.', date: 'Hace 1 mes' },
  { name: 'Ana López', stars: 5, text: 'Atención personalizada y productos fresquísimos. ¡Recomendado 100%!', date: 'Hace 3 semanas' },
  { name: 'Pedro Sánchez', stars: 5, text: 'La carne de cordero es la mejor que he probado. Tradición familiar que se nota en cada corte.', date: 'Hace 1 semana' },
  { name: 'Laura Fernández', stars: 5, text: 'Siempre amables y con los mejores precios. Mi carnicería de confianza desde siempre.', date: 'Hace 2 meses' },
]

const categories: Category[] = [
  {
    id: 'ternera',
    name: 'Ternera & Vaca',
    icon: '🐄',
    color: '#8B1A1A',
    products: [
      { id: 't1', name: 'Entrecot de Ternera', price: 22.90, unit: 'kg', emoji: '🥩', description: 'Corte premium, tierno y jugoso' },
      { id: 't2', name: 'Solomillo', price: 35.50, unit: 'kg', emoji: '🥩', description: 'El corte más noble de la ternera' },
      { id: 't3', name: 'Chuletón', price: 28.00, unit: 'kg', emoji: '🥩', description: 'Ideal para la parrilla' },
      { id: 't4', name: 'Aguja de Ternera', price: 14.90, unit: 'kg', emoji: '🍖', description: 'Perfecta para guisos y estofados' },
      { id: 't5', name: 'Falda de Ternera', price: 11.50, unit: 'kg', emoji: '🍖', description: 'Jugosa y llena de sabor' },
      { id: 't6', name: 'Picada de Ternera', price: 12.00, unit: 'kg', emoji: '🍖', description: 'Fresca, molida al momento' },
    ]
  },
  {
    id: 'pollo',
    name: 'Pollería',
    icon: '🐔',
    color: '#C4860A',
    products: [
      { id: 'p1', name: 'Pollo Entero', price: 6.90, unit: 'kg', emoji: '🐓', description: 'Pollo de corral fresco' },
      { id: 'p2', name: 'Pechuga de Pollo', price: 9.50, unit: 'kg', emoji: '🍗', description: 'Filetes limpios y tiernos' },
      { id: 'p3', name: 'Muslos de Pollo', price: 7.20, unit: 'kg', emoji: '🍗', description: 'Ideales al horno o a la brasa' },
      { id: 'p4', name: 'Alitas de Pollo', price: 5.80, unit: 'kg', emoji: '🍗', description: 'Perfectas para aperitivo' },
      { id: 'p5', name: 'Carcasa de Pollo', price: 2.50, unit: 'kg', emoji: '🍖', description: 'Para caldos y sopas' },
    ]
  },
  {
    id: 'cerdo',
    name: 'Cerdo',
    icon: '🐷',
    color: '#A0522D',
    products: [
      { id: 'c1', name: 'Lomo de Cerdo', price: 10.90, unit: 'kg', emoji: '🥩', description: 'Tierno y muy versátil' },
      { id: 'c2', name: 'Costillas de Cerdo', price: 8.50, unit: 'kg', emoji: '🍖', description: 'Para barbacoa o al horno' },
      { id: 'c3', name: 'Panceta de Cerdo', price: 7.90, unit: 'kg', emoji: '🥓', description: 'Crujiente y sabrosa' },
      { id: 'c4', name: 'Picada de Cerdo', price: 8.00, unit: 'kg', emoji: '🍖', description: 'Para albóndigas y hamburguesas' },
      { id: 'c5', name: 'Secreto Ibérico', price: 16.50, unit: 'kg', emoji: '🥩', description: 'Corte premium de cerdo ibérico' },
    ]
  },
  {
    id: 'cordero',
    name: 'Cordero',
    icon: '🐑',
    color: '#6B5E3E',
    products: [
      { id: 'co1', name: 'Pierna de Cordero', price: 14.90, unit: 'kg', emoji: '🍖', description: 'Para asar al horno' },
      { id: 'co2', name: 'Chuletas de Cordero', price: 18.00, unit: 'kg', emoji: '🥩', description: 'Tiernas y aromáticas' },
      { id: 'co3', name: 'Paletilla de Cordero', price: 13.50, unit: 'kg', emoji: '🍖', description: 'Jugosa y llena de sabor' },
      { id: 'co4', name: 'Picada de Cordero', price: 12.00, unit: 'kg', emoji: '🍖', description: 'Para quipes y recetas orientales' },
    ]
  },
  {
    id: 'conejo',
    name: 'Conejo',
    icon: '🐇',
    color: '#7A5C3E',
    products: [
      { id: 'cn1', name: 'Conejo Entero', price: 8.90, unit: 'kg', emoji: '🍖', description: 'Fresco, limpio y listo para cocinar' },
      { id: 'cn2', name: 'Conejo Troceado', price: 9.50, unit: 'kg', emoji: '🍖', description: 'Preparado en piezas' },
    ]
  },
  {
    id: 'pato',
    name: 'Pato & Aves',
    icon: '🦆',
    color: '#2C5F6E',
    products: [
      { id: 'pa1', name: 'Pato Entero', price: 12.90, unit: 'kg', emoji: '🦆', description: 'Pato fresco de primera' },
      { id: 'pa2', name: 'Pechuga de Pato', price: 18.00, unit: 'kg', emoji: '🍗', description: 'Magret fresco de calidad' },
      { id: 'pa3', name: 'Muslo de Pato', price: 14.50, unit: 'kg', emoji: '🍗', description: 'Ideal para confit' },
    ]
  },
]

const horarioConcurrencia = [
  { day: 'Lun', level: 3, label: 'Moderado' },
  { day: 'Mar', level: 2, label: 'Tranquilo' },
  { day: 'Mié', level: 3, label: 'Moderado' },
  { day: 'Jue', level: 4, label: 'Concurrido' },
  { day: 'Vie', level: 5, label: 'Muy concurrido' },
  { day: 'Sáb', level: 5, label: 'Muy concurrido' },
  { day: 'Dom', level: 1, label: 'Cerrado' },
]

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ stars }: { stars: number }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= stars ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

// ─── ReviewsCarousel ──────────────────────────────────────────────────────────
function ReviewsCarousel() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % reviews.length), 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="reviews-carousel">
      <div className="review-card">
        <StarRating stars={reviews[current].stars} />
        <p className="review-text">"{reviews[current].text}"</p>
        <div className="review-meta">
          <span className="review-name">{reviews[current].name}</span>
          <span className="review-date">{reviews[current].date}</span>
        </div>
      </div>
      <div className="review-dots">
        {reviews.map((_, i) => (
          <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => setCurrent(i)} />
        ))}
      </div>
    </div>
  )
}

// ─── CartSidebar ──────────────────────────────────────────────────────────────
function CartSidebar({ cart, onRemove, onClose, onQuantityChange, customerForm, onFormChange, formSubmitted, onFormSubmit }: {
  cart: CartItem[]
  onRemove: (id: string) => void
  onClose: () => void
  onQuantityChange: (id: string, qty: number) => void
  customerForm: { name: string; phone: string; delivery: string; address: string; time: string; notes: string }
  onFormChange: (f: typeof customerForm) => void
  formSubmitted: boolean
  onFormSubmit: () => void
}) {
  const [view, setView] = useState<'cart' | 'form' | 'confirm'>('cart')
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  const handleFormSave = () => {
    if (!customerForm.name || !customerForm.phone || !customerForm.time) return
    onFormSubmit()
    setView('cart')
  }

  const sendWhatsApp = () => {
    const f = customerForm
    const modalidad = f.delivery === 'pickup' ? 'Recogida en tienda' : 'Envío a domicilio'
    let msg = `🥩 PEDIDO — Carnicería Hermanos Gómez\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `👤 Cliente:        ${f.name}\n`
    msg += `📱 Teléfono:       ${f.phone}\n`
    msg += `🕐 Hora entrega:   ${f.time}\n`
    msg += `📦 Modalidad:      ${modalidad}\n`
    if (f.delivery === 'delivery') msg += `📍 Dirección:      ${f.address}\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `🛒 PRODUCTOS\n\n`
    cart.forEach(item => {
      msg += `${item.emoji} ${item.name}\n`
      msg += `   ${item.quantity} ${item.unit}  ×  ${item.price.toFixed(2)}€  =  ${(item.price * item.quantity).toFixed(2)}€\n\n`
    })
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `💰 TOTAL:  ${total.toFixed(2)}€\n`
    if (f.notes) msg += `\n📝 Notas: ${f.notes}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  // Empty cart
  if (cart.length === 0 && view !== 'form') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Tu Pedido</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="cart-empty">
          <span className="empty-icon">🛒</span>
          <p>Tu carrito está vacío</p>
          <small>Añade productos para comenzar tu pedido</small>
        </div>
      </div>
    )
  }

  // FORM
  if (view === 'form') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Tus Datos</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="order-form">
          <p className="form-intro">Rellena tus datos una vez y podrás seguir añadiendo productos cuando quieras.</p>
          <div className="form-group">
            <label>Nombre completo *</label>
            <input value={customerForm.name} onChange={e => onFormChange({...customerForm, name: e.target.value})} placeholder="Tu nombre" />
          </div>
          <div className="form-group">
            <label>Teléfono *</label>
            <input value={customerForm.phone} onChange={e => onFormChange({...customerForm, phone: e.target.value})} placeholder="Tu número" />
          </div>
          <div className="form-group">
            <label>Modalidad *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" value="pickup" checked={customerForm.delivery==='pickup'} onChange={() => onFormChange({...customerForm, delivery:'pickup'})} />
                Recogida en tienda
              </label>
              <label className="radio-label">
                <input type="radio" value="delivery" checked={customerForm.delivery==='delivery'} onChange={() => onFormChange({...customerForm, delivery:'delivery'})} />
                Envío a domicilio
              </label>
            </div>
          </div>
          {customerForm.delivery === 'delivery' && (
            <div className="form-group">
              <label>Dirección de entrega *</label>
              <input value={customerForm.address} onChange={e => onFormChange({...customerForm, address: e.target.value})} placeholder="Calle, número, piso..." />
            </div>
          )}
          <div className="form-group">
            <label>Hora deseada *</label>
            <input type="time" value={customerForm.time} onChange={e => onFormChange({...customerForm, time: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Notas adicionales</label>
            <textarea value={customerForm.notes} onChange={e => onFormChange({...customerForm, notes: e.target.value})} placeholder="Corte especial, instrucciones..." rows={3} />
          </div>
          <button className="btn-whatsapp-order"
            onClick={handleFormSave}
            disabled={!customerForm.name || !customerForm.phone || !customerForm.time || (customerForm.delivery==='delivery' && !customerForm.address)}>
            Guardar datos y continuar →
          </button>
          {cart.length > 0 && <button className="btn-back" onClick={() => setView('cart')}>← Volver al carrito</button>}
        </div>
      </div>
    )
  }

  // CONFIRM
  if (view === 'confirm') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Confirmar Pedido</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="confirm-view">
          <div className="confirm-client">
            <h4>📋 Datos del pedido</h4>
            <div className="confirm-row"><span>Cliente</span><strong>{customerForm.name}</strong></div>
            <div className="confirm-row"><span>Teléfono</span><strong>{customerForm.phone}</strong></div>
            <div className="confirm-row"><span>Hora</span><strong>{customerForm.time}</strong></div>
            <div className="confirm-row"><span>Modalidad</span><strong>{customerForm.delivery === 'pickup' ? 'Recogida en tienda' : 'Envío a domicilio'}</strong></div>
            {customerForm.delivery === 'delivery' && <div className="confirm-row"><span>Dirección</span><strong>{customerForm.address}</strong></div>}
          </div>
          <div className="confirm-products">
            <h4>🛒 Productos</h4>
            {cart.map(item => (
              <div key={item.id} className="confirm-item">
                <span>{item.emoji} {item.name}</span>
                <span>{item.quantity} {item.unit} × {item.price.toFixed(2)}€ = <strong>{(item.price * item.quantity).toFixed(2)}€</strong></span>
              </div>
            ))}
          </div>
          <div className="confirm-total">
            <span>Total</span>
            <strong>{total.toFixed(2)}€</strong>
          </div>
          <button className="btn-whatsapp-send" onClick={sendWhatsApp}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido por WhatsApp
          </button>
          <button className="btn-back" onClick={() => setView('cart')}>← Seguir añadiendo productos</button>
        </div>
      </div>
    )
  }

  // CART (default)
  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>Tu Pedido {formSubmitted && <span className="client-badge">👤 {customerForm.name}</span>}</h3>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <span className="cart-item-emoji">{item.emoji}</span>
            <div className="cart-item-info">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">{item.price.toFixed(2)}€/{item.unit}</span>
            </div>
            <div className="cart-qty-controls">
              <button onClick={() => onQuantityChange(item.id, item.quantity - 1)}>−</button>
              <span>{item.quantity}</span>
              <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>+</button>
            </div>
            <span className="cart-item-total">{(item.price * item.quantity).toFixed(2)}€</span>
            <button className="remove-btn" onClick={() => onRemove(item.id)}>✕</button>
          </div>
        ))}
      </div>
      {!formSubmitted && (
        <div className="cart-data-reminder">
          <span>⚠️ Necesitamos tus datos antes de enviar</span>
          <button className="btn-link" onClick={() => setView('form')}>Rellenar datos →</button>
        </div>
      )}
      <div className="cart-footer">
        <div className="cart-total">
          <span>Total estimado</span>
          <strong>{total.toFixed(2)}€</strong>
        </div>
        {formSubmitted ? (
          <>
            <button className="btn-finish-order" onClick={() => setView('confirm')}>
              ✅ Terminar pedido y enviar
            </button>
            <button className="btn-edit-data" onClick={() => setView('form')}>✏️ Editar mis datos</button>
          </>
        ) : (
          <button className="btn-whatsapp-order" onClick={() => setView('form')}>
            Continuar con el pedido →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState('inicio')
  const [activeCategory, setActiveCategory] = useState('ternera')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', delivery: 'pickup', address: '', time: '', notes: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const shopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  const addToCart = (product: Product, category: Category) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, category: category.name, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id))
  const changeQty = (id: string, qty: number) => {
    if (qty <= 0) removeFromCart(id)
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)
  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0]

  const scrollToShop = () => {
    setActiveSection('tienda')
    setTimeout(() => shopRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'historia', label: 'Nuestra Historia' },
    { id: 'tienda', label: 'Tienda' },
    { id: 'galeria', label: 'Galería' },
    { id: 'contacto', label: 'Contacto' },
  ]

  return (
    <div className="app">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => setActiveSection('inicio')}>
          <img src="/public/galeria/logo.png" alt="logo" className="logo-img" />
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(l => (
            <li key={l.id}>
              <button className={activeSection === l.id ? 'active' : ''} onClick={() => { setActiveSection(l.id); setMenuOpen(false) }}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <button className="cart-btn" onClick={() => setCartOpen(!cartOpen)}>
          <span className="cart-icon">🛒</span>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </nav>

      {/* ── Cart Overlay ── */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <CartSidebar
              cart={cart} onRemove={removeFromCart} onClose={() => setCartOpen(false)} onQuantityChange={changeQty}
              customerForm={customerForm} onFormChange={setCustomerForm}
              formSubmitted={formSubmitted} onFormSubmit={() => setFormSubmitted(true)}
            />
          </div>
        </div>
      )}

      {/* ══════════ INICIO ══════════ */}
      {activeSection === 'inicio' && (
        <main className="page-inicio">
          {/* Hero — compact, fits full screen */}
          <section className={`hero ${heroLoaded ? 'loaded' : ''}`}>
            <div className="hero-bg" />
            <div className="hero-grain" />
            <div className="hero-vignette" />
            <div className="hero-rings">
              <div className="ring ring-1" />
              <div className="ring ring-2" />
              <div className="ring ring-3" />
            </div>
            <div className="hero-sparks">
              {[...Array(14)].map((_, i) => (
                <div key={i} className="spark" style={{ '--i': i, '--x': `${10+(i*37+13)%80}%`, '--delay': `${(i*0.37)%4}s`, '--dur': `${3+(i*0.6)%4}s` } as React.CSSProperties} />
              ))}
            </div>
            <div className="hero-content">
              <div className="hero-logo-stage">
                <div className="hero-logo-glow" />
                <img src="/public/galeria/logo.png" alt="Carnicería Hermanos Gómez" className="hero-logo" />
              </div>
              <div className="hero-ornament">
                <span className="orn-line" /><span className="orn-diamond">◆</span><span className="orn-line" />
              </div>
              <div className="hero-tagline">
                <span className="tagline-top">Tres generaciones</span>
                <span className="tagline-middle">de pasión &amp; tradición</span>
                <span className="tagline-sub">Desde hace décadas, el mismo compromiso con la calidad</span>
              </div>
              <div className="hero-ctas">
                <button className="btn-primary" onClick={scrollToShop}>
                  <span>Ver Nuestros Productos</span>
                  <svg viewBox="0 0 20 20" width="16" fill="currentColor"><path d="M10 3l7 7-7 7M3 10h14"/></svg>
                </button>
                <a className="btn-whatsapp-hero" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="stats-strip">
            <div className="stat"><span className="stat-num">70+</span><span className="stat-label">Años de tradición</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">3ª</span><span className="stat-label">Generación familiar</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">6</span><span className="stat-label">Tipos de carne</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">★ 5.0</span><span className="stat-label">Valoración media</span></div>
          </section>

          {/* CTA tienda — first (moved up) */}
          <section className="cta-tienda">
            <div className="cta-content">
              <h2>¿Listo para hacer tu pedido?</h2>
              <p>Selecciona tus productos, indica tus datos y te enviamos tu pedido directo por WhatsApp. Fácil, rápido y personalizado.</p>
              <button className="btn-primary large" onClick={scrollToShop}>Ir a la Tienda Online</button>
            </div>
          </section>

          {/* Historia snippet — after CTA (moved down) */}
          <section className="home-historia">
            <div className="historia-left">
              <div className="vintage-frame owner-frame">
                <img src="/public/galeria/fotodueno.jpeg" alt="Eldueno" className="owner-real-img"
                  onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
                <div className="vintage-placeholder owner-placeholder" style={{display:'none'}}>
                  <span>📸</span><small>fotodueño.png</small>
                </div>
              </div>
            </div>
            <div className="historia-right">
              <span className="section-tag">Nuestra Esencia</span>
              <h2>Un legado que<br /><em>trasciende generaciones</em></h2>
              <p>Bienvenidos a Carnicería Hermanos Gómez, donde nuestra historia comienza hace varias décadas. Nuestros abuelos sembraron la semilla de esta pasión por el buen corte de carne, y hoy somos la tercera generación que honra ese legado con orgullo.</p>
              <p>Cada pieza que ofrecemos tiene una historia detrás, forjada con el paso del tiempo y el mismo objetivo de siempre: <strong>ofrecer lo mejor de la carne.</strong></p>
              <button className="btn-secondary" onClick={() => setActiveSection('historia')}>Leer nuestra historia completa →</button>
            </div>
          </section>

          {/* Horario */}
          <section className="horario-section">
            <div className="horario-card">
              <span className="section-tag">Estamos aquí para ti</span>
              <h2>Horario del Negocio</h2>
              <div className="horario-grid">
                <div className="horario-row"><span>Lunes – Viernes</span><span className="horario-time">8:00 – 14:30 / 17:00 – 20:30</span></div>
                <div className="horario-row"><span>Sábado</span><span className="horario-time">8:00 – 15:00</span></div>
                <div className="horario-row closed"><span>Domingo</span><span className="horario-time">Cerrado</span></div>
              </div>
            </div>
            <div className="concurrencia-card">
              <span className="section-tag">Planifica tu visita</span>
              <h2>Concurrencia por día</h2>
              <div className="concurrencia-bars">
                {horarioConcurrencia.map(d => (
                  <div key={d.day} className="bar-item">
                    <div className="bar-track">
                      <div className={`bar-fill level-${d.level}`} style={{ height: `${d.level === 1 ? 10 : d.level * 18}%` }} />
                    </div>
                    <span className="bar-day">{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="concurrencia-legend">
                <span className="legend-item"><span className="dot dot-low" />Tranquilo</span>
                <span className="legend-item"><span className="dot dot-mid" />Moderado</span>
                <span className="legend-item"><span className="dot dot-high" />Concurrido</span>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="reviews-section">
            <span className="section-tag">Lo que dicen nuestros clientes</span>
            <h2>Opiniones & Reseñas</h2>
            <ReviewsCarousel />
            <div className="google-rating">
              <StarRating stars={5} />
              <span>5.0 en Google · Más de 200 reseñas</span>
            </div>
          </section>
        </main>
      )}

      {/* ══════════ HISTORIA ══════════ */}
      {activeSection === 'historia' && (
        <main className="page-historia">
          <div className="historia-hero">
            <div className="historia-hero-overlay" />
            <div className="historia-hero-content">
              <span className="section-tag light">Desde siempre</span>
              <h1>Nuestra Historia</h1>
              <p>Tres generaciones, una sola pasión</p>
            </div>
          </div>
          <div className="historia-body">
            <div className="historia-timeline">
              {[
                { year: 'Los Inicios', src: '/public/galeria/fotoantigua1.jpeg', text: 'Nuestra historia comienza hace varias décadas, cuando nuestros abuelos decidieron seguir la tradición de ofrecer carnes frescas y de calidad a su comunidad. Con apenas un mostrador y mucha ilusión, abrieron las puertas de lo que se convertiría en un referente de la ciudad.' },
                { year: 'La Tradición', src: '/public/galeria/fotoantigua2.jpeg', text: 'Esa pasión por el buen corte de carne se fue transmitiendo de padres a hijos. Cada generación aportó su sello: nuevas técnicas, mejores cortes, mayor variedad. Pero siempre con la misma esencia: calidad y trato cercano al cliente.', right: true },
                { year: 'Hoy', src: '/public/galeria/fotoantigua3.jpeg', text: 'Hoy somos una familia que sigue con orgullo el legado que nos dejaron. Cada pieza que ofrecemos tiene una historia detrás, forjada de generación en generación, siempre con el mismo objetivo: ofrecer lo mejor de la carne.' },
              ].map((item, i) => (
                <div key={i} className={`timeline-item ${item.right ? 'right' : ''}`}>
                  <div className="timeline-year">{item.year}</div>
                  <div className="timeline-content">
                    <div className="vintage-frame small">
                      <img src={`/public/galeria/${item.src}`} alt={item.year} className="frame-real-img"
                        onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
                      <div className="vintage-placeholder" style={{display:'none'}}><span>🖼️</span><small>{item.src}</small></div>
                    </div>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="dueno-section">
              <div className="vintage-frame owner-frame large">
                <img src="/public/galeria/fotodueno2.jpeg" alt="Eldueno" className="owner-real-img"
                  onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
                <div className="vintage-placeholder owner-placeholder large" style={{display:'none'}}><span>📸</span><small>fotodueño.png</small></div>
              </div>
              <div className="dueno-text">
                <span className="section-tag">El maestro carnicero</span>
                <h2>El corazón del negocio</h2>
                <p>Detrás de cada corte hay una persona que ha dedicado su vida a este oficio. Aprendió de su padre, que aprendió del suyo, y hoy comparte esa sabiduría con orgullo en cada producto que ofrece.</p>
                <p>Ubicados en General Díaz Porlier, 21 – Madrid, somos especialistas en ternera, pollería, cordero y cerdo, con el mismo compromiso y cuidado de siempre.</p>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ══════════ TIENDA ══════════ */}
      {activeSection === 'tienda' && (
        <main className="page-tienda" ref={shopRef}>
          <div className="tienda-header">
            <span className="section-tag">Pedidos por WhatsApp</span>
            <h1>Nuestra Tienda</h1>
            <p>Selecciona los productos que deseas, añádelos al carrito y te contactamos directamente por WhatsApp.</p>
          </div>
          <div className="tienda-layout">
            <div className="category-sidebar">
              {categories.map(cat => (
                <button key={cat.id} className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)} style={{ '--cat-color': cat.color } as React.CSSProperties}>
                  <span className="cat-icon">{cat.icon}</span><span>{cat.name}</span>
                </button>
              ))}
            </div>
            <div className="products-area">
              <div className="products-category-header">
                <span className="cat-big-icon">{currentCategory.icon}</span>
                <div><h2>{currentCategory.name}</h2><span>{currentCategory.products.length} productos disponibles</span></div>
              </div>
              <div className="products-grid">
                {currentCategory.products.map(product => {
                  const inCart = cart.find(i => i.id === product.id)
                  return (
                    <div key={product.id} className={`product-card ${inCart ? 'in-cart' : ''}`}>
                      <div className="product-emoji-wrap">
                        <span className="product-emoji">{product.emoji}</span>
                        {inCart && <span className="in-cart-badge">×{inCart.quantity}</span>}
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className="product-price">
                          <strong>{product.price.toFixed(2)}€</strong>
                          <span>/{product.unit}</span>
                        </div>
                      </div>
                      <button className={`btn-add ${inCart ? 'added' : ''}`} onClick={() => addToCart(product, currentCategory)}>
                        {inCart ? '+ Añadir otro' : 'Añadir al pedido'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {totalItems > 0 && (
            <button className="floating-cart" onClick={() => setCartOpen(true)}>
              <span>🛒 Mi pedido ({totalItems})</span>
              <span className="float-total">{cart.reduce((s,i)=>s+i.price*i.quantity,0).toFixed(2)}€</span>
              {formSubmitted && <span className="float-finish">✅ Terminar</span>}
            </button>
          )}
        </main>
      )}

      {/* ══════════ GALERÍA ══════════ */}
      {activeSection === 'galeria' && (
        <main className="page-galeria">
          <div className="galeria-header">
            <span className="section-tag">Imágenes</span>
            <h1>Nuestra Galería</h1>
            <p>Un vistazo a nuestra carnicería, nuestra historia y nuestros productos</p>
          </div>
          <div className="galeria-grid">
            {[
              { src: '/public/galeria/fotoantigua1.jpeg', label: 'Foto Antigua 1', icon: '🖼️', tag: 'Historia', size: 'large' },
              { src: '/public/galeria/fotoantigua2.jpeg', label: 'Foto Antigua 2', icon: '🖼️', tag: 'Historia', size: 'normal' },
              { src: '/public/galeria/fotoantigua3.jpeg', label: 'Foto Antigua 3', icon: '🖼️', tag: 'Historia', size: 'normal' },
              { src: '/public/galeria/local0.jpeg',   label: 'El Dueño',        icon: '👨‍🍳', tag: 'Equipo', size: 'normal' },
              { src: '/public/galeria/local1.jpeg',      label: 'El Local 1',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/public/galeria/local2.jpeg',      label: 'El Local 2',      icon: '🏪', tag: 'Instalaciones', size: 'large' },
              { src: '/public/galeria/local3.jpeg',      label: 'El Local 3',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/public/galeria/local4.jpeg',      label: 'El Local 4',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/public/galeria/local5.jpeg',      label: 'El Local 5',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/public/galeria/local6.jpeg',      label: 'El Local 6',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/public/galeria/local7.jpeg',      label: 'El Local 7',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/public/galeria/local8.jpeg',      label: 'El Local 8',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
            ].map((item, i) => (
              <div key={i} className={`galeria-item ${item.size}`}>
                <img src={`/public/galeria/${item.src}`} alt={item.label} className="galeria-real-img"
                  onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
                <div className="galeria-placeholder" style={{display:'none'}}>
                  <span className="galeria-icon">{item.icon}</span>
                  <span className="galeria-label">{item.src}</span>
                  <span className="galeria-tag">{item.tag}</span>
                </div>
              </div>
            ))}
          </div>
         
        </main>
      )}

      {/* ══════════ CONTACTO ══════════ */}
      {activeSection === 'contacto' && (
        <main className="page-contacto">
          <div className="contacto-header">
            <span className="section-tag">Estamos aquí</span>
            <h1>Contacto & Ubicación</h1>
          </div>
          <div className="contacto-grid">
            <div className="contacto-info">
              <div className="info-block">
                <span className="info-icon">📍</span>
                <div>
                  <h3>Dirección</h3>
                  <p>General Díaz Porlier, 21<br />28001 Madrid, España</p>
                  <a href="https://maps.app.goo.gl/errBca6jxHiszWHU6" target="_blank" rel="noreferrer" className="map-link">Ver en Google Maps →</a>
                </div>
              </div>
              <div className="info-block">
                <span className="info-icon">📞</span>
                <div><h3>Teléfono</h3><p>91 402 59 92</p></div>
              </div>
              <div className="info-block">
                <span className="info-icon">💬</span>
                <div>
                  <h3>WhatsApp Pedidos</h3>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="whatsapp-link">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Escribir por WhatsApp
                  </a>
                </div>
              </div>
              <div className="info-block">
                <span className="info-icon">🕐</span>
                <div>
                  <h3>Horario</h3>
                  <p>Lun–Vie: 8:00–14:30 / 17:00–20:30<br />Sábado: 8:00–15:00<br />Domingo: Cerrado</p>
                </div>
              </div>
            </div>
            {/* Google Maps embed real */}
            <div className="mapa-embed">
              <iframe
                title="Ubicación Carnicería Hermanos Gómez"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.754!2d-3.6742!3d40.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42288f00000001%3A0x0!2sGeneral+D%C3%ADaz+Porlier%2C+21%2C+28001+Madrid%2C+Spain!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses"
                width="100%" height="100%"
                style={{ border: 0, minHeight: '380px', borderRadius: '12px', display: 'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </main>
      )}

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-content">
          <img src="/public/galeria/logo.png" alt="Logo" className="footer-logo" />
          <div className="footer-info">
            <p>© 2025 Carnicería Hermanos Gómez · Tres generaciones de tradición</p>
            <p>General Díaz Porlier, 21 · 28001 Madrid · Tel: 91 402 59 92</p>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer" className="footer-wa">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}