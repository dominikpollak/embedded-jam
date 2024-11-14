import React from "react";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftListData, NftToken } from "../../types/nft";
import { useFormatFullPrice } from "../../utils/format";
import {
  generateImgLinkingUrl,
  getAssetFingerprint,
  Optional,
} from "../../utils/nft/nft";
import { translatePunycode } from "../../utils/nft/translatePunycode";
import TxErrorModal from "../tx/TxErrorModal";
import ConnectWalletModal from "../wallet/ConnectWalletModal";

const TransactionButtonText = styled.span`
  text-transform: uppercase;
  font-weight: 700;
  white-space: nowrap;
  display: block;
  border-radius: 10%;
  padding: 10px 25px;
  font-size: 14px;
`;
const ImageComponent = styled(NftThumbnail)`
  display: flex;
  aspect-ratio: 1 / 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10%;
`;

const Wrapper = styled.section<{ textcolor: string }>`
  position: relative;
  height: 100%;
  width: 100%;
  text-decoration: none;
  position: relative;
  padding-bottom: 10px;
  border-bottom: 1px solid ${colors.grey10};
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));

  &:hover {
    border-bottom: 1px solid ${colors.primary};
  }

  &:hover ${TransactionButton} {
    display: flex;
    justify-content: center;
  }

  &:hover ${ImageComponent} {
    filter: brightness(0.3);
    transition: filter 0.15s ease-out;
  }

  &.disabled {
    &:hover ${ImageComponent} {
      filter: none;
    }
  }
`;
const ItemBaseWrapper = styled(Link)<{ textcolor: string }>`
  position: relative;
  width: 100%;
  display: flex;
  gap: ${spacing.xs};
  flex-direction: column;
  grid-column: span 2 / span 2;
  align-items: flex-start;

  &:hover {
    & > span {
      color: ${(props) => props.textcolor};
    }
  }

  &.one-word-name {
    & > span {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const PriceWrapper = styled.span<{ textcolor: string }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  color: ${colors.grey40};
  font-size: 13px;
  order: 1;
  grid-row: span 2;
  text-align: right;
  margin-left: auto;

  & > span:first-of-type {
    font-size: 17px;
    line-height: 25px;
    font-weight: bold;
    margin-bottom: 0;
    color: ${(props) => props.textcolor || colors.text};
  }
  & > span:last-of-type {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
  }
`;

const DisplayName = styled(Body2Bold)`
  font-weight: 700;
  font-size: 18px;
  line-height: 25px;
  height: 55px;
`;

const CollectionName = styled.span<{ textcolor: string | undefined }>`
  line-height: 25px;
  font-weight: 500;
  color: ${(props) => props.textcolor};

  &.shorter {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: ${(props) => props.textcolor || colors.primary};
  }

  a {
    color: ${(props) => props.textcolor || colors.text};
    &:hover {
      color: ${(props) => props.textcolor || colors.primary};
    }
  }

  &.hide {
    display: none;
  }
`;

const ImageWrapper = styled.div<{ imageLoaded: boolean }>`
  position: relative;
  height: 100%;
  width: 100%;

  &.jam {
    &::before {
      content: "";
      opacity: ${(props) => (props.imageLoaded ? "1" : "0")};
      transition: opacity 0.3s ease-in-out;
      background: linear-gradient(
        90deg,
        rgb(255, 121, 19) 0%,
        rgba(228, 67, 31, 0.893) 50%,
        rgb(254, 121, 19) 100%
      );
      position: absolute;
      top: -2px;
      right: -2px;
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      border-radius: 10%;
      z-index: -1;
    }
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  width: 100%;
  gap: 1px;
`;

type Props = Optional<NftToken, "collection">;

