import { create } from "zustand";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const useCreditStore = create((set) => ({
  credit: null,
  director: null,
  cast: [],
  loading: false,
  error: null,

  fetchCredit: async (id) => {
    if (!id) return;
    set({ loading: true, error: null, director: null, cast: [] });

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            Accept: "application/json",
          },
        }
      );
      const data = await res.json();

      if (!data || Object.keys(data).length === 0) {
        set({
          error: "No credit found",
          loading: false,
          director: null,
          cast: [],
        });
      } else {
        const director = data.crew.find((d) => d.job === "Director") || null;
        const top3Cast = data.cast
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 3);
        set({ credit: data, director, cast: top3Cast, loading: false });
      }
    } catch (err) {
      set({
        error: "Failed to fetch data",
        err,
        loading: false,
        director: null,
        cast: [],
      });
    }
  },
}));

export default useCreditStore;
