import { create } from "zustand";
import { supabase } from "../lib/supabase";

const useWatchlistStore = create((set, get) => ({
  addedToWatchlist: false,

  checkAddedWatchlist: async (userId, movieId) => {
    if (!userId) return;
    const { data } = await supabase
      .from("watchlist")
      .select("*")
      .eq("user_id", userId)
      .eq("movie_id", movieId);

    if (data.length > 0) {
      set({ addedToWatchlist: true });
    }
  },

  toggleWatchlist: async (userId, movieId) => {
    const { addedToWatchlist } = get();
    if (!userId) {
      alert("Please log in first");
      return;
    }

    try {
      if (!addedToWatchlist) {
        const { error } = await supabase
          .from("watchlist")
          .insert([{ user_id: userId, movie_id: movieId }]);
        if (error) throw error;
        set({ addedToWatchlist: true });
      } else {
        const { error } = await supabase
          .from("watchlist")
          .delete()
          .eq("user_id", userId)
          .eq("movie_id", movieId);
        if (error) throw error;
        set({ addedToWatchlist: false });
      }
    } catch (err) {
      console.error("Watchlist update error:", err);
      alert("Something went wrong");
    }
  },
}));

export default useWatchlistStore;
