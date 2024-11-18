import { Bolt } from "lucide-react";
import React from "react";
import { colors } from "../../constants/colors";
import { NftOffer } from "../../types/nft";
import { TradeModal, TradeModalData } from "../../types/trade";
import { lovelaceToAda } from "../../utils/format";
import Button from "../global/Button";

interface Props {
  offer: NftOffer;
  view: "grid" | "tab" | "list";
  setOpenTradeModal:
    | ((modal: TradeModal | null, extraData: TradeModalData) => void)
    | undefined;
}

const InstantSellCard: React.FC<Props> = ({
  offer,
  view,
  setOpenTradeModal,
}) => {
  if (!setOpenTradeModal) return null;

  if (view === "tab") {
    return (
      <div className="min-h-[250px] rounded-lg flex flex-col items-center justify-between border border-border bg-background text-text p-4 md:py-7 md:px-4 relative z-1 min-w-[135px]">
        <h3 style={{ fontSize: "22px" }}>Instant Sell</h3>
        <Bolt height={100} width={100} />
        <span className="font-medium">{lovelaceToAda(offer?.price)}</span>
        <Button
          onClick={() => {
            setOpenTradeModal("acceptOffer", { offer: offer });
          }}
          size="sm"
          variant="primary"
          label="Sell now"
        />
      </div>
    );
  } else if (view === "grid") {
    return (
      <div className="min-h-[250px] rounded-lg flex flex-col items-center justify-between border border-border bg-background text-text p-4 md:py-7 md:px-4 relative z-1 min-w-[135px]">
        <h3>Instant Sell</h3>
        <Bolt width={60} />
        <span className="font-medium">{lovelaceToAda(offer?.price)}</span>
        <Button
          onClick={() => {
            setOpenTradeModal("acceptOffer", { offer: offer });
          }}
          size="sm"
          variant="primary"
          label="Sell now"
        />
      </div>
    );
  } else if (view === "list") {
    return (
      <div className="relative z-1 flex gap-3 justify-center items-center border border-border rounded-lg mb-4 bg-background text-text">
        <Bolt size={30} color={colors.text} />
        <span className="font-medium">{lovelaceToAda(offer?.price)}</span>
        <Button size="sm" variant="primary" label="Sell now" />
      </div>
    );
  } else return null;
};

export default InstantSellCard;
