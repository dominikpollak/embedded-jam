import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStorageVersion = create<{
  version: number;
  setVersion: (version: number) => void;
}>()(
  persist(
    (set, get) => ({
      version: 1,
      setVersion: (version) => set({ version }),
    }),
    {
      name: "version",
    }
  )
);
