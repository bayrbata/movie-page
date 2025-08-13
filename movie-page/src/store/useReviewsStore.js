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
        .order('created_at', { ascending: false })
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
          set((state) => ({ reviews: [payload.new, ...state.reviews ] }));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  saveReview: async (userId, userName, headline, review, movieId, ratingValue) => {
    if (!userId || !movieId) return;
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from("reviews").upsert({
        user_id: userId,
        user_name: userName,
        headline: headline,
        review: review,
        movie_id: movieId,
        rating: ratingValue,
      });

      if (error) throw error;
      set({ loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useReviewsStore;
