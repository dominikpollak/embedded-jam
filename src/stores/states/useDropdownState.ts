import { create } from "zustand";

export const useDropdownState = create<{
  openId: string | null;
  setOpenId: (openId: string | null) => void;
}>((set) => ({
  openId: null,
  setOpenId: (openId: string | null) => set({ openId }),
}));
