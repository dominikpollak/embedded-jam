export type PendingTradeType =
  | "buyPending"
  | "updatePending"
  | "listPending"
  | "cancelList"
  | "delistPending"
  | "offerPending"
  | "acceptOfferPending"
  | "cancelOfferPending"
  | "claimPending";

export type Trade = {
  type: PendingTradeType;
  initiatedAt: string;
  txId: string;
  address: string;
};
