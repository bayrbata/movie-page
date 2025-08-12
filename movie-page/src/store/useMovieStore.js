import { create } from "zustand";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const useMovieStore = create((set) => ({
  movie: null,

  fetchMovie: async (id) => {
    if (!id) return;
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      }
    );
    const data = await res.json();
    set({ movie: data });
  },
}));

export default useMovieStore;
