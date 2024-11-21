import { Portion } from "@jamonbread/sdk";
import React from "react";
import { useCookies } from "react-cookie";
import { MIN_LISTING_PRICE_ADA } from "../../constants/nft";
import { useTradeState } from "../../hooks/trade/useTradeState";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { translateAffiliateLink } from "../../services/wallet";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { CollectionDetailResponse } from "../../types/collection";
import { NftListData, NftListingResponse } from "../../types/nft";
import { adaToLovelace, lovelaceToAdaWithoutSuffix } from "../../utils/format";
import { getRoyalty } from "../../utils/nft/nft";
import { usePriceState } from "../global/inputs/PriceInput";
import { TradeFlow } from "./TradeFlow";
import { ModalBase } from "./ModalBase";
import { getExplorerUrl } from "../../constants/urls";
import { config } from "../../constants/config";

type Props = {
  nftListing?: NftListingResponse;
  collection?: CollectionDetailResponse;
  onClose: () => void;
};

export const MakeOfferModalContent = (props: Props) => {
  const { job, address } = useWalletStore();
  const { nftListing, collection, onClose } = props;
  const [txId, setTxId] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const { addPendingTrade } = usePendingTrades();
  const [cookies] = useCookies(["affil"]);

  const priceState = usePriceState();
  const { price, setPriceError } = priceState;

  const tradeState = useTradeState();
  const { setStep, setError } = tradeState;

  const priceInLovelace = adaToLovelace(price ? Number(price) : 0);

  const handleMakeOffer = async () => {
    if (!job || !address) return;

    if (lovelaceToAdaWithoutSuffix(priceInLovelace) < MIN_LISTING_PRICE_ADA) {
      setPriceError(
        `Offer price must be at least ${MIN_LISTING_PRICE_ADA} ADA`
      );
      return;
    }
    try {
      setLoading(true);

      let affiliate = undefined;

      if (cookies.affil && address) {
        const res = await translateAffiliateLink(cookies.affil, true);
        if (res.errorCode === 0) affiliate = res.treasury.toLowerCase();
      }

      if (nftListing) {
        const royalty = getRoyalty(nftListing.collection);
        const royalties: Portion | undefined = royalty
          ? {
              treasury: job.addressToDatum(royalty.royaltyAddressStr),
              percent: royalty.royaltyPercentage,
            }
          : undefined;

        const txHash = await job.offerList(
          {
            policyId: nftListing?.policyId,
            assetName: nftListing?.assetNameHex,
          },
          BigInt(priceInLovelace),
          undefined,
          affiliate,
          royalties
        );
        setTxId(txHash);
        // trackPurchase("offer");
        addPendingTrade("offerPending", txHash, address);
        setStep("success");
      } else if (collection) {
        const royalty = getRoyalty(collection);
        const royalties: Portion | undefined = royalty
          ? {
              treasury: job.addressToDatum(royalty.royaltyAddressStr),
              percent: royalty.royaltyPercentage,
            }
          : undefined;

        if (collection.policyIds.length !== 1) {
          throw new Error("Collection has more tham 1 policyIds");
        }
        const txHash = await job.offerList(
          { policyId: collection.policyIds[0], assetName: undefined },
          BigInt(priceInLovelace),
          undefined,
          affiliate,
          royalties
        );
        // trackPurchase("offer");
        addPendingTrade("offerPending", txHash, address);
        setTxId(txHash);
        setStep("success");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.info ?? e.message ?? e);
    } finally {
      setLoading(false);
    }
  };

  const successText = (
    <span>
      Your offer of <span>{Number(price)} ADA</span> for{" "}
      <span>{nftListing?.displayName || collection?.displayName}</span> was
      successfully submitted to the blockchain.
    </span>
  );

  return (
    <TradeFlow
      tradeState={tradeState}
      onClose={onClose}
      successText={successText}
      successInfoMessage="It may take a few minutes for your blockchain confirmation to appear."
      explorerUrl={getExplorerUrl("transaction", txId)}
      successActionLabel={collection ? "Back to collection detail" : undefined}
    >
      <ModalBase
        title={
          nftListing !== undefined ? "Make offer" : "Make collection offer"
        }
        onClose={onClose}
        button={{ onClick: handleMakeOffer, label: "Make offer" }}
        loading={loading}
        summaryTemplateType="offer"
        nftListings={[nftListing] as NftListData[]}
        collection={collection}
        priceInLovelace={priceInLovelace}
        royaltyPercentage={Number(nftListing?.collection.royaltiesRate)}
        priceState={priceState}
        script={config.offersScript}
        showDepositInfo
      />
    </TradeFlow>
  );
};
