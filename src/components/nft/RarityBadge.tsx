import React from "react";
import { rarityColors } from "../../constants/colors";
import { formatNumber } from "../../utils/format";
import { Tooltip } from "../global/Tooltip";

export type RarityOrder = "1" | "2" | "3" | "4" | "5" | "6";

const getRarityOrder = (percentage: number): RarityOrder => {
  if (percentage <= 1) return "1";
  if (percentage <= 5) return "2";
  if (percentage <= 10) return "3";
  if (percentage <= 20) return "4";
  if (percentage <= 50) return "5";
  return "6";
};

type Props = {
  percentage: number;
  nftsInCollection: number;
  order: number;
  showAbsoluteOrder?: boolean;
  showTooltip?: boolean;
  type?: "small" | "smaller";
  theme?: "dark" | "light" | "dimmed" | "blue" | undefined;
};
export const RarityBadge: React.FC<Props> = ({
  percentage,
  nftsInCollection,
  order,
  showAbsoluteOrder = false,
  showTooltip = true,
  type,
  theme,
}) => {
  const rarityOrder = getRarityOrder(percentage);
  const text = showAbsoluteOrder
    ? `${order} / ${nftsInCollection}`
    : percentage < 50
    ? `TOP ${formatNumber(Math.ceil(percentage * 100) / 100)}%`
    : "COMMON";

  const content = (
    <div
      className={`flex items-center w-fit whitespace-nowrap rounded-[50px] ${
        type === "small" || type === "smaller"
          ? "py-0 px-[7px] h-[16px]"
          : "py-0 px-[10px] h-[25px]"
      } `}
      style={{
        color: rarityColors[rarityOrder].text,
        backgroundColor: rarityColors[rarityOrder].background,
      }}
    >
      <span
        className="text-xs relative font-bold"
        style={
          type === "smaller"
            ? {
                fontSize: "10px",
                lineHeight: "0px",
              }
            : type === "small"
            ? {
                fontSize: "11px",
                lineHeight: "0px",
              }
            : {}
        }
      >
        {text}
      </span>
    </div>
  );

  return showTooltip ? (
    <div className="rarity">
      <Tooltip
        content={
          <div className="whitespace-nowrap">
            <span className="text-xs">{`${order} / ${nftsInCollection}`}</span>
          </div>
        }
      >
        {content}
      </Tooltip>
    </div>
  ) : (
    <div className="rarity">{content}</div>
  );
};
