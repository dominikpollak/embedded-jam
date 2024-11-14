import { CollectionDetailResponse } from "./collection";
import { ExtendedNftToken, NftListData, NftOffer } from "./nft";

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

export type TradeModal =
  | "list"
  | "buy"
  | "update"
  | "cancel"
  | "makeOffer"
  | "cancelOffer"
  | "acceptOffer"
  | "migrate"
  | "delist"
  | "claim";

export interface TradeModalData {
  nftListing?: NftListData;
  offer?: NftOffer;
  collection?: CollectionDetailResponse;
  selectedItems?: ExtendedNftToken[];
  claimData?: {
    datum: string;
    claimAmount: number;
  };
}
