import { RoyaltyData } from "./nft";

export type MintInfo = {
  mintPrice: number;
  collectionName: string;
  policyId: string;
  mintingFrom: Date;
  mintingTo: Date;
  isPaused: boolean;
  isFinished: boolean;
  maxMintedPerTx: number;
};

export type CollectionDetailResponse = {
  name: string;
  displayName: string;
  description?: string;
  projectUrl?: string;
  policyIds: string[];
  floorPrice?: number;
  volume?: number;
  owners?: number;
  nftsInCirculation: number;
  properties: Record<string, Record<string, number>>;
  hasRarity: boolean;
  likes: number;
  links: {
    website?: string;
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  isMinting: boolean;
  category: string;
  articleLink: string;
  introVideoLink: string;
  isWebsiteDown: boolean;
  highestCollectionOffer: {
    price: number;
    createdByAddress: string;
  };
  highestNftOffer: {
    price: number;
    createdByAddress: string;
  };
  mintingInfo?: MintInfo;
} & RoyaltyData;
