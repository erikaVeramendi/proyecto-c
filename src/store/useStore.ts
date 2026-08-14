import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import type { Category, Product } from '../types'

interface AppState {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  categories: Category[];
  products: Product[];
  storeInfo: Record<string, string>;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  
  // Admin actions
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  updateStoreInfo: (key: string, value: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  isAdmin: false,
  setIsAdmin: (val) => set({ isAdmin: val }),
  categories: [],
  products: [],
  storeInfo: {
    whatsapp_number: '59176446793', // Defaults while loading
    address: 'General Díaz Porlier, 21',
    city_zip: '28001 Madrid, España',
    store_name: 'Carnicería Hermanos Gómez',
    map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.754!2d-3.6742!3d40.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd42288f00000001%3A0x0!2sGeneral+D%C3%ADaz+Porlier%2C+21%2C+28001+Madrid%2C+Spain!5e0!3m2!1ses!2ses!4v1620000000000!5m2!1ses!2ses'
  },
  loading: true,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null })
    try {
      const [catsRes, prodsRes, infoRes] = await Promise.all([
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('products').select('*').order('created_at', { ascending: true }),
        supabase.from('store_info').select('*')
      ]);

      if (catsRes.error) throw catsRes.error;
      if (prodsRes.error) throw prodsRes.error;
      if (infoRes.error) throw infoRes.error;

      // Group products into categories if needed by frontend (or adjust frontend to group them)
      // We will keep them flat, but also attach them to categories similar to original structure
      const products = prodsRes.data as Product[];
      
      const categoriesToSet = catsRes.data.map(cat => ({
        ...cat,
        products: products.filter(p => p.category_id === cat.id)
      })) as Category[];

      const storeInfoData: Record<string, string> = {};
      infoRes.data.forEach((item: { key: string, value: string }) => {
        storeInfoData[item.key] = item.value;
      });

      // Avoid overriding with empty values if DB is completely empty (helps for first load before inserting SQL)
      set({ 
        categories: categoriesToSet.length > 0 ? categoriesToSet : get().categories,
        products, 
        storeInfo: Object.keys(storeInfoData).length > 0 ? storeInfoData : get().storeInfo,
        loading: false 
      })
    } catch (err: any) {
      console.error('Error fetching data:', err.message)
      // Si falla, mantenemos los defaults pero marcamos loading en false.
      set({ error: err.message, loading: false })
    }
  },

  addCategory: async (category) => {
    const { error } = await supabase.from('categories').insert(category).select();
    if (error) throw error;
    // get().fetchData() o actualizar estado
    await get().fetchData();
  },
  
  updateCategory: async (id, updates) => {
    const { error } = await supabase.from('categories').update(updates).eq('id', id);
    if (error) throw error;
    await get().fetchData();
  },

  deleteCategory: async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    await get().fetchData();
  },

  addProduct: async (product) => {
    const { error } = await supabase.from('products').insert(product);
    if (error) throw error;
    await get().fetchData();
  },

  updateProduct: async (id, updates) => {
    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.from('products').update(updates).eq('id', id);
      if (error) throw error;
    }
    await get().fetchData();
  },


  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    await get().fetchData();
  },

  updateStoreInfo: async (key, value) => {
    const { error } = await supabase.from('store_info').update({ value }).eq('key', key);
    if (error) throw error;
    set(state => ({
      storeInfo: { ...state.storeInfo, [key]: value }
    }));
  }
}))
