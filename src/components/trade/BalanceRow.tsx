import React from "react";
import { lovelaceToAda, useFormatPrice } from "../../utils/format";

export const BalanceRow: React.FC<{
  lovelace: number | undefined;
  style?: React.CSSProperties;
  theme?: "dark" | "light" | "dimmed" | "blue" | undefined;
}> = (props) => {
  const formatPrice = useFormatPrice();
  return (
    <div className="flex text-text justify-between items-center bg-background border border-border p-[15px] rounded-[15px]">
      <span>Your balance</span>
      <div className="flex flex-col items-end">
        <span className="font-medium">{lovelaceToAda(props.lovelace)}</span>
        <span className="text-[13px]">{formatPrice(props.lovelace)}</span>
      </div>
    </div>
  );
};
