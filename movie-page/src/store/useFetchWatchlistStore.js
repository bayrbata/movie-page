import { create } from "zustand";
import { supabase } from "../lib/supabase";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const useFetchWatchlistStore = create((set) => ({
  movies: [],
  loading: false,
  error: null,

  fetchWatchlist: async () => {
    set({ loading: true, error: null });

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        set({ error: "Login required.", loading: false });
        return;
      }

      const { data: watchlist, error: watchlistError } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id);

      if (watchlistError) {
        set({ error: "Error fetching watchlist.", loading: false });
        return;
      }

      if (!watchlist || watchlist.length === 0) {
        set({ error: "No movies in watchlist.", loading: false });
        return;
      }
      const fetchedMovies = await Promise.all(
        watchlist.map(async (item) => {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${item.movie_id}?language=en-US`,
            {
              headers: {
                Authorization: `Bearer ${API_TOKEN}`,
                Accept: "application/json",
              },
            }
          );
          return res.json();
        })
      );

      set({ movies: fetchedMovies, loading: false });
    } catch (err) {
      console.error("Fetch error:", err);
      set({ error: "Something went wrong.", loading: false });
    }
  },
}));

export default useFetchWatchlistStore;
