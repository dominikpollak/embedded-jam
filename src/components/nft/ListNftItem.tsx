import React from "react";
import { urls } from "../../constants/urls";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useTradeModals } from "../../hooks/wallet/useTradeModals";
import { useOpenConnectWalletModal } from "../../stores/states/useOpenConnectWalletModal";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftListData, NftToken } from "../../types/nft";
import {
  formatHash,
  lovelaceToAda,
  useFormatFullPrice,
} from "../../utils/format";
import {
  generateImgLinkingUrl,
  getAssetFingerprint,
  Optional,
} from "../../utils/nft/nft";
import { translatePunycode } from "../../utils/nft/translatePunycode";
import Button from "../global/Button";
import TxErrorModal from "../tx/TxErrorModal";
import { NftThumbnail } from "./NftThumbnail";
import { RarityBadge } from "./RarityBadge";

type Props = Optional<NftToken, "collection"> & { isFilterOpen?: boolean };

export const ListNftItem: React.FC<Props> = ({
  displayName,
  collection,
  policyId,
  assetNameHex,
  hideCollectionName,
  sellOrder,
  rarity,
  disableBuyNow,
  owner,
  owned = false,
  isFilterOpen,
}) => {
  const affilCode = window.location.search.split("a=")[1];
  const { setOpenConnectWalletModal } = useOpenConnectWalletModal();
  const { address, walletType } = useWalletStore();
  const { pendingTrades } = usePendingTrades();
  const [openWarningModal, setOpenWarningModal] = React.useState(false);
  //may need this
  //   const [imageLoaded, setImageLoaded] = React.useState(false);
  const [listing, setListing] = React.useState<NftListData | undefined>(
    undefined
  );
  const { content, setOpenTradeModal } = useTradeModals({
    nftListing: listing,
  });

  React.useEffect(() => {
    setListing({
      assetNameHex,
      displayName,
      rarity: rarity,
      policyId,
      collection,
      sellOrder,
      assetFingerprint: getAssetFingerprint({
        policyId,
        assetName: assetNameHex,
      }),
    });
  }, []);

  const isListedByMe = sellOrder?.listedByAddress === address;

  const renderTransactionButton = (isSecondaryTx?: boolean) => {
    switch (true) {
      case sellOrder && isListedByMe:
        return isSecondaryTx ? "Cancel" : "Update";
      case sellOrder && !isListedByMe:
        return isSecondaryTx ? "Offer" : "Buy";
      case owned || owner?.address === address:
        return isSecondaryTx ? null : "List";
      default:
        return isSecondaryTx ? null : "Offer";
    }
  };

  const handleTransaction = async (e: any, isSecondaryTx?: boolean) => {
    e.stopPropagation();
    e.preventDefault();

    if (!address || !walletType) {
      setOpenConnectWalletModal(true);
      return;
    }

    if (
      Object.keys(pendingTrades).length > 0 &&
      pendingTrades[0].address === address
    ) {
      if (openWarningModal) {
        if (modalRef.current) {
          modalRef.current.classList.add("shake");
          setTimeout(() => {
            modalRef.current?.classList.remove("shake");
          }, 500);
        }
      }
      setOpenWarningModal(true);
      return;
    }

    setOpenWarningModal(false);

    switch (true) {
      case sellOrder && isListedByMe:
        return setOpenTradeModal(!isSecondaryTx ? "update" : "cancel");
      case sellOrder && !isListedByMe:
        return setOpenTradeModal(!isSecondaryTx ? "buy" : "makeOffer");
      case owned:
        return setOpenTradeModal("list");
      default:
        return setOpenTradeModal("makeOffer");
    }
  };

  const formatPrice = useFormatFullPrice();
  const collectionName = collection?.name;
  const modalRef = React.useRef<HTMLDivElement>(null);

  let formattedDisplayName = translatePunycode(displayName);

  return (
    <>
      {content}
      {openWarningModal && (
        <TxErrorModal
          txFunc={handleTransaction}
          setOpenWarningModal={setOpenWarningModal}
        />
      )}
      <section
        className={`group grid items-center grid-cols-4 xl:grid-cols-5 p-[15px] pr-0 border-b border-border ${
          isFilterOpen ? "lg:grid-cols-5" : "md:grid-cols-5 lg:grid-cols-6"
        }`}
      >
        {/* IMAGE */}
        <a
          href={
            urls.assetDetail(
              getAssetFingerprint({
                policyId: policyId,
                assetName: assetNameHex,
              })
            ) + `${affilCode ? `?a=${affilCode}` : ""}`
          }
          className="relative xl:col-span-1 w-full flex items-center gap-4 col-span-2"
        >
          <div
            className={`relative shrink-0 w-[45px] h-[45px] ${
              sellOrder?.source === "jam" ? "jam" : ""
            }`}
          >
            {/* TODO */}

            {/* <ScTooltipIcon
              source={sellOrder?.source}
              displayFormat="tab"
              imageLoaded={imageLoaded}
            /> */}
            <NftThumbnail
              lazy
              className={`flex aspect-square w-[45px] h-[45px] shrink-0 object-cover rounded-[20%] ${
                disableBuyNow ? "" : ""
              }`}
              width={45}
              height={45}
              src={generateImgLinkingUrl(
                getAssetFingerprint({
                  policyId: policyId,
                  assetName: assetNameHex,
                }),
                "md"
              )}
            />
          </div>

          {/* NAME */}
          <span
            className={`font-bold text-[14px] whitespace-nowrap overflow-hidden block text-ellipsis md:text-[16px] leading-[25px] `}
          >
            {formattedDisplayName}
          </span>
        </a>

        {/* COLLECTION */}
        <span
          className={`nft-name hidden lg:block text-text text-[15px] ${
            isFilterOpen ? "lg:hidden xl:block" : "lg:block"
          } ${
            disableBuyNow
              ? "w-full overflow-hidden text-ellipsis whitespace-nowrap"
              : ""
          } ${hideCollectionName ? "hidden" : ""}`}
          title={collection?.displayName}
        >
          <a
            href={
              urls.collectionDetail(collectionName || "") +
              `${affilCode ? `?a=${affilCode}` : ""}`
            }
          >
            {hideCollectionName
              ? formatHash(owner?.address, "normal") || ""
              : collection?.displayName}
          </a>
        </span>

        {/* RARITY */}
        {rarity ? (
          <RarityBadge
            percentage={rarity.percentage}
            nftsInCollection={collection?.nftsInCirculation || 0}
            order={rarity.order}
            className={`w-fit hidden ${
              isFilterOpen ? "md:hidden" : "md:block"
            } lg:block`}
          />
        ) : (
          <div className="h-[30px]" />
        )}

        <span className="price flex w-full justify-start flex-col text-text text-right">
          {/* PRICE IN ADA */}
          {sellOrder && (
            <span className="text-[14px] md:text-[16px] text-left leading-6 font-bold mb-0">
              {lovelaceToAda(sellOrder.price)}
            </span>
          )}
          {/* PRICE IN DOLLARS */}
          {sellOrder && (
            <span className="text-grayText text-[12px] leading-4 text-left">
              {formatPrice(sellOrder.price)}
            </span>
          )}
        </span>

        <div className="flex justify-end items-center ml-auto gap-[10px] w-[60px] mr-[15px]">
          <Button
            label={renderTransactionButton()}
            size="md"
            variant="primary"
            onClick={handleTransaction}
            className="white-space-nowrap w-[90px] h-full py-[5px] px-[20px]"
          />
          {renderTransactionButton(true) && (
            <Button
              label={renderTransactionButton(true)}
              size="md"
              variant="secondary"
              onClick={(e) => handleTransaction(e, true)}
              className={`hidden white-space-nowrap w-[90px] h-full py-[5px] px-[20px] ${
                isFilterOpen ? "lg:block" : "md:block"
              }`}
            />
          )}
        </div>
      </section>
    </>
  );
};
