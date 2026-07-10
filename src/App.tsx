import { useState, useRef, useEffect } from 'react'
import type { CartItem, Product, Category, CustomerForm, CartView } from './types'
import { categories } from './data/categories'
import { calcItemTotal } from './utils/helpers'

import Navbar, { Footer } from './components/Navbar'
import CartSidebar from './components/CartSidebar'
import AddProductModal from './components/AddProductModal'

import Inicio from './WhatsAppIcon/pages/Inicio'
import Historia from './WhatsAppIcon/pages/Historia'
import Tienda from './WhatsAppIcon/pages/Tienda'
import Galeria from './WhatsAppIcon/pages/Galeria'
import Contacto from './WhatsAppIcon/pages/Contacto'

import './App.css'

export default function App() {
  // ── Navegación ──
  const [activeSection, setActiveSection] = useState('inicio')

  // ── Tienda ──
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [addingProduct, setAddingProduct] = useState<{ product: Product; category: Category } | null>(null)
  const shopRef = useRef<HTMLDivElement>(null)

  // ── Carrito ──
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cartView, setCartView] = useState<CartView>('cart')

  // ── Formulario ──
  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    name: '', phone: '', delivery: 'pickup',
    address: '', locationLat: null, locationLng: null,
    locationLink: '', time: '', notes: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // ── Bloquear scroll cuando hay modal/carrito abierto ──
  const isBlocked = cartOpen || addingProduct !== null
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isBlocked ? 'hidden' : ''
  }

  // ── Auto scroll al cambiar de página ──
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeSection])

  // ── Handlers carrito ──
  const addToCart = (product: Product, category: Category, grams: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, grams: i.grams + grams } : i)
      return [...prev, { ...product, category: category.name, grams }]
    })
    setAddingProduct(null)
    setCartView('cart')
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id))

  const changeGrams = (id: string, grams: number) => {
    if (grams <= 0) { removeFromCart(id); return }
    setCart(prev => prev.map(i => i.id === id ? { ...i, grams } : i))
  }

  const continueShopping = () => {
    setCartOpen(false)
    setActiveSection('tienda')
    setTimeout(() => shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const scrollToShop = () => {
    setActiveSection('tienda')
    setTimeout(() => shopRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const totalItems = cart.length

  return (
    <div className="app">
      {/* ── Navbar global ── */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        cartCount={totalItems}
        onCartClick={() => { setCartView('cart'); setCartOpen(!cartOpen) }}
      />

      {/* ── Modal añadir producto (global, fuera de tienda) ── */}
      {addingProduct && (
        <AddProductModal
          product={addingProduct.product}
          category={addingProduct.category}
          onAdd={(grams) => addToCart(addingProduct.product, addingProduct.category, grams)}
          onClose={() => setAddingProduct(null)}
        />
      )}

      {/* ── Cart overlay global ── */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div onClick={e => e.stopPropagation()}>
            <CartSidebar
              cart={cart}
              onRemove={removeFromCart}
              onClose={() => setCartOpen(false)}
              onGramsChange={changeGrams}
              onContinueShopping={continueShopping}
              customerForm={customerForm}
              onFormChange={setCustomerForm}
              formSubmitted={formSubmitted}
              onFormSubmit={() => setFormSubmitted(true)}
              view={cartView}
              setView={setCartView}
            />
          </div>
        </div>
      )}

      {/* ══ Secciones ══ */}
      {activeSection === 'inicio' && (
        <Inicio
          onGoToShop={scrollToShop}
          onGoToHistoria={() => setActiveSection('historia')}
        />
      )}

      {activeSection === 'historia' && <Historia />}

      {activeSection === 'tienda' && (
        <Tienda
          cart={cart}
          cartOpen={false}           // El cart overlay ya está en App nivel global
          cartView={cartView}
          setCartView={setCartView}
          onOpenCart={() => { setCartView('cart'); setCartOpen(true) }}
          onCloseCart={() => setCartOpen(false)}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          addingProduct={addingProduct}
          setAddingProduct={setAddingProduct}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onChangeGrams={changeGrams}
          onContinueShopping={continueShopping}
          customerForm={customerForm}
          onFormChange={setCustomerForm}
          formSubmitted={formSubmitted}
          onFormSubmit={() => setFormSubmitted(true)}
        />
      )}

      {activeSection === 'galeria' && <Galeria />}

      {activeSection === 'contacto' && <Contacto />}

      {/* ── Footer global ── */}
      <Footer />
    </div>
  )
}