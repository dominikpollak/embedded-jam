import { create } from "zustand";

export const useIsTradeModalOpen = create<{
  isTradeModalOpen: boolean;
  setIsTradeModalOpen: (value: boolean) => void;
}>()((set) => ({
  isTradeModalOpen: false,
  setIsTradeModalOpen: (value) => set(() => ({ isTradeModalOpen: value })),
}));
