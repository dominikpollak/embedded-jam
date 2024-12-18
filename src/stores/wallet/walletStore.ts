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

export const useWalletStore = create<
  WalletState & {
    setAll: (state: Partial<WalletState>) => void;
  }
>()(
  persist(
    (set, get) => ({
      ...defaultState,
      setAll: (state) => set(state),
    }),
    {
      name: "wallet-store",
      serialize: (data) =>
        stringify(data, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        ),
      deserialize: (data) =>
        parse(data, (key, value) =>
          typeof value === "string" && /^\d+n$/.test(value)
            ? BigInt(value.slice(0, -1))
            : value
        ),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) =>
            PERSISTED_ENTRIES.includes(key as keyof WalletState)
          )
        ),
    }
  )
);
