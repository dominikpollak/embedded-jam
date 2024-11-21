import React from "react";
import Modal from "../../components/global/Modal";
import { AcceptOfferModalContent } from "../../components/trade/AcceptOfferModal";
import { BuyModalContent } from "../../components/trade/BuyModal";
import { CancelModalContent } from "../../components/trade/CancelModal";
import { CancelOfferModalContent } from "../../components/trade/CancelOfferModal";
import DelistModalContent from "../../components/trade/DelistModal";
import { ListModalContent } from "../../components/trade/ListModal";
import { MakeOfferModalContent } from "../../components/trade/MakeOfferModal";
import { UpdateModalContent } from "../../components/trade/UpdateModal";
import { useIsTradeModalOpen } from "../../stores/states/useIsTradeModalOpen";
import { useOpenConnectWalletModal } from "../../stores/states/useOpenConnectWalletModal";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { CollectionDetailResponse } from "../../types/collection";
import { ExtendedNftToken, NftListData, NftOffer } from "../../types/nft";
import { TradeModal, TradeModalData } from "../../types/trade";

type Props = {
  nftListing?: NftListData;
  offer?: NftOffer;
  collection?: CollectionDetailResponse;
  selectedItems?: ExtendedNftToken[];
  claimData?: {
    datum: string;
    claimAmount: number;
  };
  onClose: () => void;
};

const modals: Record<TradeModal, any> = {
  list: ListModalContent,
  buy: BuyModalContent,
  update: UpdateModalContent,
  cancel: CancelModalContent,
  makeOffer: MakeOfferModalContent,
  cancelOffer: CancelOfferModalContent,
  acceptOffer: AcceptOfferModalContent,
  delist: DelistModalContent,
  migrate: null,
  claim: null,
};

export const useTradeModals = (
  input: Pick<Props, "nftListing" | "collection">
) => {
  const [openModal, setOpenModal] = React.useState<TradeModal | null>(null);
  const [data, setData] = React.useState<TradeModalData>({});
  const { address, disabledExt } = useWalletStore();
  const { setOpenConnectWalletModal } = useOpenConnectWalletModal();
  const { setIsTradeModalOpen } = useIsTradeModalOpen();

  const handleOpen = React.useCallback(
    (modal: TradeModal | null, extraData: TradeModalData = {}) => {
      if (!address) {
        setOpenConnectWalletModal(true);
        return;
      }

      setData(extraData);
      setOpenModal(modal);
    },
    [address, disabledExt, setOpenConnectWalletModal]
  );

  const content = openModal ? (
    <Modal
      minHeight="auto"
      minWidth="95%"
      maxHeight="95%"
      maxWidth="1050px"
      onClose={() => setOpenModal(null)}
    >
      {(() => {
        const OpenModal = modals[openModal ?? "list"];
        return (
          <OpenModal
            nftListing={input.nftListing || data.nftListing}
            collection={input.collection || data.collection}
            selectedItems={data.selectedItems || []}
            onClose={() => handleOpen(null, undefined)}
            offer={data.offer}
            claimData={data.claimData}
          />
        );
      })()}
    </Modal>
  ) : null;

  React.useEffect(() => {
    setIsTradeModalOpen(openModal !== null);
  }, [openModal, setIsTradeModalOpen]);

  return {
    content,
    setOpenTradeModal: handleOpen,
    closeTradeModal: () => setOpenModal(null),
  };
};
