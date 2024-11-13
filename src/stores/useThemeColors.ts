import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeColors = create<{
  textColor: string;
  bgColor: string;
  setTextColor: (state: string) => void;
  setBgColor: (state: string) => void;
}>()(
  persist(
    (set, get) => ({
      textColor: "#000",
      setTextColor: (state) => set({ textColor: state }),
      bgColor: "#fff",
      setBgColor: (state) => set({ bgColor: state }),
    }),
    {
      name: "theme-colors",
    }
  )
);
