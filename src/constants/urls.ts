import { getPropertiesParams } from "../utils/queryParams";
import { config } from "./config";

type ExplorerEntity =
  | "tokenPolicy"
  | "token"
  | "address"
  | "transaction"
  | "stakeKey";

export const urls = {
  index: "/",
  creators: "/creators",
  about: "/about",
  assetDetail: (assetFingerprint: string) => `/asset/${assetFingerprint}`,
  exploreCollectionWithProperty: (
    collection: string,
    property: string,
    value: string
  ) => {
    return {
      pathname: `/collections/${collection}`,
      query: {
        properties: getPropertiesParams([[property, value]]),
      },
    };
  },

  exploreNfts: "/explore/nfts",
  exploreCollections: "/explore/collections",
  collectionDetail: (collectionName: string) =>
    `/collections/${collectionName}`,
  profile: (stakeAddress: string) => `/profile/${stakeAddress}`,
  editProfile: "/profile/edit",
  embed: "/embed",
  migrate: "/migrate",
};

const explorerPaths: Record<ExplorerEntity, string> = {
  tokenPolicy: "policy",
  token: "asset",
  address: "address",
  stakeKey: "stake",
  transaction: "tx",
};

export const getExplorerUrl = (
  entity: ExplorerEntity,
  hash: string | undefined
) => `${config.explorerUrl}${explorerPaths[entity]}/${hash || ""}`;
