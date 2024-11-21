import { Portion } from "@jamonbread/sdk";
import React from "react";
import { useCookies } from "react-cookie";
import { config } from "../../constants/config";
import { MIN_LISTING_PRICE_ADA } from "../../constants/nft";
import { getExplorerUrl } from "../../constants/urls";
import { useTradeState } from "../../hooks/trade/useTradeState";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { translateAffiliateLink } from "../../services/wallet";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftListData } from "../../types/nft";
import {
  adaToLovelace,
  lovelaceToAda,
  lovelaceToAdaWithoutSuffix,
} from "../../utils/format";
import { getRoyalty } from "../../utils/nft/nft";
import { usePriceState } from "../global/inputs/PriceInput";
import { ModalBase } from "./ModalBase";
import { TradeFlow } from "./TradeFlow";

type Props = {
  onClose: () => void;
  nftListing?: NftListData;
};

export const ListModalContent = (props: Props) => {
  const { job, address } = useWalletStore();
  const { addPendingTrade } = usePendingTrades();
  const { nftListing, onClose } = props;
  const [txId, setTxId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const priceState = usePriceState();
  const { price, setPriceError } = priceState;
  const tradeState = useTradeState();
  const { setStep, setError } = tradeState;
  const [cookies] = useCookies(["affil"]);

  const priceInLovelace = adaToLovelace(price ? Number(price) : 0);

  if (!nftListing || !nftListing.collection) return null;

  const royalty = getRoyalty(nftListing.collection);

  const handleList = async () => {
    if (!address || !job) return;

    if (lovelaceToAdaWithoutSuffix(priceInLovelace) < MIN_LISTING_PRICE_ADA) {
      setPriceError(
        `Listing price must be at least ${MIN_LISTING_PRICE_ADA} ADA`
      );
      return;
    }
    setLoading(true);

    const royalties: Portion | undefined = royalty
      ? {
          treasury: job.addressToDatum(royalty.royaltyAddressStr),
          percent: royalty.royaltyPercentage,
        }
      : undefined;

    try {
      let txHash = "";
      let affiliate = undefined;

      if (cookies.affil && address) {
        const res = await translateAffiliateLink(cookies.affil, true);
        if (res.errorCode === 0) affiliate = res.treasury.toLowerCase();
      }

      txHash = await job.instantBuyList(
        nftListing.policyId + nftListing.assetNameHex,
        BigInt(priceInLovelace),
        undefined,
        affiliate,
        royalties
      );

      //   trackPurchase("list");
      addPendingTrade("listPending", txHash, address);
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
      You successfully submitted a listing of{" "}
      <span>{nftListing.displayName}</span> for{" "}
      <span>{lovelaceToAda(price || 0)}</span> was successfully submitted to the
      blockchain.
    </span>
  );

  return (
    <>
      <TradeFlow
        tradeState={tradeState}
        onClose={onClose}
        successText={successText}
        successInfoMessage="Once
      the transaction is confirmed, your trade will be done. If the transaction fails, you will not lose any funds."
        explorerUrl={getExplorerUrl("transaction", txId)}
      >
        <ModalBase
          title="List NFT"
          onClose={onClose}
          button={{ onClick: handleList, label: "List NFT" }}
          loading={loading}
          summaryTemplateType="sell"
          showDepositInfo
          showFeeInfo
          nftListings={[nftListing]}
          priceState={priceState}
          priceInLovelace={priceInLovelace}
          script={config.instantBuyScript}
          royaltyPercentage={royalty?.royaltyPercentage}
        />
      </TradeFlow>
    </>
  );
};
