import { create } from "zustand";
import { supabase } from "../lib/supabase";

const useRatingStore = create((set) => ({
  rating: 0,
  loading: false,
  error: null,

  fetchRating: async (userId, movieId) => {
    if (!userId || !movieId) return;
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("user_id", userId)
        .eq("movie_id", movieId)
        .maybeSingle();
        
      if (error) throw error;

      set({ rating: data ? data.rating : 0 });
    } catch (error) {
      set({ error: error.message });
    }
    set({ loading: false });
  },

  saveRating: async (userId, movieId, ratingValue) => {
    if (!userId || !movieId) return;
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from("ratings").upsert(
        {
          user_id: userId,
          movie_id: movieId,
          rating: ratingValue,
        },
        { onConflict: ["movie_id", "user_id"] }
      );

      if (error) throw error;

      set({ rating: ratingValue });
    } catch (error) {
      set({ error: error.message });
    }
    set({ loading: false });
  },

  clearRating: () => set({ rating: 0, error: null }),
}));

export default useRatingStore;
