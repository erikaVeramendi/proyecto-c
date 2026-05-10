import { useState, useEffect, useRef } from 'react'
import './App.css'

// ─── Types ───────────────────────────────────────────────────────────────────
interface CartItem {
  id: string
  name: string
  category: string
  price: number       // €/kg
  grams: number       // cantidad pedida en gramos
  emoji: string
}

interface Product {
  id: string
  name: string
  price: number       // €/kg
  emoji: string
  description: string
  image?: string      // ruta opcional /productos/xxx.png
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
  products: Product[]
}

interface CustomerForm {
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

// ─── Constantes ──────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '59176446793'
const PRECIO_ESTANDAR = 15.00  // precio temporal por kg

// ─── Reseñas ─────────────────────────────────────────────────────────────────
const reviews = [
  { name: 'María González', stars: 5, text: 'La mejor carnicería de Madrid. Llevo 20 años comprando aquí y la calidad nunca falla.', date: 'Hace 2 semanas' },
  { name: 'Carlos Martínez', stars: 5, text: 'Los cortes de ternera son excepcionales. Un negocio con mucha historia y tradición.', date: 'Hace 1 mes' },
  { name: 'Ana López', stars: 5, text: 'Atención personalizada y productos fresquísimos. ¡Recomendado 100%!', date: 'Hace 3 semanas' },
  { name: 'Pedro Sánchez', stars: 5, text: 'La carne de cordero es la mejor que he probado. Tradición familiar que se nota en cada corte.', date: 'Hace 1 semana' },
  { name: 'Laura Fernández', stars: 5, text: 'Siempre amables y con los mejores precios. Mi carnicería de confianza desde siempre.', date: 'Hace 2 meses' },
]

// ─── 8 Categorías reales según el sistema de la carnicería ───────────────────
// Cada producto tiene espacio para foto en /productos/{product.id}.png
const categories: Category[] = [
  // ════════════ 1. TERNERA SALAMANCA (42 productos) ════════════
  {
    id: 'ternera-salamanca',
    name: 'Ternera Salamanca',
    icon: '🐄',
    color: '#8B1A1A',
    products: [
      { id: 'ts-lomo-vaca', name: 'Lomo de Vaca', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Lomo de vaca selección' },
      { id: 'ts-contra-anojo', name: 'Contra de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Contra de añojo para asar' },
      { id: 'ts-aguja-anojo', name: 'Aguja de Añojo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Aguja de añojo, ideal para guisos' },
      { id: 'ts-rabillo-anojo', name: 'Rabillo de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Rabillo tierno de añojo' },
      { id: 'ts-lomo-anojo', name: 'Lomo Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Lomo de añojo premium' },
      { id: 'ts-solomillo-anojo', name: 'Solomillo de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'El corte más noble del añojo' },
      { id: 'ts-morcillo-anojo', name: 'Morcillo de Añojo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Morcillo para osobuco y guisos' },
      { id: 'ts-redondo-anojo', name: 'Redondo de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Redondo para mechar y asar' },
      { id: 'ts-entrana-anojo', name: 'Entraña de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Entraña jugosa, ideal a la brasa' },
      { id: 'ts-espaldilla-anojo', name: 'Espaldilla de Añojo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Espaldilla tierna de añojo' },
      { id: 'ts-babilla-anojo', name: 'Babilla de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Babilla para filetes finos' },
      { id: 'ts-burguer-meat-anojo', name: 'Burguer Meat Añojo', price: PRECIO_ESTANDAR, emoji: '🍔', description: 'Carne especial para hamburguesas' },
      { id: 'ts-tira-asado', name: 'Tira de Asado', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Tira de asado para parrilla' },
      { id: 'ts-rabo-anojo', name: 'Rabo de Añojo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Rabo de añojo para guisos lentos' },
      { id: 'ts-vacio-anojo', name: 'Vacío de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Vacío de añojo, sabor intenso' },
      { id: 'ts-carrillada-anojo', name: 'Carrillada de Añojo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Carrillada melosa' },
      { id: 'ts-cadera-anojo', name: 'Cadera de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Cadera de añojo' },
      { id: 'ts-tapa-anojo', name: 'Tapa de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Tapa para filetes' },
      { id: 'ts-ossobuco-anojo', name: 'Ossobuco de Añojo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Ossobuco al corte' },
      { id: 'ts-carne-picar-anojo', name: 'Carne Picar - Guisar Añojo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Carne picada para guisar' },
      { id: 'ts-falda-anojo', name: 'Falda de Añojo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Falda jugosa para cocido' },
      { id: 'ts-rabillo-cadera', name: 'Rabillo de Cadera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Rabillo de cadera tierno' },
      { id: 'ts-aleta-anojo', name: 'Aleta de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Aleta de añojo' },
      { id: 'ts-tapilla-anojo', name: 'Tapilla de Añojo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Tapilla tierna' },
      { id: 'ts-aleta-rellenar', name: 'Aleta para Rellenar', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Pieza ideal para rellenar y asar' },
      { id: 'ts-huesos-anojo', name: 'Huesos de Añojo', price: PRECIO_ESTANDAR, emoji: '🦴', description: 'Perfectos para caldos y guisos' },
      { id: 'ts-ternera-blanca', name: 'Ternera Blanca', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Carne tierna y suave' },
      { id: 'ts-croquetas-gambon', name: 'Croquetas de Gambón', price: PRECIO_ESTANDAR, emoji: '🍤', description: 'Croquetas caseras de gambón' },
      { id: 'ts-croquetas-rabo', name: 'Croquetas de Rabo', price: PRECIO_ESTANDAR, emoji: '🍴', description: 'Croquetas caseras de rabo de toro' },
      { id: 'ts-hamburguesa-vaca', name: 'Hamburguesa de Vaca', price: PRECIO_ESTANDAR, emoji: '🍔', description: 'Hamburguesas frescas de vaca' },
      { id: 'ts-huesos-babilla', name: 'Huesos Babilla', price: PRECIO_ESTANDAR, emoji: '🦴', description: 'Huesos para caldos' },
      { id: 'ts-lomo-alto', name: 'Lomo Alto', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Corte premium de lomo' },
      { id: 'ts-picada-mezcla', name: 'Picada Mezcla', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Mezcla de carne picada' },
      { id: 'ts-lomo-finlandia', name: 'Lomo Finlandia', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Especialidad de la casa' },
      { id: 'ts-morcillo-delantero', name: 'Morcillo Delantero', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Ideal para guisos lentos' },
      { id: 'ts-aleta-ternera', name: 'Aleta Ternera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Aleta de ternera' },
      { id: 'ts-lomo-extra', name: 'Lomo Extra', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Calidad extra' },
      { id: 'ts-solomillo-extra', name: 'Solomillo Extra', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Solomillo de máxima calidad' },
      { id: 'ts-lomo-extra-premium', name: 'Lomo Extra Premium', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Selección especial' },
      { id: 'ts-lomo-angus', name: 'Lomo de Angus', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Raza Angus, sabor intenso' },
      { id: 'ts-piparras-extra', name: 'Piparras Extra', price: PRECIO_ESTANDAR, emoji: '🌶️', description: 'Piparras de calidad extra' },
      { id: 'ts-beicon', name: 'Beicon', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Beicon ahumado tradicional' },
    ]
  },

  // ════════════ 2. TERNERA ASTURIANA (11 productos) ════════════
  {
    id: 'ternera-asturiana',
    name: 'Ternera Asturiana',
    icon: '🐮',
    color: '#A52A2A',
    products: [
      { id: 'ta-lomo', name: 'Lomo Ternera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Lomo de ternera asturiana' },
      { id: 'ta-solomillo', name: 'Solomillo Ternera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Solomillo asturiano' },
      { id: 'ta-tapa', name: 'Tapa Ternera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Tapa para filetes finos' },
      { id: 'ta-babilla', name: 'Babilla Ternera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Babilla tierna y jugosa' },
      { id: 'ta-contra', name: 'Contra Ternera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Contra para asados' },
      { id: 'ta-redondo', name: 'Redondo Ternera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Redondo para mechar' },
      { id: 'ta-aguja', name: 'Aguja Ternera', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Aguja para guisos' },
      { id: 'ta-cadera-tapilla', name: 'Cadera Tapilla', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Cadera tapilla tierna' },
      { id: 'ta-espaldilla', name: 'Espaldilla Ternera', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Espaldilla jugosa' },
      { id: 'ta-morcillo', name: 'Morcillo Ternera', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Morcillo para osobuco' },
      { id: 'ta-carne-picar', name: 'Carne Picar - Guisar Ternera', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Carne picada para guisar' },
    ]
  },

  // ════════════ 3. CERDO (44 productos) ════════════
  {
    id: 'cerdo',
    name: 'Cerdo',
    icon: '🐷',
    color: '#A0522D',
    products: [
      { id: 'c-chuletas-aguja', name: 'Chuletas de Aguja', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Chuletas de aguja jugosas' },
      { id: 'c-chuletas-cerdo', name: 'Chuletas de Cerdo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Chuletas tradicionales' },
      { id: 'c-solomillo-cerdo', name: 'Solomillo de Cerdo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Solomillo tierno' },
      { id: 'c-cinta-lomo-adobada', name: 'Cinta Lomo Adobada', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Lomo con adobo casero' },
      { id: 'c-cinta-lomo-fresca', name: 'Cinta Lomo Fresca', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Lomo fresco sin adobar' },
      { id: 'c-filete-cerdo', name: 'Filete de Cerdo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Filetes finos' },
      { id: 'c-codillo', name: 'Codillo Cerdo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Codillo para asar' },
      { id: 'c-salchichas-blancas', name: 'Salchichas Blancas', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Salchichas blancas frescas' },
      { id: 'c-salchichas-rojas', name: 'Salchichas Rojas', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Salchichas rojas tradicionales' },
      { id: 'c-chorizo-fresco', name: 'Chorizo Fresco', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Chorizo fresco artesanal' },
      { id: 'c-morcilla-arroz', name: 'Morcilla Arroz', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Morcilla con arroz' },
      { id: 'c-morcilla-asturiana', name: 'Morcilla Asturiana', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Morcilla estilo asturiano' },
      { id: 'c-chorizo-asturiano', name: 'Chorizo Asturiano', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Chorizo de Asturias' },
      { id: 'c-panceta-fresca', name: 'Panceta Fresca', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Panceta fresca' },
      { id: 'c-pinchos-morunos', name: 'Pinchos Morunos', price: PRECIO_ESTANDAR, emoji: '🍢', description: 'Pinchos especiados' },
      { id: 'c-costilla-fresca', name: 'Costilla Fresca de Cerdo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Costillas frescas' },
      { id: 'c-magro-cerdo', name: 'Magro de Cerdo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Magro limpio' },
      { id: 'c-oreja-cerdo', name: 'Oreja de Cerdo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Oreja para guisar' },
      { id: 'c-morcilla-cebolla', name: 'Morcilla de Cebolla', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Morcilla con cebolla' },
      { id: 'c-papada-cerdo', name: 'Papada de Cerdo', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Papada tierna' },
      { id: 'c-butifarra', name: 'Butifarra', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Butifarra catalana' },
      { id: 'c-carrillada', name: 'Carrillada de Cerdo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Carrillada para guisos' },
      { id: 'c-longaniza-fresca', name: 'Longaniza Fresca', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Longaniza casera' },
      { id: 'c-costillas-adobadas', name: 'Costillas Adobadas', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Costillas con adobo' },
      { id: 'c-chuletas-sajonia', name: 'Chuletas de Sajonia', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Chuletas estilo Sajonia' },
      { id: 'c-picadillo-chorizo', name: 'Picadillo de Chorizo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Picadillo para chorizo' },
      { id: 'c-pata-cerdo', name: 'Pata de Cerdo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Pata para cocido' },
      { id: 'c-butifarra-blanca', name: 'Butifarra Blanca', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Butifarra blanca' },
      { id: 'c-espinazo', name: 'Espinazo de Cerdo', price: PRECIO_ESTANDAR, emoji: '🦴', description: 'Espinazo para cocidos' },
      { id: 'c-careta', name: 'Careta de Cerdo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Careta para cocidos' },
      { id: 'c-tacos-jamon', name: 'Tacos de Jamón', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Tacos de jamón' },
      { id: 'c-chistorra', name: 'Chistorra', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Chistorra navarra' },
      { id: 'c-picadillo-jamon', name: 'Picadillo de Jamón', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Picadillo de jamón' },
      { id: 'c-codillo-fresco', name: 'Codillo Fresco', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Codillo fresco' },
      { id: 'c-oreja-adobada', name: 'Oreja Adobada', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Oreja con adobo' },
      { id: 'c-colines-cerdo', name: 'Colines de Cerdo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Colines tradicionales' },
      { id: 'c-manteca', name: 'Manteca', price: PRECIO_ESTANDAR, emoji: '🧈', description: 'Manteca de cerdo' },
      { id: 'c-panceta-adobada', name: 'Panceta Adobada', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Panceta con adobo' },
      { id: 'c-vino-cocina', name: 'Vino Cocina', price: PRECIO_ESTANDAR, emoji: '🍷', description: 'Vino para cocinar' },
      { id: 'c-morunos-pinchados', name: 'Morunos Pinchados', price: PRECIO_ESTANDAR, emoji: '🍢', description: 'Pinchos morunos preparados' },
      { id: 'c-pincho-chorizo', name: 'Pincho Chorizo', price: PRECIO_ESTANDAR, emoji: '🍢', description: 'Pinchos de chorizo' },
      { id: 'c-cochinillo', name: 'Cochinillo', price: PRECIO_ESTANDAR, emoji: '🐷', description: 'Cochinillo entero' },
      { id: 'c-cinta-adobada', name: 'Cinta Adobada', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Cinta adobada' },
      { id: 'c-marmitakos', name: 'Marmitakos / Garbanzos', price: PRECIO_ESTANDAR, emoji: '🍲', description: 'Para marmitako con garbanzos' },
    ]
  },

  // ════════════ 4. CERDO IBÉRICO (20 productos) ════════════
  {
    id: 'cerdo-iberico',
    name: 'Cerdo Ibérico',
    icon: '🐗',
    color: '#5D2E1F',
    products: [
      { id: 'ci-chuletas-cerdo', name: 'Chuletas Cerdo Ibérico', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Chuletas ibéricas' },
      { id: 'ci-cinta-lomo', name: 'Cinta de Lomo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Cinta de lomo de bellota' },
      { id: 'ci-cinta-fresca', name: 'Cinta Fresca Ibérica', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Cinta fresca premium' },
      { id: 'ci-secreto', name: 'Secreto Ibérico', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Corte premium del ibérico' },
      { id: 'ci-presa', name: 'Presa Ibérica', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'La joya del ibérico' },
      { id: 'ci-solomillo', name: 'Solomillo Cerdo Ibérico', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Solomillo ibérico' },
      { id: 'ci-tocino', name: 'Tocino Cerdo', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Tocino ibérico' },
      { id: 'ci-chuletas-aguja', name: 'Chuletas Aguja Ibérica', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Chuletas de aguja ibérica' },
      { id: 'ci-panceta-iberica', name: 'Panceta Ibérica', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Panceta de cerdo ibérico' },
      { id: 'ci-chorizos-ibericos', name: 'Chorizos Ibéricos', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Chorizos ibéricos artesanales' },
      { id: 'ci-puntas-jamon', name: 'Puntas Jamón', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Puntas de jamón ibérico' },
      { id: 'ci-carrilladas', name: 'Carrilladas Ibéricas', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Carrilladas ibéricas' },
      { id: 'ci-torreznos-soria', name: 'Torreznos de Soria', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Torreznos sorianos' },
      { id: 'ci-chorizo-villacastin', name: 'Chorizo Villacastín', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Chorizo de Villacastín' },
      { id: 'ci-chorizos-criollos', name: 'Chorizos Criollos', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Chorizos criollos' },
      { id: 'ci-jamon-loncheado', name: 'Jamón Loncheado', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Jamón ibérico loncheado' },
      { id: 'ci-costilla-cerdo', name: 'Costilla Cerdo Ibérico', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Costillas ibéricas' },
      { id: 'ci-picadillo-iberico', name: 'Picadillo Ibérico', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Picadillo ibérico' },
      { id: 'ci-croquetas-ibericas', name: 'Croquetas Ibéricas', price: PRECIO_ESTANDAR, emoji: '🍴', description: 'Croquetas de jamón ibérico' },
      { id: 'ci-panceta-salada', name: 'Panceta Salada', price: PRECIO_ESTANDAR, emoji: '🥓', description: 'Panceta curada en sal' },
    ]
  },

  // ════════════ 5. CORDERO RECENTAL (6 productos) ════════════
  {
    id: 'cordero-recental',
    name: 'Cordero Recental',
    icon: '🐑',
    color: '#6B5E3E',
    products: [
      { id: 'cr-pierna', name: 'Pierna Recental', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Pierna de cordero recental' },
      { id: 'cr-paletilla', name: 'Paletilla Recental', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Paletilla para asar' },
      { id: 'cr-falda', name: 'Falda de Cordero', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Falda jugosa' },
      { id: 'cr-cuello', name: 'Cuello de Cordero', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Cuello para guisos' },
      { id: 'cr-medios-enteros', name: 'Medios o Enteros', price: PRECIO_ESTANDAR, emoji: '🐑', description: 'Cordero medio o entero' },
      { id: 'cr-chuletas', name: 'Chuletas de Recental', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Chuletas tiernas' },
    ]
  },

  // ════════════ 6. CORDERO LECHAL (9 productos) ════════════
  {
    id: 'cordero-lechal',
    name: 'Cordero Lechal',
    icon: '🐏',
    color: '#8B7355',
    products: [
      { id: 'cl-chuletas', name: 'Chuletas de Lechal', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Chuletas de cordero lechal' },
      { id: 'cl-medios-enteros', name: 'Medios o Enteros', price: PRECIO_ESTANDAR, emoji: '🐏', description: 'Lechal medio o entero' },
      { id: 'cl-cuarto-delantero', name: 'Cuarto Delantero', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Cuarto delantero' },
      { id: 'cl-cuarto-trasero', name: 'Cuarto Trasero', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Cuarto trasero' },
      { id: 'cl-rinones', name: 'Riñones Lechal', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Riñones de lechal' },
      { id: 'cl-pierna', name: 'Pierna de Lechal', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Pierna de cordero lechal' },
      { id: 'cl-paletilla', name: 'Paletilla de Lechal', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Paletilla para asar' },
      { id: 'cl-oferta-pierna', name: 'Oferta Pierna y Paletilla', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Oferta especial' },
      { id: 'cl-medios-valladolid', name: 'Medios Valladolid', price: PRECIO_ESTANDAR, emoji: '🐏', description: 'Cordero estilo Valladolid' },
    ]
  },

  // ════════════ 7. CASQUERÍA (20 productos) ════════════
  {
    id: 'casqueria',
    name: 'Casquería',
    icon: '🍴',
    color: '#7A4F3E',
    products: [
      { id: 'cas-manitas-cordero', name: 'Manitas de Cordero', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Manitas para guisar' },
      { id: 'cas-higado-ternera', name: 'Hígado de Ternera', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Hígado fresco' },
      { id: 'cas-lengua-cocida', name: 'Lengua Cocida', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Lengua ya cocida' },
      { id: 'cas-lacon', name: 'Lacón', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Lacón gallego' },
      { id: 'cas-lengua-ternera', name: 'Lengua de Ternera', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Lengua fresca' },
      { id: 'cas-callos-ternera', name: 'Callos de Ternera', price: PRECIO_ESTANDAR, emoji: '🍲', description: 'Callos limpios' },
      { id: 'cas-cabeza-cordero', name: 'Cabeza de Cordero', price: PRECIO_ESTANDAR, emoji: '🐑', description: 'Cabeza para guisos' },
      { id: 'cas-asadura-cordero', name: 'Asadura Cordero', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Asadura tradicional' },
      { id: 'cas-callos-preparados', name: 'Callos Preparados', price: PRECIO_ESTANDAR, emoji: '🍲', description: 'Callos listos para cocinar' },
      { id: 'cas-mollejas-lechal', name: 'Mollejas de Lechal', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Mollejas frescas' },
      { id: 'cas-rinones-cerdo', name: 'Riñones de Cerdo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Riñones frescos' },
      { id: 'cas-higado-cerdo', name: 'Hígado de Cerdo', price: PRECIO_ESTANDAR, emoji: '🥩', description: 'Hígado de cerdo' },
      { id: 'cas-sangre', name: 'Sangre', price: PRECIO_ESTANDAR, emoji: '🩸', description: 'Sangre encebollada' },
      { id: 'cas-pata-ternera', name: 'Pata de Ternera', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Pata para cocido' },
      { id: 'cas-anchoas', name: 'Anchoas', price: PRECIO_ESTANDAR, emoji: '🐟', description: 'Anchoas en aceite' },
      { id: 'cas-sardinas', name: 'Sardinas', price: PRECIO_ESTANDAR, emoji: '🐟', description: 'Sardinas frescas' },
      { id: 'cas-boquerones', name: 'Boquerones', price: PRECIO_ESTANDAR, emoji: '🐟', description: 'Boquerones en vinagre' },
      { id: 'cas-compango', name: 'Compango', price: PRECIO_ESTANDAR, emoji: '🍲', description: 'Compango para fabada' },
      { id: 'cas-sesos-cordero', name: 'Sesos de Cordero', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Sesos frescos' },
      { id: 'cas-morro-guisado', name: 'Morro Guisado', price: PRECIO_ESTANDAR, emoji: '🍲', description: 'Morro ya guisado' },
    ]
  },

  // ════════════ 8. POLLERÍA (48 productos) ════════════
  {
    id: 'polleria',
    name: 'Pollería',
    icon: '🐔',
    color: '#C4860A',
    products: [
      { id: 'p-pollo-entero', name: 'Pollo Entero', price: PRECIO_ESTANDAR, emoji: '🐓', description: 'Pollo entero fresco' },
      { id: 'p-pollo-corral', name: 'Pollo de Corral', price: PRECIO_ESTANDAR, emoji: '🐓', description: 'Pollo de corral' },
      { id: 'p-gallina', name: 'Gallina', price: PRECIO_ESTANDAR, emoji: '🐔', description: 'Gallina para caldos' },
      { id: 'p-pollo-asar', name: 'Pollo de Asar', price: PRECIO_ESTANDAR, emoji: '🐓', description: 'Pollo especial para asar' },
      { id: 'p-codornices', name: 'Codornices', price: PRECIO_ESTANDAR, emoji: '🐦', description: 'Codornices frescas' },
      { id: 'p-conejo', name: 'Conejo', price: PRECIO_ESTANDAR, emoji: '🐇', description: 'Conejo entero' },
      { id: 'p-alitas', name: 'Alitas de Pollo', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Alitas frescas' },
      { id: 'p-jamoncitos', name: 'Jamoncitos de Pollo', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Jamoncitos limpios' },
      { id: 'p-traseros-pollo', name: 'Traseros de Pollo', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Cuartos traseros' },
      { id: 'p-contramuslo-pollo', name: 'Contramuslo de Pollo', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Contramuslos jugosos' },
      { id: 'p-pechuga-pollo', name: 'Pechuga de Pollo', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Pechuga limpia' },
      { id: 'p-alas-corral', name: 'Alas de Corral', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Alas de pollo de corral' },
      { id: 'p-alas-pavo', name: 'Alas de Pavo', price: PRECIO_ESTANDAR, emoji: '🦃', description: 'Alas de pavo' },
      { id: 'p-patorras-pavo', name: 'Patorras de Pavo', price: PRECIO_ESTANDAR, emoji: '🦃', description: 'Patorras de pavo' },
      { id: 'p-pechuga-pavo', name: 'Pechuga de Pavo', price: PRECIO_ESTANDAR, emoji: '🦃', description: 'Pechuga de pavo' },
      { id: 'p-higaditos', name: 'Higaditos de Pollo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Higaditos frescos' },
      { id: 'p-traseros-corral', name: 'Traseros de Corral', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Traseros de pollo de corral' },
      { id: 'p-mollejas-pollo', name: 'Mollejas de Pollo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Mollejas de pollo' },
      { id: 'p-pechuga-corral', name: 'Pechuga de Corral', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Pechuga de pollo de corral' },
      { id: 'p-longaniza-pollo', name: 'Longaniza de Pollo', price: PRECIO_ESTANDAR, emoji: '🌭', description: 'Longaniza de pollo' },
      { id: 'p-albondigas-pollo', name: 'Albóndigas de Pollo', price: PRECIO_ESTANDAR, emoji: '🍴', description: 'Albóndigas caseras' },
      { id: 'p-pechuga-villarroy', name: 'Pechuga Villarroy', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Pechuga rellena' },
      { id: 'p-chuleta-pavo', name: 'Chuleta Pavo', price: PRECIO_ESTANDAR, emoji: '🦃', description: 'Chuletas de pavo' },
      { id: 'p-pavo-entero', name: 'Pavo Entero', price: PRECIO_ESTANDAR, emoji: '🦃', description: 'Pavo entero' },
      { id: 'p-gallina-pesada', name: 'Gallina Pesada', price: PRECIO_ESTANDAR, emoji: '🐔', description: 'Gallina grande' },
      { id: 'p-cuellos-pollo', name: 'Cuellos de Pollo', price: PRECIO_ESTANDAR, emoji: '🍖', description: 'Cuellos para caldo' },
      { id: 'p-esqueletos', name: 'Esqueletos', price: PRECIO_ESTANDAR, emoji: '🦴', description: 'Esqueletos de pollo' },
      { id: 'p-hamburguesa-pollo', name: 'Hamburguesa de Pollo', price: PRECIO_ESTANDAR, emoji: '🍔', description: 'Hamburguesas de pollo' },
      { id: 'p-croquetas', name: 'Croquetas', price: PRECIO_ESTANDAR, emoji: '🍴', description: 'Croquetas variadas' },
      { id: 'p-huevo-campero', name: 'Huevo Campero', price: PRECIO_ESTANDAR, emoji: '🥚', description: 'Huevos camperos' },
      { id: 'p-huevos-xxl', name: 'Huevos XXL 1/2 Doc.', price: PRECIO_ESTANDAR, emoji: '🥚', description: 'Media docena XXL' },
      { id: 'p-docena-xxl', name: 'Docena XXL', price: PRECIO_ESTANDAR, emoji: '🥚', description: 'Docena de huevos XXL' },
      { id: 'p-jamoncitos-corral', name: 'Jamoncitos Corral', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Jamoncitos de corral' },
      { id: 'p-contramuslo-corral', name: 'Contramuslo Corral', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Contramuslo de corral' },
      { id: 'p-huevos-lucas', name: 'Huevos de Lucas', price: PRECIO_ESTANDAR, emoji: '🥚', description: 'Huevos de Lucas' },
      { id: 'p-alas-adobadas', name: 'Alas Adobadas', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Alas con adobo' },
      { id: 'p-pechuga-apanada', name: 'Pechuga Apanada', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Pechuga empanada' },
      { id: 'p-gallina-cuartos', name: 'Gallina Cuartos', price: PRECIO_ESTANDAR, emoji: '🐔', description: 'Gallina troceada' },
      { id: 'p-perdiz', name: 'Perdiz Roja Deshuesada', price: PRECIO_ESTANDAR, emoji: '🐦', description: 'Perdiz lista para cocinar' },
      { id: 'p-traseros-2kg', name: 'Traseros 2 kg', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Pack 2 kg de traseros' },
      { id: 'p-alas-2kg', name: 'Alas 2 kg', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Pack 2 kg de alas' },
      { id: 'p-jamoncitos-2kg', name: 'Jamoncitos 2 kg', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Pack 2 kg de jamoncitos' },
      { id: 'p-contramuslos-2kg', name: 'Contramuslos 2 kg', price: PRECIO_ESTANDAR, emoji: '🍗', description: 'Pack 2 kg de contramuslos' },
      { id: 'p-codornices-2u', name: 'Codornices 2 Unidades', price: PRECIO_ESTANDAR, emoji: '🐦', description: 'Pack 2 codornices' },
      { id: 'p-conejo-2u', name: 'Conejo 2 Unidades', price: PRECIO_ESTANDAR, emoji: '🐇', description: 'Pack 2 conejos' },
      { id: 'p-pato', name: 'Pato', price: PRECIO_ESTANDAR, emoji: '🦆', description: 'Pato fresco' },
      { id: 'p-lote-1', name: 'Lote 1', price: PRECIO_ESTANDAR, emoji: '🎁', description: 'Lote especial 1' },
      { id: 'p-lote-2', name: 'Lote 2', price: PRECIO_ESTANDAR, emoji: '🎁', description: 'Lote especial 2' },
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

// ─── Helpers ─────────────────────────────────────────────────────────────────
const formatGrams = (g: number): string => {
  if (g >= 1000) {
    const kg = g / 1000
    return Number.isInteger(kg) ? `${kg} kg` : `${kg.toFixed(2)} kg`
  }
  return `${g} g`
}

const calcItemTotal = (item: CartItem): number => {
  return (item.price * item.grams) / 1000
}

// ─── Cantidad Selector (gramos) ───────────────────────────────────────────────
function GramSelector({ grams, onChange }: { grams: number; onChange: (g: number) => void }) {
  const presets = [100, 250, 500, 750, 1000, 1500, 2000]
  const [custom, setCustom] = useState(false)
  const [inputValue, setInputValue] = useState(String(grams))

  useEffect(() => { setInputValue(String(grams)) }, [grams])

  const handleCustomChange = (val: string) => {
    setInputValue(val)
    const num = parseInt(val, 10)
    if (!isNaN(num) && num > 0) onChange(num)
  }

  return (
    <div className="gram-selector">
      <label className="gram-label">¿Cuánto deseas? (en gramos)</label>
      {!custom ? (
        <>
          <div className="gram-presets">
            {presets.map(p => (
              <button
                key={p}
                className={`gram-preset ${grams === p ? 'active' : ''}`}
                onClick={() => onChange(p)}
                type="button"
              >
                {p < 1000 ? `${p}g` : `${p/1000}kg`}
              </button>
            ))}
          </div>
          <button className="gram-custom-btn" onClick={() => setCustom(true)} type="button">
            ✏️ Cantidad personalizada
          </button>
        </>
      ) : (
        <div className="gram-custom">
          <div className="gram-input-row">
            <button onClick={() => onChange(Math.max(50, grams - 50))} type="button">−50g</button>
            <input
              type="number"
              min="50"
              step="50"
              value={inputValue}
              onChange={e => handleCustomChange(e.target.value)}
            />
            <span className="gram-unit">g</span>
            <button onClick={() => onChange(grams + 50)} type="button">+50g</button>
          </div>
          <button className="gram-back-btn" onClick={() => setCustom(false)} type="button">
            ← Cantidades rápidas
          </button>
        </div>
      )}
      <div className="gram-equivalent">
        ≈ {formatGrams(grams)}
      </div>
    </div>
  )
}

// ─── Modal Añadir Producto ────────────────────────────────────────────────────
function AddProductModal({ product, category, onAdd, onClose }: {
  product: Product
  category: Category
  onAdd: (grams: number) => void
  onClose: () => void
}) {
  const [grams, setGrams] = useState(500)
  const totalEstimado = (product.price * grams) / 1000
  const imgSrc = product.image || `/productos/${product.id}.png`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-product">
          <div className="modal-img-wrap">
            <img src={imgSrc} alt={product.name} className="modal-product-img"
              onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
            <div className="modal-emoji-fallback">
              <span className="modal-emoji">{product.emoji}</span>
            </div>
          </div>
          <div className="modal-info">
            <span className="modal-cat">{category.name}</span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="modal-price">
              <strong>{product.price.toFixed(2)}€</strong>
              <span>/kg</span>
            </div>
          </div>
        </div>
        <GramSelector grams={grams} onChange={setGrams} />
        <div className="modal-total">
          <span>Subtotal estimado</span>
          <strong>{totalEstimado.toFixed(2)}€</strong>
        </div>
        <button className="btn-add-confirm" onClick={() => onAdd(grams)}>
          Añadir al pedido
        </button>
      </div>
    </div>
  )
}

// ─── LocationPicker ──────────────────────────────────────────────────────────
function LocationPicker({ form, onFormChange }: {
  form: CustomerForm
  onFormChange: (f: CustomerForm) => void
}) {
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const useMyLocation = () => {
    setError('')
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización. Por favor escribe la dirección manualmente.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        const link = `https://www.google.com/maps?q=${lat},${lng}`
        onFormChange({
          ...form,
          locationLat: lat,
          locationLng: lng,
          locationLink: link,
          address: form.address || `Ubicación GPS (${lat.toFixed(5)}, ${lng.toFixed(5)})`
        })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        if (err.code === 1) setError('Permiso denegado. Activa la ubicación en tu navegador o escribe la dirección manualmente.')
        else if (err.code === 2) setError('No se pudo obtener tu ubicación. Inténtalo de nuevo.')
        else if (err.code === 3) setError('Tiempo de espera agotado. Inténtalo de nuevo.')
        else setError('Error al obtener ubicación.')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const searchOnGoogleMaps = () => {
    if (!searchQuery.trim()) {
      setError('Escribe una dirección para buscar')
      return
    }
    setError('')
    const encoded = encodeURIComponent(searchQuery.trim())
    const link = `https://www.google.com/maps/search/?api=1&query=${encoded}`
    onFormChange({
      ...form,
      address: searchQuery.trim(),
      locationLink: link,
      locationLat: null,
      locationLng: null,
    })
    window.open(link, '_blank')
  }

  const clearLocation = () => {
    onFormChange({ ...form, locationLat: null, locationLng: null, locationLink: '', address: '' })
    setSearchQuery('')
    setError('')
  }

  const hasLocation = form.locationLink || (form.address && form.address.length > 0)

  return (
    <div className="location-picker">
      <label className="loc-label">📍 Dirección de entrega *</label>

      {hasLocation && (
        <div className="loc-current">
          <div className="loc-current-info">
            <span className="loc-icon">✅</span>
            <div>
              <strong>Ubicación seleccionada</strong>
              <p>{form.address}</p>
              {form.locationLink && (
                <a href={form.locationLink} target="_blank" rel="noreferrer" className="loc-link">
                  Ver en Google Maps →
                </a>
              )}
            </div>
          </div>
          <button className="loc-clear" onClick={clearLocation} type="button">Cambiar</button>
        </div>
      )}

      {!hasLocation && (
        <>
          <button
            className="loc-btn-gps"
            onClick={useMyLocation}
            disabled={locating}
            type="button"
          >
            {locating ? '⏳ Obteniendo ubicación...' : '📍 Usar mi ubicación actual'}
          </button>

          <div className="loc-divider"><span>o</span></div>

          <div className="loc-search">
            <label>Buscar dirección en Google Maps</label>
            <div className="loc-search-row">
              <input
                type="text"
                placeholder="Calle, número, ciudad..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); searchOnGoogleMaps() } }}
              />
              <button onClick={searchOnGoogleMaps} type="button" className="loc-btn-search">
                🔍 Buscar
              </button>
            </div>
            <small className="loc-help">Se abrirá Google Maps para que verifiques la dirección exacta. Tu ubicación se enviará por WhatsApp.</small>
          </div>
        </>
      )}

      {error && <div className="loc-error">{error}</div>}
    </div>
  )
}

// ─── CartSidebar ──────────────────────────────────────────────────────────────
type CartView = 'cart' | 'form' | 'confirm'

function CartSidebar({
  cart, onRemove, onClose, onGramsChange, onContinueShopping,
  customerForm, onFormChange, formSubmitted, onFormSubmit,
  view, setView,
}: {
  cart: CartItem[]
  onRemove: (id: string) => void
  onClose: () => void
  onGramsChange: (id: string, grams: number) => void
  onContinueShopping: () => void
  customerForm: CustomerForm
  onFormChange: (f: CustomerForm) => void
  formSubmitted: boolean
  onFormSubmit: () => void
  view: CartView
  setView: (v: CartView) => void
}) {
  const total = cart.reduce((s, i) => s + calcItemTotal(i), 0)

  const isFormValid = (): boolean => {
    if (!customerForm.name.trim()) return false
    if (!customerForm.phone.trim()) return false
    if (!customerForm.time) return false
    if (customerForm.delivery === 'delivery') {
      if (!customerForm.address.trim()) return false
    }
    return true
  }

  const handleFormSave = () => {
    if (!isFormValid()) return
    onFormSubmit()
    setView('cart')
  }

  const sendWhatsApp = () => {
    const f = customerForm
    const modalidad = f.delivery === 'pickup' ? 'Recogida en tienda' : 'Envío a domicilio'
    let msg = `🥩 *PEDIDO — Carnicería Hermanos Gómez*\n`
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `👤 *Cliente:* ${f.name}\n`
    msg += `📱 *Teléfono:* ${f.phone}\n`
    msg += `🕐 *Hora deseada:* ${f.time}\n`
    msg += `📦 *Modalidad:* ${modalidad}\n`
    if (f.delivery === 'delivery') {
      msg += `📍 *Dirección:* ${f.address}\n`
      if (f.locationLink) {
        msg += `🗺️ *Ubicación en mapa:* ${f.locationLink}\n`
      }
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `🛒 *PRODUCTOS*\n\n`
    cart.forEach(item => {
      const subtotal = calcItemTotal(item)
      msg += `${item.emoji} *${item.name}*\n`
      msg += `   ${formatGrams(item.grams)} × ${item.price.toFixed(2)}€/kg = *${subtotal.toFixed(2)}€*\n\n`
    })
    msg += `━━━━━━━━━━━━━━━━━━━━━━━\n`
    msg += `💰 *TOTAL ESTIMADO:* ${total.toFixed(2)}€\n`
    msg += `_(El precio final se confirmará tras el corte exacto)_`
    if (f.notes) msg += `\n\n📝 *Notas:* ${f.notes}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if (cart.length === 0 && view === 'cart') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Tu Pedido</h3>
          <button className="close-btn" onClick={onClose} type="button">✕</button>
        </div>
        <div className="cart-empty">
          <span className="empty-icon">🛒</span>
          <p>Tu carrito está vacío</p>
          <small>Añade productos para comenzar tu pedido</small>
          <button className="btn-primary" onClick={onContinueShopping} style={{marginTop: '1.5rem'}} type="button">
            Ir a la Tienda
          </button>
        </div>
      </div>
    )
  }

  if (view === 'form') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Tus Datos</h3>
          <button className="close-btn" onClick={onClose} type="button">✕</button>
        </div>
        <div className="order-form">
          <p className="form-intro">📋 Rellena tus datos una vez. Después podrás seguir añadiendo productos sin perder esta información.</p>

          <div className="form-group">
            <label>Nombre completo *</label>
            <input
              value={customerForm.name}
              onChange={e => onFormChange({...customerForm, name: e.target.value})}
              placeholder="Tu nombre"
            />
          </div>

          <div className="form-group">
            <label>Teléfono *</label>
            <input
              value={customerForm.phone}
              onChange={e => onFormChange({...customerForm, phone: e.target.value})}
              placeholder="Tu número de teléfono"
              type="tel"
            />
          </div>

          <div className="form-group">
            <label>Modalidad *</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="pickup"
                  checked={customerForm.delivery === 'pickup'}
                  onChange={() => onFormChange({...customerForm, delivery: 'pickup'})}
                />
                🏪 Recogida en tienda
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="delivery"
                  checked={customerForm.delivery === 'delivery'}
                  onChange={() => onFormChange({...customerForm, delivery: 'delivery'})}
                />
                🏠 Envío a domicilio
              </label>
            </div>
          </div>

          {customerForm.delivery === 'delivery' && (
            <LocationPicker form={customerForm} onFormChange={onFormChange} />
          )}

          <div className="form-group">
            <label>Hora deseada *</label>
            <input
              type="time"
              value={customerForm.time}
              onChange={e => onFormChange({...customerForm, time: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Notas adicionales</label>
            <textarea
              value={customerForm.notes}
              onChange={e => onFormChange({...customerForm, notes: e.target.value})}
              placeholder="Corte especial, instrucciones de entrega..."
              rows={3}
            />
          </div>

          <button
            className="btn-whatsapp-order"
            onClick={handleFormSave}
            disabled={!isFormValid()}
            type="button"
          >
            ✅ Guardar datos y continuar
          </button>

          <button className="btn-back" onClick={() => setView('cart')} type="button">
            ← Volver al carrito
          </button>
        </div>
      </div>
    )
  }

  if (view === 'confirm') {
    return (
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Confirmar Pedido</h3>
          <button className="close-btn" onClick={onClose} type="button">✕</button>
        </div>
        <div className="confirm-view">
          <div className="confirm-client">
            <h4>📋 Datos del pedido</h4>
            <div className="confirm-row"><span>Cliente</span><strong>{customerForm.name}</strong></div>
            <div className="confirm-row"><span>Teléfono</span><strong>{customerForm.phone}</strong></div>
            <div className="confirm-row"><span>Hora</span><strong>{customerForm.time}</strong></div>
            <div className="confirm-row"><span>Modalidad</span><strong>{customerForm.delivery === 'pickup' ? 'Recogida en tienda' : 'Envío a domicilio'}</strong></div>
            {customerForm.delivery === 'delivery' && (
              <>
                <div className="confirm-row"><span>Dirección</span><strong>{customerForm.address}</strong></div>
                {customerForm.locationLink && (
                  <div className="confirm-row">
                    <span>Mapa</span>
                    <a href={customerForm.locationLink} target="_blank" rel="noreferrer" className="confirm-map-link">Ver ubicación →</a>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="confirm-products">
            <h4>🛒 Productos ({cart.length})</h4>
            {cart.map(item => (
              <div key={item.id} className="confirm-item">
                <span className="confirm-item-name">{item.emoji} {item.name}</span>
                <span className="confirm-item-detail">
                  {formatGrams(item.grams)} × {item.price.toFixed(2)}€/kg = <strong>{calcItemTotal(item).toFixed(2)}€</strong>
                </span>
              </div>
            ))}
          </div>

          <div className="confirm-total">
            <span>Total estimado</span>
            <strong>{total.toFixed(2)}€</strong>
          </div>

          <p className="confirm-note">El precio final se confirmará al hacer el corte exacto solicitado.</p>

          <button className="btn-whatsapp-send" onClick={sendWhatsApp} type="button">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar pedido por WhatsApp
          </button>

          <button className="btn-back" onClick={() => setView('cart')} type="button">
            ← Volver a editar el pedido
          </button>
          <button className="btn-back-shopping" onClick={() => { setView('cart'); onContinueShopping() }} type="button">
            🛍️ Seguir comprando
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-sidebar">
      <div className="cart-header">
        <h3>
          Tu Pedido
          {formSubmitted && <span className="client-badge">👤 {customerForm.name}</span>}
        </h3>
        <button className="close-btn" onClick={onClose} type="button">✕</button>
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="cart-item-top">
              <span className="cart-item-emoji">{item.emoji}</span>
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                <span className="cart-item-price">{item.price.toFixed(2)}€/kg</span>
              </div>
              <button className="remove-btn" onClick={() => onRemove(item.id)} type="button" aria-label="Quitar">✕</button>
            </div>
            <div className="cart-item-bottom">
              <div className="cart-grams-controls">
                <button onClick={() => onGramsChange(item.id, Math.max(50, item.grams - 100))} type="button">−100g</button>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={item.grams}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10)
                    if (!isNaN(val) && val > 0) onGramsChange(item.id, val)
                  }}
                />
                <span className="cart-grams-unit">g</span>
                <button onClick={() => onGramsChange(item.id, item.grams + 100)} type="button">+100g</button>
              </div>
              <span className="cart-item-total">{calcItemTotal(item).toFixed(2)}€</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-continue-shopping">
        <button className="btn-continue" onClick={onContinueShopping} type="button">
          ← Seguir añadiendo productos
        </button>
      </div>

      {!formSubmitted && (
        <div className="cart-data-reminder">
          <span>⚠️ Necesitamos tus datos antes de enviar</span>
          <button className="btn-link" onClick={() => setView('form')} type="button">
            Rellenar datos →
          </button>
        </div>
      )}

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total estimado</span>
          <strong>{total.toFixed(2)}€</strong>
        </div>
        {formSubmitted ? (
          <>
            <button className="btn-finish-order" onClick={() => setView('confirm')} type="button">
              ✅ Terminar pedido y enviar
            </button>
            <button className="btn-edit-data" onClick={() => setView('form')} type="button">
              ✏️ Editar mis datos
            </button>
          </>
        ) : (
          <button className="btn-whatsapp-order" onClick={() => setView('form')} type="button">
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
  const [activeCategory, setActiveCategory] = useState(categories[0].id)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cartView, setCartView] = useState<CartView>('cart')
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)
  const [addingProduct, setAddingProduct] = useState<{ product: Product; category: Category } | null>(null)
  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    name: '',
    phone: '',
    delivery: 'pickup',
    address: '',
    locationLat: null,
    locationLng: null,
    locationLink: '',
    time: '',
    notes: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const shopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (cartOpen || addingProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [cartOpen, addingProduct])

  const addToCart = (product: Product, category: Category, grams: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, grams: i.grams + grams } : i)
      }
      return [...prev, { ...product, category: category.name, grams }]
    })
    setAddingProduct(null)
    setCartView('cart')
    setCartOpen(true)
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const changeGrams = (id: string, grams: number) => {
    if (grams <= 0) {
      removeFromCart(id)
      return
    }
    setCart(prev => prev.map(i => i.id === id ? { ...i, grams } : i))
  }

  const continueShopping = () => {
    setCartOpen(false)
    setActiveSection('tienda')
    setTimeout(() => shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const totalItems = cart.length
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
        <button className="cart-btn" onClick={() => { setCartView('cart'); setCartOpen(!cartOpen) }} type="button" aria-label="Carrito">
          <span className="cart-icon">🛒</span>
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </button>
      </nav>

      {/* ── Modal Añadir Producto ── */}
      {addingProduct && (
        <AddProductModal
          product={addingProduct.product}
          category={addingProduct.category}
          onAdd={(grams) => addToCart(addingProduct.product, addingProduct.category, grams)}
          onClose={() => setAddingProduct(null)}
        />
      )}

      {/* ── Cart Overlay ── */}
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

      {/* ══════════ INICIO ══════════ */}
      {activeSection === 'inicio' && (
        <main className="page-inicio">
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
                <img src="/galeria/logo.png" alt="Carnicería Hermanos Gómez" className="hero-logo" />
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
                <button className="btn-primary" onClick={scrollToShop} type="button">
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

          <section className="stats-strip">
            <div className="stat"><span className="stat-num">70+</span><span className="stat-label">Años de tradición</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">3ª</span><span className="stat-label">Generación familiar</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">8</span><span className="stat-label">Categorías de carne</span></div>
            <div className="stat-divider" />
            <div className="stat"><span className="stat-num">★ 5.0</span><span className="stat-label">Valoración media</span></div>
          </section>

          <section className="cta-tienda">
            <div className="cta-content">
              <h2>¿Listo para hacer tu pedido?</h2>
              <p>Selecciona los gramos exactos que necesitas, indica tus datos una sola vez y recibe tu pedido directo por WhatsApp con tu ubicación incluida.</p>
              <button className="btn-primary large" onClick={scrollToShop} type="button">Ir a la Tienda Online</button>
            </div>
          </section>

          <section className="home-historia">
            <div className="historia-left">
              <div className="vintage-frame owner-frame">
                <img src="/galeria/fotodueno.jpeg" alt="Eldueno" className="owner-real-img"
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
              <button className="btn-secondary" onClick={() => setActiveSection('historia')} type="button">Leer nuestra historia completa →</button>
            </div>
          </section>

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

          <section className="reviews-section">
            <span className="section-tag">Lo que dicen nuestros clientes</span>
            <h2>Opiniones &amp; Reseñas</h2>
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
                { year: 'Los Inicios', src: '/galeria/fotoantigua1.jpeg', text: 'Nuestra historia comienza hace varias décadas, cuando nuestros abuelos decidieron seguir la tradición de ofrecer carnes frescas y de calidad a su comunidad. Con apenas un mostrador y mucha ilusión, abrieron las puertas de lo que se convertiría en un referente de la ciudad.' },
                { year: 'La Tradición', src: '/galeria/fotoantigua2.jpeg', text: 'Esa pasión por el buen corte de carne se fue transmitiendo de padres a hijos. Cada generación aportó su sello: nuevas técnicas, mejores cortes, mayor variedad. Pero siempre con la misma esencia: calidad y trato cercano al cliente.', right: true },
                { year: 'Hoy', src: '/galeria/fotoantigua3.jpeg', text: 'Hoy somos una familia que sigue con orgullo el legado que nos dejaron. Cada pieza que ofrecemos tiene una historia detrás, forjada de generación en generación, siempre con el mismo objetivo: ofrecer lo mejor de la carne.' },
              ].map((item, i) => (
                <div key={i} className={`timeline-item ${item.right ? 'right' : ''}`}>
                  <div className="timeline-year">{item.year}</div>
                  <div className="timeline-content">
                    <div className="vintage-frame small">
                      <img src={item.src} alt={item.year} className="frame-real-img"
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
                <img src="/galeria/fotodueno2.jpeg" alt="Eldueno" className="owner-real-img"
                  onError={(e) => { const img = e.target as HTMLImageElement; img.style.display='none'; const next = img.nextElementSibling as HTMLElement; if(next) next.style.display='flex'; }} />
                <div className="vintage-placeholder owner-placeholder large" style={{display:'none'}}><span>📸</span><small>fotodueño.png</small></div>
              </div>
              <div className="dueno-text">
                <span className="section-tag">El maestro carnicero</span>
                <h2>El corazón del negocio</h2>
                <p>Detrás de cada corte hay una persona que ha dedicado su vida a este oficio. Aprendió de su padre, que aprendió del suyo, y hoy comparte esa sabiduría con orgullo en cada producto que ofrece.</p>
                <p>Ubicados en General Díaz Porlier, 21 – Madrid, somos especialistas en ternera, pollería, cordero, cerdo y cerdo ibérico, con el mismo compromiso y cuidado de siempre.</p>
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
            <p>Selecciona los gramos exactos de cada producto. Te confirmaremos el precio final por WhatsApp tras el corte.</p>
          </div>
          <div className="tienda-layout">
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
                  // Cada producto tiene su propio espacio para foto en /productos/{id}.png
                  const imgSrc = product.image || `/productos/${product.id}.png`
                  return (
                    <div key={product.id} className={`product-card ${inCart ? 'in-cart' : ''}`}>
                      <div className="product-img-wrap">
                        <img
                          src={imgSrc}
                          alt={product.name}
                          className="product-real-img"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement
                            img.style.display = 'none'
                            const fallback = img.nextElementSibling as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                        <div className="product-emoji-fallback">
                          <span className="product-emoji">{product.emoji}</span>
                          <span className="product-photo-hint">📸 {product.id}.png</span>
                        </div>
                        {inCart && (
                          <span className="in-cart-badge">
                            ✓ {formatGrams(inCart.grams)}
                          </span>
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
          {totalItems > 0 && (
            <button className="floating-cart" onClick={() => { setCartView('cart'); setCartOpen(true) }} type="button">
              <span>🛒 Mi pedido ({totalItems})</span>
              <span className="float-total">{cart.reduce((s, i) => s + calcItemTotal(i), 0).toFixed(2)}€</span>
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
              { src: '/galeria/fotoantigua1.jpeg', label: 'Foto Antigua 1', icon: '🖼️', tag: 'Historia', size: 'large' },
              { src: '/galeria/fotoantigua2.jpeg', label: 'Foto Antigua 2', icon: '🖼️', tag: 'Historia', size: 'normal' },
              { src: '/galeria/fotoantigua3.jpeg', label: 'Foto Antigua 3', icon: '🖼️', tag: 'Historia', size: 'normal' },
              { src: '/galeria/local0.jpeg',   label: 'El Dueño',        icon: '👨‍🍳', tag: 'Equipo', size: 'normal' },
              { src: '/galeria/local1.jpeg',      label: 'El Local 1',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/galeria/local2.jpeg',      label: 'El Local 2',      icon: '🏪', tag: 'Instalaciones', size: 'large' },
              { src: '/galeria/local3.jpeg',      label: 'El Local 3',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/galeria/local4.jpeg',      label: 'El Local 4',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/galeria/local5.jpeg',      label: 'El Local 5',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/galeria/local6.jpeg',      label: 'El Local 6',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/galeria/local7.jpeg',      label: 'El Local 7',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
              { src: '/galeria/local8.jpeg',      label: 'El Local 8',      icon: '🏪', tag: 'Instalaciones', size: 'normal' },
            ].map((item, i) => (
              <div key={i} className={`galeria-item ${item.size}`}>
                <img src={item.src} alt={item.label} className="galeria-real-img"
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
            <h1>Contacto &amp; Ubicación</h1>
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
          <img src="/galeria/logo.png" alt="Logo" className="footer-logo" />
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