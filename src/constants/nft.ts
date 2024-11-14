import { config } from "./config";

export const assetUrls = {
  getThumbnail: (path: string) => `${config.assetsUrl}${path}`,
  webFile: (name: string) => `${config.resourceUrl}web/${name}`,
  collectionBanner: (collectionName: string) =>
    `${config.resourceUrl}collections/${collectionName}/banner`,
  collectionThumbnail: (policyId: string, size: string) =>
    `${config.assetsUrl}collection/${policyId}/${size}`,
};
