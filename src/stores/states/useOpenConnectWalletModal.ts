import { create } from "zustand";

export const useOpenConnectWalletModal = create<{
  openConnectWalletModal: boolean;
  setOpenConnectWalletModal: (value: boolean) => void;
}>()((set) => ({
  openConnectWalletModal: false,
  setOpenConnectWalletModal: (value) =>
    set(() => ({ openConnectWalletModal: value })),
}));
