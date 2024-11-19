import { ContractType } from "@jamonbread/sdk";
import { UTxO } from "lucid-cardano";
import { Info } from "lucide-react";
import React from "react";
import { useCookies } from "react-cookie";
import { colors } from "../../constants/colors";
import { config } from "../../constants/config";
import { getExplorerUrl } from "../../constants/urls";
import { useTradeState } from "../../hooks/trade/useTradeState";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { translateAffiliateLink } from "../../services/wallet";
import { useOpenConnectWalletModal } from "../../stores/states/useOpenConnectWalletModal";
import { useMyAffiliateLink } from "../../stores/wallet/useMyAffiliateLink";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftListData } from "../../types/nft";
import { calculatePortions } from "../../utils/calculatePortions";
import { lovelaceToAda } from "../../utils/format";
import Checkbox from "../global/Checkbox";
import { Message } from "../global/Message";
import { Tooltip } from "../global/Tooltip";
import { ModalBase } from "./ModalBase";
import { TradeFlow } from "./TradeFlow";

type Props = {
  onClose: () => void;
  nftListing?: NftListData;
};

export const BuyModalContent = (props: Props) => {
  const { job, address } = useWalletStore();
  const { addPendingTrade } = usePendingTrades();
  const { nftListing, onClose } = props;
  const [contractUtxo, setContractUtxo] = React.useState<UTxO | undefined>(
    undefined
  );
  const [txId, setTxId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [force, setForce] = React.useState(false);
  const tradeState = useTradeState();
  const { setOpenConnectWalletModal } = useOpenConnectWalletModal();
  const { setStep, setError } = tradeState;
  const [cookies] = useCookies(["affil"]);
  const { userLinks } = useMyAffiliateLink();
  const [utxoStatus, setUtxoStatus] = React.useState<0 | 1 | 2 | 3>();
  let affilTreasury: string | undefined = undefined;
  let subAffilTreasury: string | undefined = undefined;

  React.useEffect(() => {
    async function lockContractTimer() {
      if (!nftListing || !job) return;
      if (!contractUtxo && nftListing.sellOrder?.source === "jam") {
        const utxo = await job.lucid.utxoByUnit(
          nftListing?.policyId + nftListing?.assetNameHex
        );
        setContractUtxo(utxo);
      }
      if (contractUtxo) {
        const status = await job?.lockContractUtxo(contractUtxo!);
        setUtxoStatus(status);
      }
    }

    const intervalId = setInterval(lockContractTimer, 1000);
    return () => clearInterval(intervalId);
  }, [job, nftListing, contractUtxo]);

  if (!nftListing || !nftListing.sellOrder) {
    return null;
  }

  const { sellOrder } = nftListing;

  const handleBuy = async () => {
    if (address === undefined || !job) {
      setOpenConnectWalletModal(true);
      onClose();
      return;
    }

    try {
      setLoading(true);

      const lucid = job.lucid;

      const utxo = await lucid.utxoByUnit(
        nftListing.policyId + nftListing.assetNameHex
      );
      let txHash = "";
      const contract = job.context.getContractByAddress(utxo.address);

      if (
        contract.type == ContractType.JobInstantBuy &&
        cookies.affil &&
        address &&
        !userLinks.some((link) => link.link === cookies.affil)
      ) {
        const affil = cookies.affil;
        (async () => {
          const res = await translateAffiliateLink(affil, true);
          if (res.errorCode === 0) {
            affilTreasury = res.treasury.toLowerCase();
            subAffilTreasury = res.parentTreasury?.toLowerCase();
          }
        })();
      }

      switch (contract.type) {
        case ContractType.JobInstantBuy:
          txHash = await job.instantBuyProceed(
            utxo,
            force,
            ...calculatePortions(
              job.treasuryDatum,
              affilTreasury,
              subAffilTreasury
            )
          );
          break;

        case ContractType.JPG:
          txHash = await job.instantBuyProceed(utxo);
          break;

        default:
          throw new Error("unsupported script");
      }
      addPendingTrade("buyPending", txHash, address);
      //   trackPurchase("buy");
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
      Your buy of{" "}
      <span>
        {/* <Link href={urls.assetDetail(nftListing.assetFingerprint || "")}> */}
        {nftListing.displayName}
        {/* </Link> */}
      </span>{" "}
      for <span>{lovelaceToAda(sellOrder.price)}</span> was successfully
      submitted to the blockchain.
    </span>
  );

  return (
    <>
      <TradeFlow
        tradeState={tradeState}
        onClose={onClose}
        successText={successText}
        successInfoMessage="Once the transaction is confirmed, your
      trade will be done. If the transaction fails, you will not lose any funds."
        explorerUrl={getExplorerUrl("transaction", txId)}
      >
        <ModalBase
          message={
            <Message
              text="Warning: Price of the NFT may not be correct, please check the
          wallet summary before completing the transaction."
              type="warning"
            />
          }
          title="Buy NFT"
          onClose={onClose}
          script={config.instantBuyScript}
          summaryTemplateType="buy"
          showFeeInfo
          button={{
            onClick: handleBuy,
            label: "Buy NFT",
            disabled: (utxoStatus === 1 || utxoStatus === 2) && !force,
          }}
          nftListings={[nftListing]}
          priceInLovelace={nftListing.sellOrder.price}
          loading={
            loading ||
            (utxoStatus === undefined && nftListing.sellOrder.source === "jam")
          }
        >
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
        </ModalBase>
      </TradeFlow>
    </>
  );
};
