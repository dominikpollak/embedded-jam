import React from "react";
import { urls } from "../../constants/urls";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useTradeModals } from "../../hooks/wallet/useTradeModals";
import { useOpenConnectWalletModal } from "../../stores/states/useOpenConnectWalletModal";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftListData, NftToken } from "../../types/nft";
import {
  cropString,
  lovelaceToAda,
  useFormatFullPrice,
} from "../../utils/format";
import {
  generateImgLinkingUrl,
  getAssetFingerprint,
  Optional,
} from "../../utils/nft/nft";
import { translatePunycode } from "../../utils/nft/translatePunycode";
import TxErrorModal from "../tx/TxErrorModal";
import { NftThumbnail } from "./NftThumbnail";
import { RarityBadge } from "./RarityBadge";

type Props = Optional<NftToken, "collection">;

export const GridNftItem: React.FC<Props> = ({
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

      <section className="group relative grid-cols-1 w-full h-full pb-3 border-b border-border grid hover:border-text">
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
          className="relative w-full flex gap-4 flex-col col-span-2 items-start"
        >
          <div
            className={`relative w-full h-full ${
              sellOrder?.source === "jam" ? "jam" : ""
            }`}
          >
            {/* TODO */}

            {/* <ScTooltipIcon
              source={sellOrder?.source}
              displayFormat="tab"
              imageLoaded={imageLoaded}
            /> */}
            {!disableBuyNow && (
              <button
                className="hidden group-hover:flex group-hover:justify-center absolute rounded-[150px] max-w-[70%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent text-white border-2 border-white cursor-pointer transition-all duration-200 z-[25] hover:bg-white hover:text-black"
                onClick={handleTransaction}
              >
                <span className="uppercase font-bold whitespace-nowrap block rounded-[10%] py-[10px] px-[25px] text-[14px]">
                  {renderTransactionButton()}
                </span>
              </button>
            )}
            <NftThumbnail
              lazy
              className={`flex aspect-square w-full h-full object-cover rounded-[10%] ${
                disableBuyNow
                  ? ""
                  : "group-hover:brightness-[30%] transition-filter duration-150"
              }`}
              width={130}
              height={130}
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
            className={`font-bold text-[14px] leading-[19px] h-[50px] ${
              displayName.split(" ").length === 1
                ? "w-full overflow-hidden text-ellipsis whitespace-nowrap"
                : ""
            }`}
          >
            {cropString(formattedDisplayName, 48)}
          </span>
        </a>

        {/* COLLECTION */}
        <div className="flex flex-col justify-start w-full gap-[1px]">
          <span
            className={`nft-name text-text text-[13px] leading-[16px] ${
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
              {collection?.displayName}
            </a>
          </span>

          {/* RARITY */}
          {rarity && (
            <RarityBadge
              percentage={rarity.percentage}
              nftsInCollection={collection?.nftsInCirculation || 0}
              order={rarity.order}
              type="small"
            />
          )}
        </div>

        <span className="price flex w-full flex-col text-text text-right order-1 grid-row-span-2 ml-auto">
          {/* PRICE IN ADA */}
          {sellOrder && (
            <span className="text-[14px] leading-[20px] font-bold mb-0">
              {lovelaceToAda(sellOrder.price)}
            </span>
          )}
          {/* PRICE IN DOLLARS */}
          {sellOrder && (
            <span className="text-grayText text-[12px] leading-[15px]">
              {formatPrice(sellOrder.price)}
            </span>
          )}
        </span>
      </section>
    </>
  );
};
