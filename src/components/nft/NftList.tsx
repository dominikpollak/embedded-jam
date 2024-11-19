import React from "react";
import { UseInfiniteQueryResult } from "react-query";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { ExploreNftsResponse, NftOffer } from "../../types/nft";
import { TradeModal, TradeModalData } from "../../types/trade";
import { isCompleteNft } from "../../utils/nft/nft";
import { GridNftSkeleton } from "../global/loading/GridNftSkeleton";
import { TabNftSkeleton } from "../global/loading/TabNftSkeleton";
import { InfiniteQueryRenderer } from "../global/QueryRenderer";
import { GridNftItem } from "./GridNftItem";
import InstantSellCard from "./InstantSellCard";
import { TabNftItem } from "./TabNftItem";

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
          <TabItems
            setOpenTradeModal={setOpenTradeModal}
            items={items}
            owned={owned}
            ownAssetOffer={ownAssetOffer}
            hideCollectionName={hideCollectionName}
          />
          // <ListItems
          //   items={items}
          //   owned={owned}
          //   ownAssetOffer={ownAssetOffer}
          //   isFilterOpen={isFilterOpen}
          //   setOpenTradeModal={setOpenTradeModal}
          //   hideCollectionName={hideCollectionName}
          // />
        );
      default:
        return (
          // <GridItems
          //   items={items}
          //   owned={owned}
          //   ownAssetOffer={ownAssetOffer}
          //   setOpenTradeModal={setOpenTradeModal}
          //   hideCollectionName={hideCollectionName}
          // />
          <TabItems
            setOpenTradeModal={setOpenTradeModal}
            items={items}
            owned={owned}
            ownAssetOffer={ownAssetOffer}
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
      if (!isCompleteNft(x)) return <TabNftSkeleton key={index} />;

      return (
        <TabNftItem
          hideCollectionName={hideCollectionName}
          key={x.assetNameHex + JSON.stringify(x.fullMetadata)}
          displayFormat="tab"
          owned={owned}
          {...x}
        />
      );
    })}
  </div>
);
TabItems.displayName = "TabItems";

const GridItems: React.FC<NftListItemProps> = ({
  items,
  disableBuyNow,
  owned,
  ownAssetOffer,
  setOpenTradeModal,
  hideCollectionName,
}) => (
  <div className="grid gap-6 grid-cols-[repeat(auto-fill,_minmax(130px,_1fr))]">
    {ownAssetOffer && (
      <div>
        <InstantSellCard
          setOpenTradeModal={setOpenTradeModal}
          view="grid"
          offer={ownAssetOffer}
        />
      </div>
    )}
    {items.map((x, index) => {
      if (!isCompleteNft(x)) return <GridNftSkeleton key={index} />;

      return (
        <GridNftItem
          key={x.assetNameHex}
          displayFormat="grid"
          disableBuyNow={disableBuyNow}
          hideCollectionName={hideCollectionName}
          owned={owned}
          {...x}
        />
      );
    })}
  </div>
);
GridItems.displayName = "GridItems";
