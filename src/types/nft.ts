import { Paginate } from "./commonTypes";

type DisplayUser = {
  address: string;
  stakeKey?: string;
  username?: string;
  usernameType?: "adahandle" | "jam_username";
};

export type Asset = {
  policyId: string;
  assetName: string;
};

export type CollectionInfo = {
  name: string;
  displayName: string;
  description?: string;
  floorPrice: number;
  nftsInCirculation: number;
} & RoyaltyData;

export type RoyaltyData = {
  royaltiesAddress?: string;
  royaltiesRate?: string;
  royalties?: {
    address: string;
    rate: number;
  };
};

export type Rarity = {
  percentage: number;
  score: number;
  order: number;
};

export type SellOrderSource = "jam" | "jpg";

export type NftToken = {
  policyId: string;
  assetNameHex: string;
  displayName: string;
  collection: CollectionInfo;
  rarity: Rarity;
  likes: number;
  sellOrder: {
    listedByAddress: string;
    listedByStakeKey: string;
    price: number;
    source: SellOrderSource;
    listedOn: string;
    listingTxHash?: string;
    listingUtxoIndex?: number;
    royalties: {
      address: string;
      rate: number;
    };
    scriptPaymentCredentials: string;
  } | null;
  fullMetadata?: any;
  owner?: {
    address: string;
    stakeKey: string;
    username: string | null;
    usernameType: string;
  };
  assetFingerprint?: string;
  displayFormat?: "grid" | "list" | "tab";
  disableBuyNow?: boolean;
  hideCollectionName?: boolean;
  owned?: boolean;
};

export type ExtendedNftToken = NftToken & {
  selected: ExtendedNftToken[];
  isSelected: boolean;
  onCheckboxChange: () => void;
};

export type NftListingResponse = NftToken & {
  properties: Array<{ name: string; value: string; commonness: string }>;
  owner?: DisplayUser;
};

export type ExploreNftsResponse = Paginate & {
  items: NftListingResponse[];
};

export type NftOffer = {
  nft?: {
    policyId: string;
    assetNameHex: string;
    displayName: string;
    image?: string;
  } | null;
  collection: {
    name: string;
    displayName: string;
    image?: string;
    policyIds: string[];
    floorPrice: number | undefined;
    royaltiesAddress: string | undefined;
    royaltiesRate: string | undefined;
  };
  price: number;
  createdOn: string;
  createdByAddress: string;
  createdByStakeKey: string;
  listingTxHash: string;
  listingUtxoIndex: number;
};

export type NftListData = {
  policyId: string;
  assetNameHex: string;
  displayName: string;
  rarity: Rarity;
  collection: CollectionInfo | undefined;
  sellOrder: {
    listedByAddress: string;
    listedByStakeKey: string;
    price: number;
    source: SellOrderSource;
    listedOn: string;
    royalties: {
      address: string;
      rate: number;
    };
    scriptPaymentCredentials: string;
    //payouts: Payout[] | undefined;
  } | null;
  assetFingerprint?: string;
};