const TabNftItem: React.FC<Props> = ({
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
  const [showConnectModal, setShowConnectModal] = React.useState(false);
  const { address, walletType } = useWalletStore();
  const { pendingTrades } = usePendingTrades();
  const [openWarningModal, setOpenWarningModal] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [listing, setListing] = React.useState<NftListData | undefined>(
    undefined
  );

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
    // eslint-disable-next-line
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
      setShowConnectModal(true);
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

    // switch (true) {
    //   case sellOrder && isListedByMe:
    //     return setOpenTradeModal(!isSecondaryTx ? "update" : "cancel");
    //   case sellOrder && !isListedByMe:
    //     return setOpenTradeModal(!isSecondaryTx ? "buy" : "makeOffer");
    //   case owned:
    //     return setOpenTradeModal("list");
    //   default:
    //     return setOpenTradeModal("makeOffer");
    // }
  };

  const formatPrice = useFormatFullPrice();
  const collectionName = collection?.name;
  const modalRef = React.useRef<HTMLDivElement>(null);

  let formattedDisplayName = translatePunycode(displayName);

  return (
    <>
      {/* {content} */}
      {showConnectModal && (
        <ConnectWalletModal onClose={() => setShowConnectModal(false)} />
      )}
      {openWarningModal && (
        <TxErrorModal
          txFunc={handleTransaction}
          setOpenWarningModal={setOpenWarningModal}
        />
      )}

      <Wrapper
        textcolor={applyIframeConfig ? textColor : colors.primary}
        className={` ${disableBuyNow ? "disabled" : ""}`}
      >
        {/* IMAGE */}
        <ItemBaseWrapper
          textcolor={applyIframeConfig ? textColor : colors.primary}
          href={
            urls.assetDetail(
              getAssetFingerprint({
                policyId: policyId,
                assetName: assetNameHex,
              })
            ) + `${affilCode ? `?a=${affilCode}` : ""}`
          }
          target={applyIframeConfig ? "_blank" : "_self"}
          className={displayName.split(" ").length === 1 ? "one-word-name" : ""}
        >
          <ImageWrapper
            imageLoaded={imageLoaded}
            className={`${sellOrder?.source === "jam" ? "jam" : ""}`}
          >
            <ScTooltipIcon
              source={sellOrder?.source}
              displayFormat="tab"
              imageLoaded={imageLoaded}
            />
            {!disableBuyNow && (
              <button
                className="hidden absolute rounded-[150px] max-w-[70%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent text-white border-2 border-white cursor-pointer transition-all duration-200 z-25 hover:bg-white hover:text-black"
                onClick={handleTransaction}
              >
                <TransactionButtonText className="tab">
                  {renderTransactionButton()}
                </TransactionButtonText>
              </button>
            )}
            <ImageComponent
              lazy
              width={130}
              height={130}
              onLoad={() => setTimeout(() => setImageLoaded(true), 100)}
              src={generateImgLinkingUrl(
                getAssetFingerprint({
                  policyId: policyId,
                  assetName: assetNameHex,
                }),
                "md"
              )}
            />
          </ImageWrapper>

          {/* NAME */}
          <DisplayName color={applyIframeConfig ? textColor : "text"}>
            {cropString(formattedDisplayName, 48)}
          </DisplayName>
        </ItemBaseWrapper>

        {/* COLLECTION */}
        <Col>
          <CollectionName
            textcolor={applyIframeConfig ? textColor : undefined}
            className={`nft-name ${disableBuyNow ? "shorter" : ""} ${
              hideCollectionName ? "hide" : ""
            }`}
            title={collection?.displayName}
          >
            <Link
              target={applyIframeConfig ? "_blank" : "_self"}
              href={
                urls.collectionDetail(collectionName || "") +
                `${affilCode ? `?a=${affilCode}` : ""}`
              }
            >
              {collection?.displayName}
            </Link>
          </CollectionName>

          {/* RARITY */}
          {rarity && (
            <RarityBadge
              theme={iframeTheme}
              percentage={rarity.percentage}
              nftsInCollection={collection?.nftsInCirculation || 0}
              order={rarity.order}
            />
          )}
        </Col>

        <PriceWrapper
          textcolor={applyIframeConfig ? textColor : colors.text}
          className="price"
        >
          {/* PRICE IN ADA */}
          {sellOrder && <span>{formatAdaFull(sellOrder.price)}</span>}
          {/* PRICE IN DOLLARS */}
          {sellOrder && (
            <span color="grey40">{formatPrice(sellOrder.price)}</span>
          )}
        </PriceWrapper>
      </Wrapper>
    </>
  );
};

export default TabNftItem;
