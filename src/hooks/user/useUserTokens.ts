import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserTokens = create<{
  tokens: Record<string, { expires: string; token: string }>;
  addToken: (address: string, token: string) => void;
  removeToken: (address: string) => void;
}>()(
  persist(
    (set, get) => ({
      tokens: {},
      addToken: (address, token) =>
        set((state) => ({
          tokens: {
            ...state.tokens,
            [address]: {
              token: token,
              expires: new Date(
                new Date().getFullYear() + 1,
                new Date().getMonth(),
                new Date().getDate()
              ).toISOString(),
            },
          },
        })),
      removeToken: (address) =>
        set((state) => {
          const tokens = state.tokens;
          delete tokens[address];
          return { tokens };
        }),
    }),
    {
      name: "auth-tokens",
    }
  )
);
