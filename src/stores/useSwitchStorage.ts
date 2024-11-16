import create from "zustand";
import { persist } from "zustand/middleware";
import { Timespans } from "../types/commonTypes";

type CollectionGraphStats = {
  timeSpan: "all" | "1y" | "30d" | "7d";
  disabledGraphs: {
    volume: boolean;
    avgPrice: boolean;
    priceRange: boolean;
    listingCount: boolean;
  };
};

export const useSwitchStorage = create<{
  explorerView: "grid" | "list" | "tab";
  setExplorerView: (view: "grid" | "list" | "tab") => void;
  statsTrendingDate: Timespans;
  setStatsTrendingDate: (trending: Timespans) => void;
  statsMainDate: Timespans;
  setStatsMainDate: (main: Timespans) => void;
  collectionGraphStats: CollectionGraphStats;
  setCollectionGraphStats: (stats: CollectionGraphStats) => void;
  exploreCollectionsView: "grid" | "list";
  setExploreCollectionsView: (view: "grid" | "list") => void;
}>()(
  persist(
    (set, get) => ({
      explorerView: "list",
      setExplorerView: (view) => set({ explorerView: view }),
      statsTrendingDate: "all",
      setStatsTrendingDate: (trending) => set({ statsTrendingDate: trending }),
      statsMainDate: "all",
      setStatsMainDate: (main) => set({ statsMainDate: main }),
      collectionGraphStats: {
        timeSpan: "7d",
        disabledGraphs: {
          volume: false,
          avgPrice: false,
          priceRange: false,
          listingCount: false,
        },
      },
      setCollectionGraphStats: (stats) => set({ collectionGraphStats: stats }),
      exploreCollectionsView: "list",
      setExploreCollectionsView: (view) =>
        set({ exploreCollectionsView: view }),
    }),
    {
      name: "switch-storage",
    }
  )
);
