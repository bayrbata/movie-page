import { create } from "zustand";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const useAllTrailerStore = create((set) => ({
  trailersMap: {},
  loading: false,
  error: null,

  fetchTrailersForMovies: async (movies) => {
    set({ loading: true, error: null, trailersMap: {} });

    try {
      const trailersMap = {};

      await Promise.all(
        movies.map(async (movie) => {
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
              {
                headers: {
                  Authorization: `Bearer ${API_TOKEN}`,
                  Accept: "application/json",
                },
              }
            );

            const data = await res.json();

            const trailer = data.results.find(
              (v) => v.type === "Trailer" && v.site === "YouTube"
            );

            if (trailer) {
              trailersMap[movie.id] = {
                title: trailer.name,
                trailerKey: trailer.key,
              };
            } else {
              trailersMap[movie.id] = null;
            }
          } catch (err) {
            console.error(
              `Failed to fetch trailers for movie ${movie.id}`,
              err
            );
            trailersMap[movie.id] = null;
          }
        })
      );

      set({ trailersMap, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useAllTrailerStore;
