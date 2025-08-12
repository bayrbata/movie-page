import { create } from "zustand";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const useTrailerStore = create((set) => ({
  trailer: [],

  fetchTrailer: async (id) => {
    try {
      const vidRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            Accept: "application/json",
          },
        }
      );

      const videoData = await vidRes.json();

      const filtered = videoData.results.filter(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      const trailerKeys = filtered.map((v) => v.key);
      set({ trailer: trailerKeys });
    } catch (err) {
      console.error("Failed to fetch trailer:", id, err);
    }
  },
}));

export default useTrailerStore;
