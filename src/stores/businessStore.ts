import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  business_id: string;
  name: string;
  category: string;
  hpp: number;
  selling_price: number;
  stock: number;
  created_at: string;
}

export interface FileItem {
  id: string;
  business_id: string;
  name: string;
  type: string;
  size: string;
  parent_id: string | null;
  is_folder: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  business_id: string;
  type: 'sale' | 'expense' | 'restock';
  description: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  category: string;
  logo: string;
  created_at: string;
  products?: Product[];
  files?: FileItem[];
  transactions?: Transaction[];
}

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  isLoading: boolean;
  fetchBusinesses: () => Promise<void>;
  setCurrentBusiness: (business: Business | null) => void;
  fetchBusinessDetails: (businessId: string) => Promise<void>;
  addBusiness: (business: { name: string; category: string; logo: string; owner_id: string }) => Promise<Business | null>;
  updateBusiness: (id: string, data: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<void>;
  updateProduct: (productId: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  addFile: (file: Omit<FileItem, 'id' | 'created_at'>) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>;
}

export const useBusinessStore = create<BusinessState>()((set, get) => ({
  businesses: [],
  currentBusiness: null,
  isLoading: false,

  fetchBusinesses: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ businesses: data as Business[] });
    }
    set({ isLoading: false });
  },

  setCurrentBusiness: (business) => set({ currentBusiness: business }),

  fetchBusinessDetails: async (businessId: string) => {
    set({ isLoading: true });

    // Fetch business
    const { data: business } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .maybeSingle();

    if (business) {
      // Fetch related data in parallel
      const [productsRes, filesRes, transactionsRes] = await Promise.all([
        supabase.from('products').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('files').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('transactions').select('*').eq('business_id', businessId).order('date', { ascending: false }),
      ]);

      const fullBusiness: Business = {
        ...business as Business,
        products: (productsRes.data as Product[]) || [],
        files: (filesRes.data as FileItem[]) || [],
        transactions: (transactionsRes.data as Transaction[]) || [],
      };

      set({ currentBusiness: fullBusiness });
    }

    set({ isLoading: false });
  },

  addBusiness: async (businessData) => {
    const { data, error } = await supabase
      .from('businesses')
      .insert(businessData)
      .select()
      .single();

    if (!error && data) {
      const newBusiness = data as Business;
      set((state) => ({ businesses: [newBusiness, ...state.businesses] }));
      return newBusiness;
    }
    return null;
  },

  updateBusiness: async (id, data) => {
    const { error } = await supabase
      .from('businesses')
      .update(data)
      .eq('id', id);

    if (!error) {
      set((state) => ({
        businesses: state.businesses.map((b) => (b.id === id ? { ...b, ...data } : b)),
        currentBusiness: state.currentBusiness?.id === id ? { ...state.currentBusiness, ...data } : state.currentBusiness,
      }));
    }
  },

  deleteBusiness: async (id) => {
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (!error) {
      set((state) => ({
        businesses: state.businesses.filter((b) => b.id !== id),
        currentBusiness: state.currentBusiness?.id === id ? null : state.currentBusiness,
      }));
    }
  },

  addProduct: async (product) => {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (!error && data) {
      const newProduct = data as Product;
      set((state) => ({
        currentBusiness: state.currentBusiness
          ? { ...state.currentBusiness, products: [newProduct, ...(state.currentBusiness.products || [])] }
          : state.currentBusiness,
      }));
    }
  },

  updateProduct: async (productId, data) => {
    const { error } = await supabase
      .from('products')
      .update(data)
      .eq('id', productId);

    if (!error) {
      set((state) => ({
        currentBusiness: state.currentBusiness
          ? {
              ...state.currentBusiness,
              products: state.currentBusiness.products?.map((p) =>
                p.id === productId ? { ...p, ...data } : p
              ),
            }
          : state.currentBusiness,
      }));
    }
  },

  deleteProduct: async (productId) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (!error) {
      set((state) => ({
        currentBusiness: state.currentBusiness
          ? {
              ...state.currentBusiness,
              products: state.currentBusiness.products?.filter((p) => p.id !== productId),
            }
          : state.currentBusiness,
      }));
    }
  },

  addFile: async (file) => {
    const { data, error } = await supabase
      .from('files')
      .insert(file)
      .select()
      .single();

    if (!error && data) {
      const newFile = data as FileItem;
      set((state) => ({
        currentBusiness: state.currentBusiness
          ? { ...state.currentBusiness, files: [newFile, ...(state.currentBusiness.files || [])] }
          : state.currentBusiness,
      }));
    }
  },

  deleteFile: async (fileId) => {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId);

    if (!error) {
      set((state) => ({
        currentBusiness: state.currentBusiness
          ? {
              ...state.currentBusiness,
              files: state.currentBusiness.files?.filter((f) => f.id !== fileId),
            }
          : state.currentBusiness,
      }));
    }
  },

  addTransaction: async (transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (!error && data) {
      const newTransaction = data as Transaction;
      set((state) => ({
        currentBusiness: state.currentBusiness
          ? { ...state.currentBusiness, transactions: [newTransaction, ...(state.currentBusiness.transactions || [])] }
          : state.currentBusiness,
      }));
    }
  },
}));
