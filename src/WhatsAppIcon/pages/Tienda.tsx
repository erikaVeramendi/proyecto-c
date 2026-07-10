import { useRef } from 'react'
import type { CartItem, Product, Category, CartView } from '../../types'
import { categories } from '../../data/categories'
import { calcItemTotal, formatGrams } from '../../utils/helpers'
import AddProductModal from '../../components/AddProductModal'
import CartSidebar from '../../components/CartSidebar'
import type { CustomerForm } from '../../types'

interface TiendaProps {
  cart: CartItem[]
  cartOpen: boolean
  cartView: CartView
  setCartView: (v: CartView) => void
  onOpenCart: () => void
  onCloseCart: () => void
  activeCategory: string
  setActiveCategory: (id: string) => void
  addingProduct: { product: Product; category: Category } | null
  setAddingProduct: (p: { product: Product; category: Category } | null) => void
  onAddToCart: (product: Product, category: Category, grams: number) => void
  onRemoveFromCart: (id: string) => void
  onChangeGrams: (id: string, grams: number) => void
  onContinueShopping: () => void
  customerForm: CustomerForm
  onFormChange: (f: CustomerForm) => void
  formSubmitted: boolean
  onFormSubmit: () => void
}

export default function Tienda({
  cart, cartOpen, cartView, setCartView,
  onOpenCart, onCloseCart,
  activeCategory, setActiveCategory,
  addingProduct, setAddingProduct, onAddToCart,
  onRemoveFromCart, onChangeGrams, onContinueShopping,
  customerForm, onFormChange, formSubmitted, onFormSubmit,
}: TiendaProps) {
  const shopRef = useRef<HTMLDivElement>(null)
  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0]
  const totalItems = cart.length
  const totalPrice = cart.reduce((s, i) => s + calcItemTotal(i), 0)

  return (
    <main className="page-tienda" ref={shopRef}>
      {/* Modal añadir producto */}
      {addingProduct && (
        <AddProductModal
          product={addingProduct.product}
          category={addingProduct.category}
          onAdd={(grams) => onAddToCart(addingProduct.product, addingProduct.category, grams)}
          onClose={() => setAddingProduct(null)}
        />
      )}

      {/* Cart overlay */}
      {cartOpen && (
        <div className="cart-overlay" onClick={onCloseCart}>
          <div onClick={e => e.stopPropagation()}>
            <CartSidebar
              cart={cart}
              onRemove={onRemoveFromCart}
              onClose={onCloseCart}
              onGramsChange={onChangeGrams}
              onContinueShopping={onContinueShopping}
              customerForm={customerForm}
              onFormChange={onFormChange}
              formSubmitted={formSubmitted}
              onFormSubmit={onFormSubmit}
              view={cartView}
              setView={setCartView}
            />
          </div>
        </div>
      )}

      <div className="tienda-header">
        <span className="section-tag">Pedidos por WhatsApp</span>
        <h1>Nuestra Tienda</h1>
        <p>Selecciona los gramos exactos de cada producto. Te confirmaremos el precio final por WhatsApp tras el corte.</p>
      </div>

      <div className="tienda-layout">
        {/* Sidebar categorías */}
        <div className="category-sidebar">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{ '--cat-color': cat.color } as React.CSSProperties}
              type="button"
            >
              <span className="cat-icon">{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="cat-count">{cat.products.length}</span>
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="products-area">
          <div className="products-category-header">
            <span className="cat-big-icon">{currentCategory.icon}</span>
            <div>
              <h2>{currentCategory.name}</h2>
              <span>{currentCategory.products.length} productos disponibles</span>
            </div>
          </div>

          <div className="products-grid">
            {currentCategory.products.map(product => {
              const inCart = cart.find(i => i.id === product.id)
              return (
                <div key={product.id} className={`product-card ${inCart ? 'in-cart' : ''}`}>
                  <div className="product-img-wrap">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="product-real-img" />
                    ) : (
                      <div className="product-emoji-fallback" style={{ display: 'flex' }}>
                        <span className="product-emoji">{product.emoji}</span>
                      </div>
                    )}
                    {inCart && (
                      <span className="in-cart-badge">✓ {formatGrams(inCart.grams)}</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-price">
                      <strong>{product.price.toFixed(2)}€</strong>
                      <span>/kg</span>
                    </div>
                  </div>
                  <button
                    className={`btn-add ${inCart ? 'added' : ''}`}
                    onClick={() => setAddingProduct({ product, category: currentCategory })}
                    type="button"
                  >
                    {inCart ? '+ Añadir más' : 'Añadir al pedido'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Botón flotante carrito */}
      {totalItems > 0 && (
        <button className="floating-cart" onClick={onOpenCart} type="button">
          <span>🛒 Mi pedido ({totalItems})</span>
          <span className="float-total">{totalPrice.toFixed(2)}€</span>
          {formSubmitted && <span className="float-finish">✅ Terminar</span>}
        </button>
      )}
    </main>
  )
}