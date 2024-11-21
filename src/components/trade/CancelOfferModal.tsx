import React from "react";
import { tradeErrorMessages } from "../../constants/errors";
import { useTradeState } from "../../hooks/trade/useTradeState";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftOffer } from "../../types/nft";
import { TradeFlow } from "./TradeFlow";
import { getExplorerUrl } from "../../constants/urls";
import { ModalBase } from "./ModalBase";

type Props = {
  offer?: NftOffer;
  onClose: () => void;
};

export const CancelOfferModalContent = (props: Props) => {
  const { job, address } = useWalletStore();
  const { offer, onClose } = props;
  const [txId, setTxId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const tradeState = useTradeState();
  const { setStep, setError } = tradeState;
  const { addPendingTrade } = usePendingTrades();

  if (!offer) return null;

  const handleCancelOffer = async () => {
    if (offer === undefined || !job || !address) return;
    try {
      setLoading(true);

      const txHash = await job.offerCancel({
        txHash: offer.listingTxHash,
        outputIndex: offer.listingUtxoIndex,
      });

      //   trackPurchase("offer_cancel");
      addPendingTrade("cancelOfferPending", txHash, address);
      setTxId(txHash);
      setStep("success");
    } catch (e: any) {
      console.error(e);
      if (!Object.keys(tradeErrorMessages).includes(e.message)) {
        console.error(e);
      }
      setError(e.info ?? e.message ?? e);
    } finally {
      setLoading(false);
    }
  };

  const successText = (
    <span>
      Cancelling your offer for{" "}
      <span>
        {offer.nft?.displayName || offer.collection.displayName || ""}
      </span>{" "}
      has been successfully submitted to the network.
    </span>
  );

  return (
    <TradeFlow
      tradeState={tradeState}
      onClose={onClose}
      successText={successText}
      successInfoMessage="It may take a few minutes for your blockchain confirmation to appear."
      explorerUrl={getExplorerUrl("transaction", txId)}
      successActionLabel="return back"
    >
      <ModalBase
        title="Cancel offer"
        onClose={onClose}
        button={{ onClick: handleCancelOffer, label: "Cancel offer" }}
        loading={loading}
        summaryTemplateType="cancel"
        offer={offer}
        message="Do you really want to cancel your offer?"
      />
    </TradeFlow>
  );
};
