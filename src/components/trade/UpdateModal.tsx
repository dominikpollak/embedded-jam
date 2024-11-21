import React from "react";
import { config } from "../../constants/config";
import { MIN_LISTING_PRICE_ADA } from "../../constants/nft";
import { getExplorerUrl } from "../../constants/urls";
import { useTradeState } from "../../hooks/trade/useTradeState";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftListingResponse, RoyaltyInfo } from "../../types/nft";
import { adaToLovelace } from "../../utils/format";
import { usePriceState } from "../global/inputs/PriceInput";
import { ModalBase } from "./ModalBase";
import { TradeFlow } from "./TradeFlow";

type Props = {
  nftListing?: NftListingResponse;
  onClose: () => void;
};

export const UpdateModalContent = (props: Props) => {
  const { address, job } = useWalletStore();
  const { addPendingTrade } = usePendingTrades();
  const { nftListing, onClose } = props;
  const [txId, setTxId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const tradeState = useTradeState();
  const { setStep, setError } = tradeState;

  const priceState = usePriceState();
  const { price, setPriceError } = priceState;

  const priceInLovelace = adaToLovelace(price ? Number(price) : 0);

  if (!nftListing) return null;

  const royalty: RoyaltyInfo | undefined = nftListing?.sellOrder?.royalties
    ? {
        royaltyPercentage: nftListing?.sellOrder.royalties.rate,
        royaltyAddressStr: nftListing?.sellOrder.royalties.address,
      }
    : undefined;

  const handleUpdate = async () => {
    if (!job || !address) return;
    if (!price) {
      setPriceError(
        `Updated price must be at least ${MIN_LISTING_PRICE_ADA} ADA`
      );
      return;
    }

    try {
      setLoading(true);

      const unit = nftListing.policyId + nftListing.assetNameHex;
      const txHash = await job.instantBuyUpdate(unit, BigInt(priceInLovelace));

      //   trackPurchase("update");
      addPendingTrade("updatePending", txHash, address);

      setTxId(txHash);
      setStep("success");
    } catch (e: any) {
      console.error(e);
      setError(e.info ?? e.message ?? e);
    } finally {
      setLoading(false);
    }
  };

  const successText = (
    <span>
      The transaction for updating price of{" "}
      <span> {nftListing.displayName}</span> has been successfully submitted to
      the network.
    </span>
  );

  return (
    <TradeFlow
      tradeState={tradeState}
      onClose={onClose}
      successText={successText}
      successInfoMessage="Once the transaction is confirmed, the update
      will be done. If the transaction fails, you will not lose any funds."
      explorerUrl={getExplorerUrl("transaction", txId)}
    >
      <ModalBase
        title="Update price"
        onClose={onClose}
        button={{ onClick: handleUpdate, label: "Update price" }}
        loading={loading}
        summaryTemplateType="sell"
        nftListings={[nftListing]}
        script={config.instantBuyScript}
        showDepositInfo
        showFeeInfo
        priceState={priceState}
        priceInLovelace={priceInLovelace}
        royaltyPercentage={royalty?.royaltyPercentage}
      />
    </TradeFlow>
  );
};
