import { create } from 'zustand';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email?: string, password?: string) => Promise<any>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<any>;
  verifyOtp: (email: string, token: string, type?: 'signup' | 'recovery' | 'magiclink') => Promise<any>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkSession: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ user: session?.user || null, loading: false });

      // Store unsubscribe function to prevent memory leaks
      // Only subscribe once by checking if already subscribed
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null, loading: false });
      });

      // Clean up on window unload to prevent memory leaks
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          subscription?.unsubscribe();
        });
      }
    } catch (error) {
      console.error('Session check failed', error);
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    if (!email || !password) throw new Error("Email and password required");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  },

  signUp: async (email, password, fullName) => {
    if (!email || !password) throw new Error("Email and password required");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  verifyOtp: async (email, token, type = 'signup') => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

if (typeof window !== 'undefined') {
  useAuth.getState().checkSession();
}
