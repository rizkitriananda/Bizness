import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  created_at: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<(() => void) | void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  fetchRole: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  profile: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        set({ session, user: session?.user ?? null, isAuthenticated: !!session });
        
        // Defer profile/role fetching with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            get().fetchProfile(session.user.id);
            get().fetchRole(session.user.id);
          }, 0);
        } else {
          set({ profile: null, role: null });
        }
      }
    );

    // THEN check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    set({ 
      session, 
      user: session?.user ?? null, 
      isAuthenticated: !!session,
      isLoading: false 
    });

    if (session?.user) {
      await get().fetchProfile(session.user.id);
      await get().fetchRole(session.user.id);
    }

    return () => subscription.unsubscribe();
  },

  fetchProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (!error && data) {
      set({ profile: data as Profile });
    }
  },

  fetchRole: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      set({ role: data.role as UserRole });
    }
  },

  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  register: async (name: string, email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ 
      user: null, 
      session: null, 
      profile: null, 
      role: null, 
      isAuthenticated: false 
    });
  },
}));
