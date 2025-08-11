import { create } from "zustand";

const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const useImagesStore = create((set, get) => ({
  images: {},
  loading: false,
  error: null,

  fetchImages: async (id) => {
    if (get().images[id]) return;

    set({ loading: true, error: null });

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/images`,
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
        set((state) => ({
          error: "No images found",
          images: { ...state.images, [id]: null },
        }));
      } else {
        set((state) => ({
          images: { ...state.images, [id]: data },
        }));
      }
    } catch (err) {
      set({ error: "Failed to fetch data", err });
    }

    set({ loading: false });
  },
}));
