import React from "react";
import { UseInfiniteQueryResult } from "react-query";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { ExploreNftsResponse, NftOffer } from "../../types/nft";
import { TradeModal, TradeModalData } from "../../types/trade";
import { InfiniteQueryRenderer } from "../global/QueryRenderer";
import InstantSellCard from "./InstantSellCard";
import { isCompleteNft } from "../../utils/nft/nft";

interface NftListProps {
  query?: UseInfiniteQueryResult<ExploreNftsResponse, unknown>;
  view: "grid" | "list" | "tab" | undefined;
  owned?: boolean;
  isFilterOpen?: boolean;
  ownAssetOffer?: NftOffer;
  setOpenTradeModal?: (
    modal: TradeModal | null,
    extraData: TradeModalData
  ) => void;
  hideCollectionName?: boolean;
}

interface NftListItemProps {
  items: any[];
  disableBuyNow?: boolean;
  owned?: boolean;
  ownAssetOffer?: NftOffer;
  setOpenTradeModal:
    | ((modal: TradeModal | null, extraData: TradeModalData) => void)
    | undefined;
  hideCollectionName?: boolean;
}

export const NftList: React.FC<NftListProps> = ({
  query,
  view,
  owned,
  ownAssetOffer,
  isFilterOpen,
  setOpenTradeModal,
  hideCollectionName,
}) => {
  const { pendingTrades } = usePendingTrades();
  const tradesLength = Object.keys(pendingTrades).length;

  React.useEffect(() => {
    if (tradesLength === 0) {
      query?.refetch();
    }
  }, [tradesLength]);

  const renderItems = (items: any[]) => {
    switch (view) {
      case "tab":
        return (
          <TabItems
            setOpenTradeModal={setOpenTradeModal}
            items={items}
            owned={owned}
            ownAssetOffer={ownAssetOffer}
            hideCollectionName={hideCollectionName}
          />
        );
      case "grid":
        return (
          <GridItems
            items={items}
            owned={owned}
            ownAssetOffer={ownAssetOffer}
            setOpenTradeModal={setOpenTradeModal}
            hideCollectionName={hideCollectionName}
          />
        );
      case "list":
        return (
          <ListItems
            items={items}
            owned={owned}
            ownAssetOffer={ownAssetOffer}
            isFilterOpen={isFilterOpen}
            setOpenTradeModal={setOpenTradeModal}
            hideCollectionName={hideCollectionName}
          />
        );
      default:
        return (
          <GridItems
            items={items}
            owned={owned}
            ownAssetOffer={ownAssetOffer}
            setOpenTradeModal={setOpenTradeModal}
            hideCollectionName={hideCollectionName}
          />
        );
    }
  };

  return (
    <>
      <InfiniteQueryRenderer
        query={query as any}
        renderer={renderItems}
        emptyPage={{
          title: "OOPS...",
          description: "No results found",
        }}
        isLoadingFullscreen
      />
    </>
  );
};

const TabItems: React.FC<NftListItemProps> = ({
  items,
  owned,
  ownAssetOffer,
  setOpenTradeModal,
  hideCollectionName,
}) => (
  <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] w-full m-0 gap-5">
    {ownAssetOffer && (
      <div>
        <InstantSellCard
          setOpenTradeModal={setOpenTradeModal}
          view="tab"
          offer={ownAssetOffer}
        />
      </div>
    )}
    {items.map((x, index) => {
      if (!isCompleteNft(x))
        return <TabNftSkeleton key={index} displayFormat="tab" />;

      return (
        <TabNftItem
          hideCollectionName={hideCollectionName}
          key={x.assetNameHex}
          displayFormat="tab"
          owned={owned}
          {...x}
        />
      );
    })}
  </div>
);
TabItems.displayName = "TabItems";
