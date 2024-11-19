import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMyAffiliateLink = create<{
  userLinks: { address: string; link: string }[];
  setUserLinks: (address: string, link: string) => void;
}>()(
  persist(
    (set, get) => ({
      userLinks: [],
      setUserLinks: (address, link) =>
        set((state) => ({
          userLinks: [...state.userLinks, { address, link }],
        })),
    }),
    {
      name: "user-links",
    }
  )
);
