import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WalletButtonDataState } from "../../types/wallet";

export const useWalletButtonData = create<WalletButtonDataState>()(
  persist(
    (set, get) => ({
      walletButtonData: [],
      setWalletButtonData: (address, url, username) => {
        set((state) => {
          const index = state.walletButtonData.findIndex(
            (item) => item.address === address
          );
          if (index !== -1) {
            const newWalletButtonData = [...state.walletButtonData];
            newWalletButtonData[index] = { address, url, username };
            return { walletButtonData: newWalletButtonData };
          } else {
            return {
              walletButtonData: [
                ...state.walletButtonData,
                { address, url, username },
              ],
            };
          }
        });
      },
    }),
    {
      name: "wallet-button-data",
    }
  )
);
