import { create } from "zustand";
import { supabase } from "../lib/supabase";

const useReviewsStore = create((set) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviews: async (movieId) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("movie_id", movieId);

      if (error) throw error;
      set({ reviews: data || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  subscribeToReviews: (movieId) => {
    const channel = supabase
      .channel("reviews-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reviews",
          filter: `movie_id=eq.${movieId}`,
        },
        (payload) => {
          set((state) => ({ reviews: [...state.reviews, payload.new] }));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
}));

export default useReviewsStore;
