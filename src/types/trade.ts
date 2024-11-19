import { CollectionDetailResponse } from "./collection";
import { ExtendedNftToken, NftListData, NftOffer } from "./nft";

export type TradeError =
  | "NO_COLLATERAL"
  | "InputsExhaustedError"
  | "WRONG_ADDRESS"
  | "TX_ASSEMBLE_ERROR"
  | "TX_TOO_BIG"
  | "OFFER_DOES_NOT_EXIST"
  | "NO_MIN_ADA_LEFT"
  | "FULL_MEMPOOL"
  | "MINTING_NOT_LIVE"
  | "NOT_IN_SCRIPT"
  | "User declined to sign the transaction."
  | "Cannot read properties of undefined (reading 'length')";

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
