import { create } from "zustand";
import { supabase } from "../lib/supabase";

const useAuthStore = create((set) => ({
  user: null,

  authListener: () => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({ user: session?.user ?? null });
      }
    );
    return () => listener.subscription?.unsubscribe();
  },

  login: async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.href,
      },
    });
    if (error) {
      alert(error);
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));

export default useAuthStore;
