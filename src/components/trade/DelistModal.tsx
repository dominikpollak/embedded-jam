import { Data, UTxO } from "lucid-cardano";
import React from "react";
import { getExplorerUrl } from "../../constants/urls";
import { useTradeState } from "../../hooks/trade/useTradeState";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { ExtendedNftToken } from "../../types/nft";
import { ModalBase } from "./ModalBase";
import { ModalItemRow } from "./ModalItemRow";
import { TradeFlow } from "./TradeFlow";

type Props = {
  onClose: () => void;
  selectedItems: ExtendedNftToken[];
};

const DelistModalContent = ({ onClose, selectedItems }: Props) => {
  const tradeState = useTradeState();
  const { addPendingTrade } = usePendingTrades();
  const { setStep, setError } = tradeState;
  const [loading, setLoading] = React.useState(false);
  const [txId, setTxId] = React.useState<string | undefined>(undefined);
  const { job, address } = useWalletStore();
  const [inputError, setInputError] = React.useState<"maxCount" | undefined>(
    undefined
  );

  const handleDelist = async () => {
    const lucid = job?.lucid;

    if (!lucid || !address) return;

    const scriptValidator = await lucid.utxosByOutRef([
      {
        txHash:
          "9a32459bd4ef6bbafdeb8cf3b909d0e3e2ec806e4cc6268529280b0fc1d06f5b",
        outputIndex: 0,
      },
    ]);

    const nfts: UTxO[] = [];

    try {
      setLoading(true);
      selectedItems.forEach(async (item) => {
        nfts.push(await lucid.utxoByUnit(item.policyId + item.assetNameHex));
      });

      const tx = await lucid
        .newTx()
        .readFrom(scriptValidator)
        .collectFrom(nfts, Data.void())
        .addSigner(await lucid.wallet.address())
        .complete();
      const completeTx = await tx.sign().complete();
      const txHash = await completeTx.submit();
      addPendingTrade("delistPending", txHash, address);
      setTxId(txHash);
      setStep("success");
    } catch (e: any) {
      setError(e.info ?? e.message ?? e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (selectedItems.length > 10) {
      setInputError("maxCount");
      return;
    }
    setInputError(undefined);
  }, [selectedItems.length]);

  const successText = (
    <span>
      The transaction for unlisting{" "}
      <span>
        {selectedItems.map((item, index) => (
          <span key={index}>{item.displayName}</span>
        ))}
      </span>{" "}
      has been successfully submitted to the network.
    </span>
  );

  return (
    <TradeFlow
      tradeState={tradeState}
      onClose={onClose}
      successText={successText}
      successInfoMessage="Once the transaction is confirmed, your
  trade will be done. If the transaction fails, you will not lose any funds."
      explorerUrl={getExplorerUrl("transaction", txId)}
    >
      <ModalBase
        title="Bulk delist"
        onClose={onClose}
        summaryTemplateType="cancel"
        button={{
          onClick: handleDelist,
          label: "Delist NFTs",
          disabled: inputError === "maxCount",
        }}
        loading={loading}
        message="All selected NFTs will be delisted. You can list them back at any
        time."
      >
        <div className="flex flex-col gap-[5px]">
          {selectedItems.length === 0 && (
            <p className="text-[16px] font-medium mt-[20%] text-center text-text">
              None of the selected NFTs are listed.
            </p>
          )}
          {selectedItems.length > 0 &&
            selectedItems.map((item) => (
              <ModalItemRow key={item.assetFingerprint} nftListing={item} />
            ))}
        </div>

        {inputError && (
          <span className="w-full text-redText text-center">
            {inputError === "maxCount" &&
              "You can't delist more than 10 NFTs at once."}
          </span>
        )}
      </ModalBase>
    </TradeFlow>
  );
};

export default DelistModalContent;
