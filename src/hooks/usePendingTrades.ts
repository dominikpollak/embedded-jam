import { add, isBefore } from "date-fns";
import _ from "lodash";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PendingTradeType, Trade } from "../types/trade";

const PENDING_CACHE_SECONDS = 105;

export const usePendingTrades = create<{
  pendingTrades: Record<string, Trade>;
  refreshPendingTrades: (isConfirmed: boolean) => void;
  addPendingTrade: (
    action: PendingTradeType,
    txId: string,
    address: string
  ) => void;
}>()(
  persist(
    (set, get) => ({
      pendingTrades: {},
      refreshPendingTrades: (isConfirmed) => {
        set((state) => {
          const freshTrades = _.pickBy(state.pendingTrades, (x) =>
            isBefore(
              new Date(),
              add(new Date(x.initiatedAt), { seconds: PENDING_CACHE_SECONDS })
            )
          );
          const tokenTrade: Trade | undefined = freshTrades[0];
          usePendingTrades.persist.rehydrate();

          if (!tokenTrade) {
            return {
              pendingTrades: freshTrades,
            };
          }

          return {
            pendingTrades: isConfirmed ? {} : freshTrades,
          };
        });
      },
      addPendingTrade: (action, txId, address) =>
        set((state) => {
          const pendingTrades = state.pendingTrades;
          pendingTrades[0] = {
            type: action,
            initiatedAt: new Date().toISOString(),
            address: address,
            txId,
          };
          return {
            pendingTrades,
          };
        }),
    }),
    {
      name: "pending-trades-store",
    }
  )
);
