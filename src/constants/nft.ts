import { config } from "./config";

export const MIN_LISTING_PRICE_ADA = 3;
export const MAX_LISTING_PRICE_ADA = 100000000;
export const assetUrls = {
  getThumbnail: (path: string) => `${config.assetsUrl}${path}`,
  webFile: (name: string) => `${config.resourceUrl}web/${name}`,
  collectionBanner: (collectionName: string) =>
    `${config.resourceUrl}collections/${collectionName}/banner`,
  collectionThumbnail: (policyId: string, size: string) =>
    `${config.assetsUrl}collection/${policyId}/${size}`,
};

export const tradeTypeLabels = {
  buyPending: "Buy",
  updatePending: "Update",
  listPending: "List",
  delistPending: "Delist",
  offerPending: "Offer",
  cancelList: "Cancel list",
  acceptOfferPending: "Accept offer",
  cancelOfferPending: "Cancel offer",
  claimPending: "Claim",
} as const;
