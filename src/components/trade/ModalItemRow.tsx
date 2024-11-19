import React from "react";
import { CollectionDetailResponse } from "../../types/collection";
import { NftListData, NftOffer } from "../../types/nft";
import { lovelaceToAda, useFormatPrice } from "../../utils/format";
import {
  generateImgLinkingUrl,
  getAssetFingerprint,
} from "../../utils/nft/nft";
import { PriceInput, PriceState } from "../global/inputs/PriceInput";
import { NftThumbnail } from "../nft/NftThumbnail";
import { RarityBadge } from "../nft/RarityBadge";

type Props = {
  nftListing?: NftListData;
  priceState?: PriceState;
  collection?: CollectionDetailResponse;
  offer?: NftOffer;
  theme?: "dark" | "light" | "dimmed" | "blue" | undefined;
};

export const ModalItemRow: React.FC<Props> = ({
  nftListing,
  priceState,
  collection,
  offer,
  theme,
}) => {
  const formatPrice = useFormatPrice();
  const floorPrice =
    nftListing?.collection?.floorPrice || collection?.floorPrice;
  const assetfingerprint =
    nftListing || offer?.nft
      ? getAssetFingerprint({
          assetName: nftListing?.assetNameHex || offer?.nft?.assetNameHex || "",
          policyId: nftListing?.policyId || offer?.nft?.policyId || "",
        })
      : "";
  const imageSrc = assetfingerprint
    ? generateImgLinkingUrl(assetfingerprint, "ico")
    : `collection/${
        collection?.policyIds[0] || offer?.collection.policyIds[0]
      }/first`;

  return (
    <div className="flex flex-wrap gap-[15px] justify-between items-center content-start p-[15px] rounded-[15px] bg-background text-text border border-border">
      <div className="flex items-center">
        <NftThumbnail
          src={imageSrc}
          height={30}
          width={30}
          disablePlaceholder
          alt={nftListing?.displayName || collection?.displayName}
          className="h-[45px] w-auto rounded-[20%] float-left"
        />
        <div className="basis-[250px] grow ml-[15px] flex flex-col justify-center items-start">
          <span
            className="font-medium max-w-[170px] text-ellipsis overflow-hidden block"
            style={{ lineHeight: "17px" }}
          >
            {nftListing?.displayName ||
              collection?.displayName ||
              offer?.nft?.displayName}
          </span>
          <div className="flex flex-col items-start gap-[3px]">
            <span className="text-[13px]">
              {nftListing?.collection?.displayName ||
                offer?.collection.displayName}
            </span>{" "}
            {nftListing?.rarity && (
              <RarityBadge
                theme={theme}
                percentage={nftListing?.rarity.percentage}
                nftsInCollection={
                  nftListing.collection?.nftsInCirculation ||
                  collection?.nftsInCirculation ||
                  0
                }
                order={nftListing?.rarity.order}
                type="smaller"
              />
            )}
          </div>
        </div>
      </div>
      {(nftListing?.sellOrder?.price || offer?.price) && (
        <div className="flex flex-col items-end">
          <span className="font-medium">
            {lovelaceToAda(nftListing?.sellOrder?.price || offer?.price || 0)}
          </span>
          <span className="text-[13px]">
            {formatPrice(nftListing?.sellOrder?.price) || ""}
          </span>
        </div>
      )}
      {priceState && (
        <div className="flex flex-col items-end">
          <PriceInput
            originalPrice={(floorPrice ?? 0) / 1000000}
            autofocus
            state={priceState}
          />
          <span
            className="text-[13px]"
            style={{ paddingRight: "3px", transform: "translateY(5px)" }}
          >
            Floor price:{" "}
            {lovelaceToAda(
              nftListing?.collection?.floorPrice || collection?.floorPrice || 0
            )}
          </span>
        </div>
      )}
    </div>
  );
};
