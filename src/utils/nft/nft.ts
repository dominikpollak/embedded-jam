import AssetFingerprint from "@emurgo/cip14-js";
import { Buffer } from "buffer";
import { Asset, NftListingResponse } from "../../types/nft";

export const getPropertyName = (propertyName: string) =>
  propertyName === "" ? "Property" : propertyName;

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export const isCompleteNft = (
  data: Partial<NftListingResponse>
): data is Optional<NftListingResponse, "collection"> => {
  if (!data.policyId || !data.assetNameHex || !data.displayName) {
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
