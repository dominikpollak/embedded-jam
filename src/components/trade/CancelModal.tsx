import React from "react";
import { useTradeState } from "../../hooks/trade/useTradeState";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftListingResponse } from "../../types/nft";
import { TradeFlow } from "./TradeFlow";
import { getExplorerUrl } from "../../constants/urls";
import { ModalBase } from "./ModalBase";

type Props = {
  nftListing?: NftListingResponse;
  onClose: () => void;
};

export const CancelModalContent = (props: Props) => {
  const { job, address } = useWalletStore();
  const { addPendingTrade } = usePendingTrades();
  const { nftListing, onClose } = props;
  const [txId, setTxId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const tradeState = useTradeState();
  const { setStep, setError } = tradeState;

  if (!nftListing) return null;

  const handleCancel = async () => {
    if (!address || !job) {
      return;
    }
    try {
      setLoading(true);

      const lucid = job.lucid;

      const utxo = await lucid.utxoByUnit(
        nftListing.policyId + nftListing.assetNameHex
      );
      const txHash = await job.instantBuyCancel(utxo);
      setTxId(txHash);

      //   trackPurchase("list_cancel");
      addPendingTrade("cancelList", txHash, address);
      setTxId(txHash);
      setStep("success");
    } catch (e: any) {
      setError(e.info ?? e.message ?? e);
    } finally {
      setLoading(false);
    }
  };

  const successText = (
    <span>
      The transaction for unlisting <span> {nftListing.displayName}</span> has
      been successfully submitted to the network.
    </span>
  );

  return (
    <TradeFlow
      tradeState={tradeState}
      onClose={onClose}
      successText={successText}
      successInfoMessage="Once the transaction is confirmed, the cancellation
      will be done. If the transaction fails, you will not lose any funds."
      explorerUrl={getExplorerUrl("transaction", txId)}
    >
      <ModalBase
        title="List cancel"
        onClose={onClose}
        button={{ onClick: handleCancel, label: "Cancel listing" }}
        loading={loading}
        summaryTemplateType="cancel"
        nftListings={[nftListing]}
      />
      {/* <InfoText>
          <H4 style={{ marginBottom: "15px" }}>Cancel listing</H4>
          <Body2>
            Do you really want to remove your item from sale? You can list it
            back anytime
          </Body2>
        </InfoText> */}
    </TradeFlow>
  );
};
