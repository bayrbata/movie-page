import { create } from "zustand";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const useSearchStore = create((set, get) => ({
  resultsCache: {},
  loading: false,
  error: null,

  searchMovies: async (query) => {
    if (!query) return;

    const cached = get().resultsCache[query];
    if (cached) {
      set({ error: null, loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        set((state) => ({
          error: "No movies found.",
          resultsCache: { ...state.resultsCache, [query]: [] },
          loading: false,
        }));
      } else {
        set((state) => ({
          resultsCache: { ...state.resultsCache, [query]: data.results },
          loading: false,
          error: null,
        }));
      }
    } catch (err) {
      set({ error: "Failed to fetch data.", err, loading: false });
    }
  },
}));

export default useSearchStore;
