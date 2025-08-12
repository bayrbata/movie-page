import { create } from "zustand";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const useUrlMovieStore = create((set, get) => ({
  movies: {},
  loading: false,
  error: null,

  fetchMovies: async (url) => {
    const state = get();

    if (state.movies[url]) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        set((prev) => ({
          error: "No movies found.",
          movies: { ...prev.movies, [url]: [] },
        }));
      } else {
        set((prev) => ({
          movies: { ...prev.movies, [url]: data.results },
        }));
      }
    } catch (err) {
      set({ error: "Failed to fetch data", err });
    }
    set({ loading: false });
  },
}));
