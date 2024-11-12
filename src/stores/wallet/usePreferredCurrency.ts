import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NationalCurrencies } from "../../types/currency";

export const usePreferredCurrency = create<{
  preferredCurrency: NationalCurrencies;
  setPreferredCurrency: (state: NationalCurrencies) => void;
}>()(
  persist(
    (set, get) => ({
      preferredCurrency: "usd",
      setPreferredCurrency: (state) => set({ preferredCurrency: state }),
    }),
    {
      name: "preferred-currency",
    }
  )
);
