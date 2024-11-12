import { parse, stringify } from "flatted";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WalletState } from "../../types/wallet";

const PERSISTED_ENTRIES: readonly (keyof WalletState)[] = [
  "address",
  "stakeKey",
  "walletType",
  "disabledExt",
];

const defaultState: WalletState = {
  address: undefined,
  stakeKey: undefined,
  walletType: undefined,
  walletApi: undefined,
  disabledExt: false,
  job: null,
};

//  MAY NOT WORK

const customStorage = {
  getItem: (name: string) => {
    const data = localStorage.getItem(name);
    return data
      ? parse(data, (key, value) =>
          typeof value === "string" && /^\d+n$/.test(value)
            ? BigInt(value.slice(0, -1))
            : value
        )
      : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(
      name,
      stringify(value, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useWalletStore = create<
  WalletState & {
    setWalletState: (state: Partial<WalletState>) => void;
  }
>()(
  persist(
    (set) => ({
      ...defaultState,
      setWalletState: (state) => set(state),
    }),
    {
      name: "wallet-store",
      storage: customStorage,
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            PERSISTED_ENTRIES.includes(key as keyof WalletState)
          )
        ),
    }
  )
);
