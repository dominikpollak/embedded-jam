import { ChevronDown, ChevronUp, Info } from "lucide-react";
import React from "react";
import { colors } from "../../constants/colors";
import { ScriptConstants } from "../../types/script";
import { lovelaceToAda, useFormatPrice } from "../../utils/format";
import { splitPrice } from "../../utils/nft/nft";
import { Tooltip } from "../global/Tooltip";

type Props = {
  templateType: "sell" | "buy" | "cancel" | "offer";
  priceInLovelace: number;
  prices?: {
    assetNameHex: string;
    collection: string;
    price: number;
  }[];
  royaltyPercentage?: number;
  royalties?: {
    collection: string;
    percentage: number;
  }[];
  scriptInfo: ScriptConstants | undefined;
  showDepositInfo?: boolean;
  showFeeInfo?: boolean;
};

export const PriceAndFeeInfoRow: React.FC<Props> = ({
  templateType,
  priceInLovelace,
  royaltyPercentage,
  prices,
  royalties,
  scriptInfo,
  showDepositInfo,
  showFeeInfo,
}) => {
  const formatPrice = useFormatPrice();
  const [isOpen, setIsOpen] = React.useState(false);

  if (!scriptInfo) return null;
  const { sellerAda, treasuryAda, royaltyAda } = splitPrice(
    priceInLovelace,
    royaltyPercentage || 0,
    scriptInfo
  );

  const uniqueRoyalties = royalties?.reduce((acc, royalty) => {
    const existingRoyalty = acc.find(
      (r) => r.collection === royalty.collection
    );

    if (existingRoyalty) {
      return acc;
    } else {
      acc.push({ ...royalty });
    }

    return acc;
  }, [] as { collection: string; percentage: number }[]);

  const totalRoyalties =
    uniqueRoyalties?.reduce((sum, royalty) => {
      const relatedPrices = prices?.filter(
        (price) => price.collection === royalty.collection
      );
      const totalCollectionPrice =
        relatedPrices?.reduce((total, price) => total + price.price, 0) || 0;
      return sum + royalty.percentage * totalCollectionPrice * 1000000;
    }, 0) || 0;

  const totalLovelacePrice: number =
    templateType === "offer"
      ? priceInLovelace + 2000000 - totalRoyalties
      : priceInLovelace - totalRoyalties;
  const totalSellerAdaPrice =
    templateType === "offer"
      ? sellerAda - totalRoyalties + 2000000
      : sellerAda - totalRoyalties;

  return (
    <div className="p-[15px] rounded-[15px] bg-background text-text border border-border flex flex-col gap-[5px]">
      <span className="text-[16px] font-bold">Summary</span>
      <div className="flex justify-between [&>span]:flex [&>span]:gap-[5px] [&>span]:align-baseline">
        <span>{templateType === "buy" ? "NFT price" : "Amount"}</span>
        <span>
          {lovelaceToAda(
            templateType === "buy"
              ? priceInLovelace - treasuryAda - royaltyAda
              : sellerAda + treasuryAda + royaltyAda
          )}
        </span>
      </div>
      {showFeeInfo && (
        <div className="flex justify-between [&>span]:flex [&>span]:gap-[5px] [&>span]:align-baseline">
          <span>Service fee ({scriptInfo.treasuryFeeBasis / 100}%)</span>
          <span>{lovelaceToAda(treasuryAda)}</span>
        </div>
      )}

      {royalties && royalties.length > 0 && (
        <>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex justify-between items-center [&>span]:flex [&>span]:gap-[5px] [&>span]:align-baseline"
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                cursor: "pointer",
              }}
            >
              Total Royalties
              {isOpen ? (
                <ChevronUp color={colors.text} size={12} />
              ) : (
                <ChevronDown color={colors.text} size={12} />
              )}
            </span>
            <span>{lovelaceToAda(totalRoyalties)}</span>
          </div>

          {isOpen && (
            <div>
              {uniqueRoyalties &&
                prices &&
                uniqueRoyalties.map((royalty) => (
                  <div
                    className="flex justify-between [&>span]:flex [&>span]:gap-[5px] [&>span]:align-baseline"
                    key={royalty.collection}
                  >
                    <span className="text-[13px]">
                      {royalty.collection} - {royalty.percentage * 100}%
                    </span>
                    <span className="text-[13px]">
                      {lovelaceToAda(
                        royalty.percentage *
                          (prices
                            ?.filter(
                              (price) => price.collection === royalty.collection
                            )
                            .reduce((total, price) => total + price.price, 0) ||
                            0) *
                          1000000
                      )}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {royaltyPercentage && (
        <div className="flex justify-between [&>span]:flex [&>span]:gap-[5px] [&>span]:align-baseline">
          <span className="flex items-center">
            Royalties ({(royaltyPercentage * 100).toFixed(2)}%)
            <Tooltip
              content={
                <div className="w-[180px] text-center">
                  <span className="text-[13px]">
                    {(royaltyPercentage * 100).toFixed(2)}% of the sale price
                    will go back to the creator. This amount is already included
                    in the price.
                  </span>
                </div>
              }
            >
              <Info size={20} color={colors.text} />
            </Tooltip>
          </span>
          <span>{lovelaceToAda(royaltyAda)}</span>
        </div>
      )}
      {showDepositInfo && (
        <div className="flex justify-between [&>span]:flex [&>span]:gap-[5px] [&>span]:align-baseline">
          <span>
            <span>Deposit</span>
            <Tooltip
              content={
                <div className="w-[180px] text-center">
                  <span className="text-[13px]">
                    Deposit will be returned to you when your trade is either
                    completed or cancelled.
                  </span>
                </div>
              }
            >
              <Info size={20} color={colors.text} />
            </Tooltip>
          </span>
          <span className="text-base">{lovelaceToAda(scriptInfo.deposit)}</span>
        </div>
      )}
      <div className="mt-[20px]">
        <div className="flex justify-between [&>span]:flex [&>span]:gap-[5px] [&>span]:align-baseline mt-[-10px] pt-[10px] border-t border-border">
          <span className="font-medium text-lg">
            {templateType === "buy" || templateType === "offer"
              ? "Total"
              : "You earn"}
          </span>
          <span className="font-medium text-lg">
            {lovelaceToAda(
              templateType === "buy" || templateType === "offer"
                ? totalLovelacePrice
                : totalSellerAdaPrice
            )}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[13px]">
            {formatPrice(templateType === "buy" ? priceInLovelace : sellerAda)}
          </span>
        </div>
      </div>
    </div>
  );
};
