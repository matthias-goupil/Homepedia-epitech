import { create } from "zustand";

type filterStore = {
  region: null | string;
};

export const useFilterStore = create<filterStore>((set) => ({
  region: null,
  setRegion: (newRegion: string | null) => set(() => ({ region: newRegion })),
}));
