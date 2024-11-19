import AssetFingerprint from "@emurgo/cip14-js";
import { Buffer } from "buffer";
import { Asset, NftListingResponse, RoyaltyData } from "../../types/nft";
import { ScriptConstants } from "../../types/script";

export const getPropertyName = (propertyName: string) =>
  propertyName === "" ? "Property" : propertyName;

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const isCompleteNft = (
  data: Partial<NftListingResponse>
): data is Optional<NftListingResponse, "collection"> => {
  if (!data || !data?.policyId || !data?.assetNameHex || !data?.displayName) {
    return false;
  }
  return true;
};

export const getAssetFingerprint = (asset: Asset) => {
  const fingerprint = AssetFingerprint.fromParts(
    Buffer.from(asset.policyId, "hex"),
    Buffer.from(asset.assetName, "hex")
  );

  return fingerprint.fingerprint().slice(5);
};

export const getRoyalty = <T extends RoyaltyData>(data: T) => {
  const { royaltiesAddress, royaltiesRate } = data;
  if (!!royaltiesAddress && !!royaltiesRate) {
    return {
      royaltyAddressStr: royaltiesAddress,
      royaltyPercentage: Number(royaltiesRate),
    };
  }
  return undefined;
};

export const getRoyaltyFee = (
  price: number,
  royaltyPercentage: number,
  royaltyIgnoreUntil: number
) => {
  const fee = Math.floor(price * royaltyPercentage);
  return fee < royaltyIgnoreUntil ? 0 : fee;
};

export const generateImgLinkingUrl = (
  assetFingerprint: string,
  size: "ico" | "sm" | "md" | "lg"
): string => {
  return (
    assetFingerprint[!assetFingerprint.startsWith("asset1") ? 1 : 6] +
    "/" +
    assetFingerprint[!assetFingerprint.startsWith("asset1") ? 7 : 12] +
    "/" +
    assetFingerprint[!assetFingerprint.startsWith("asset1") ? 12 : 17] +
    "/" +
    assetFingerprint[!assetFingerprint.startsWith("asset1") ? 20 : 25] +
    "/" +
    assetFingerprint[!assetFingerprint.startsWith("asset1") ? 22 : 27] +
    "/" +
    assetFingerprint[!assetFingerprint.startsWith("asset1") ? 26 : 31] +
    "/" +
    `${assetFingerprint.startsWith("asset1") ? "" : "asset"}` +
    assetFingerprint +
    "/" +
    size
  );
};

export const getFee = (
  price: number,
  feeBasis: number,
  feeIgnoreUntil: number
) => {
  const fee = Math.floor((price * feeBasis) / (100 * 100));
  return fee < feeIgnoreUntil ? 0 : fee;
};

export const splitPrice = (
  price: number,
  royaltyPercentage: number,
  config: ScriptConstants
) => {
  const treasury = getFee(
    price,
    config.treasuryFeeBasis,
    config.treasuryFeeIgnoreUntil
  );

  const royalty = getRoyaltyFee(
    price,
    royaltyPercentage,
    config.royaltyFeeIgnoreUntil
  );

  return {
    sellerAda: price - treasury - royalty,
    treasuryAda: treasury,
    royaltyAda: royalty,
  };
};
