// ─── Types compartidos ────────────────────────────────────────────────────────
export interface CartItem {
  id: string
  name: string
  category: string
  price: number       // €/kg
  grams: number       // cantidad pedida en gramos
  emoji: string
}

export interface Product {
  id: string
  name: string
  price: number       // €/kg
  emoji: string
  description: string
  image?: string      // ruta opcional /productos/xxx.png
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  products: Product[]
}

export interface CustomerForm {
  name: string
  phone: string
  delivery: 'pickup' | 'delivery'
  address: string
  locationLat: number | null
  locationLng: number | null
  locationLink: string
  time: string
  notes: string
}

export type CartView = 'cart' | 'form' | 'confirm'