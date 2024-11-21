import { UTxO } from "lucid-cardano";
import { Info } from "lucide-react";
import React from "react";
import { useCookies } from "react-cookie";
import { colors } from "../../constants/colors";
import { config } from "../../constants/config";
import { tradeErrorMessages } from "../../constants/errors";
import { getExplorerUrl } from "../../constants/urls";
import { useTradeState } from "../../hooks/trade/useTradeState";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { translateAffiliateLink } from "../../services/wallet";
import { useMyAffiliateLink } from "../../stores/wallet/useMyAffiliateLink";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftInfo, NftOffer } from "../../types/nft";
import { calculatePortions } from "../../utils/calculatePortions";
import { getRoyalty } from "../../utils/nft/nft";
import Checkbox from "../global/Checkbox";
import { Tooltip } from "../global/Tooltip";
import { SelectNftList } from "../nft/SelectNftList";
import { ModalBase } from "./ModalBase";
import { TradeFlow } from "./TradeFlow";

type Props = {
  offer?: NftOffer;
  onClose: () => void;
};

export const AcceptOfferModalContent = (props: Props) => {
  const { job, address } = useWalletStore();
  const { offer, onClose } = props;
  const [contractUtxo, setContractUtxo] = React.useState<UTxO | undefined>(
    undefined
  );
  const [txId, setTxId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [utxoStatus, setUtxoStatus] = React.useState<0 | 1 | 2 | 3>();
  const [force, setForce] = React.useState(false);
  const [assetInfo, setAssetInfo] = React.useState<NftInfo | undefined>(
    undefined
  );
  const tradeState = useTradeState();
  const { setStep, setError } = tradeState;
  const { addPendingTrade } = usePendingTrades();
  const { userLinks } = useMyAffiliateLink();
  let affilTreasury: string | undefined = undefined;
  let subAffilTreasury: string | undefined = undefined;
  const [cookies] = useCookies(["affil"]);

  React.useEffect(() => {
    async function lockContractTimer() {
      if (!offer || !job) return;

      if (!contractUtxo) {
        const [utxo] = await job?.lucid.utxosByOutRef([
          {
            txHash: offer!.listingTxHash,
            outputIndex: offer!.listingUtxoIndex,
          },
        ]);
        setContractUtxo(utxo);
      }

      const status = await job?.lockContractUtxo(contractUtxo!);
      setUtxoStatus(status);
    }

    const intervalId = setInterval(lockContractTimer, 1000);
    return () => clearInterval(intervalId);
  }, [job, offer, contractUtxo]);

  if (!offer) return null;

  if (!offer.nft && !assetInfo) {
    return (
      <SelectNftList
        title="Accept offer"
        policyId={offer.collection.policyIds[0]}
        onSelect={setAssetInfo}
        onClose={onClose}
      />
    );
  }

  const royalty = getRoyalty(offer.collection);
  let txHash: string = "";

  const handleAcceptOffer = async () => {
    if (offer === undefined || !job || !address) return;

    if (
      cookies.affil &&
      !userLinks.some((link) => link.link === cookies.affil)
    ) {
      (async () => {
        const res = await translateAffiliateLink(cookies.affil, true);
        if (res.errorCode === 0) {
          affilTreasury = res.treasury.toLowerCase();
          subAffilTreasury = res.parentTreasury?.toLowerCase();
        }
      })();
    }

    try {
      setLoading(true);

      const tokenName = offer.nft?.assetNameHex || assetInfo?.assetNameHex;
      if (!tokenName) throw new Error("Token name is not defined!");

      txHash = await job.offerProceed(
        { txHash: offer.listingTxHash, outputIndex: offer.listingUtxoIndex },
        (offer.nft?.policyId || offer.collection.policyIds[0]) + tokenName,
        force,
        ...calculatePortions(job.treasuryDatum, affilTreasury, subAffilTreasury)
      );

      //   trackPurchase("offer_accept");
      addPendingTrade("acceptOfferPending", txHash, address);
      setTxId(txHash);
      setStep("success");
    } catch (e: any) {
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
      Your sale of <span>{offer.nft?.displayName || ""}</span> was successfully
      submitted to the network.
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
        title="Accept offer"
        onClose={onClose}
        showFeeInfo
        summaryTemplateType="sell"
        script={config.instantBuyScript}
        priceInLovelace={offer.price}
        royaltyPercentage={royalty?.royaltyPercentage}
        button={{
          onClick: handleAcceptOffer,
          label: "Accept offer",
          disabled: (utxoStatus === 1 || utxoStatus === 2) && !force,
        }}
        loading={loading || utxoStatus === undefined}
        offer={offer}
      >
        <div className="flex flex-col text-center gap-[5px]">
          {utxoStatus === 1 ||
            (utxoStatus === 2 && (
              <div className="w-full flex justify-between items-center ml-auto mt-3 px-4">
                <p className="text-redText font-medium">No UTXOs available</p>
                <span className="flex items-center">
                  <Tooltip
                    content={
                      <span className="text-[13px] w-[250px]">
                        You can either wait for UTXO to become available or open
                        a new UTXOs for your transaction. <br />
                        <br />
                        New UTXOs are unrefundable and available to other users
                        for future use making the JamOnBread solution more
                        robust.
                      </span>
                    }
                  >
                    <Info size={18} color={colors.text} />
                  </Tooltip>
                  <p className="mx-2">Priority line</p>
                  <Checkbox
                    onCheckboxChange={() => setForce(!force)}
                    isChecked={force}
                  />
                </span>
              </div>
            ))}
        </div>
      </ModalBase>
    </TradeFlow>
  );
};
