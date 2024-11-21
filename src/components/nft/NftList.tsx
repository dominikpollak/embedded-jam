import React from "react";
import { UseInfiniteQueryResult } from "react-query";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { ExploreNftsResponse, NftOffer } from "../../types/nft";
import { TradeModal, TradeModalData } from "../../types/trade";
import { isCompleteNft } from "../../utils/nft/nft";
import { GridNftSkeleton } from "../global/loading/GridNftSkeleton";
import { ListNftSkeleton } from "../global/loading/ListNftSkeleton";
import { TabNftSkeleton } from "../global/loading/TabNftSkeleton";
import { InfiniteQueryRenderer } from "../global/QueryRenderer";
import { GridNftItem } from "./GridNftItem";
import InstantSellCard from "./InstantSellCard";
import { ListNftItem } from "./ListNftItem";
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
  <div className="grid gap-6 grid-cols-[repeat(auto-fill,_minmax(140px,_1fr))]">
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

const ListItems: React.FC<
  NftListItemProps & {
    isFilterOpen?: boolean;
  }
> = ({
  items,
  owned,
  isFilterOpen,
  ownAssetOffer,
  setOpenTradeModal,
  hideCollectionName,
}) => {
  return (
    <div className="w-full bg-background text-text flex flex-col m-0 h-full">
      {ownAssetOffer && (
        <div>
          <InstantSellCard
            view="list"
            offer={ownAssetOffer}
            setOpenTradeModal={setOpenTradeModal}
          />
        </div>
      )}
      <div
        className={`${
          isFilterOpen
            ? "md:grid-cols-4 lg:grid-cols-5"
            : "md:grid-cols-5 lg:grid-cols-6"
        } w-full [&>span]:h-[40px] pl-[15px] xl:grid-cols-5 m-0 h-[40px] text-left bg-darkerBg rounded-[10px] grid items-center grid-cols-4`}
      >
        <span className="bg-darkerBg col-span-2 xl:col-span-1 rounded-l-lg font-bold leading-[40px] text-[11px] uppercase">
          Item
        </span>
        <span
          className={`bg-darkerBg xl:block hidden font-bold leading-[40px] text-[11px] uppercase ${
            isFilterOpen ? "lg:hidden xl:block" : "lg:block"
          }`}
        >
          {hideCollectionName ? "Owner" : "Collection"}
        </span>
        <span
          className={`hidden bg-darkerBg lg:block font-bold leading-[40px] text-[11px] uppercase ${
            isFilterOpen ? "md:hidden" : "md:block"
          }`}
        >
          Rarity
        </span>
        <span className="bg-darkerBg col-span-1 flex justify-start font-bold leading-[40px] text-[11px] uppercase">
          Price
        </span>
        <span className="bg-darkerBg col-span-1 rounded-r-lg" />
      </div>
      <section className="w-full gap-4">
        {items.map((x, index) => {
          if (!isCompleteNft(x)) {
            return <ListNftSkeleton key={index} isFilterOpen={isFilterOpen} />;
          }

          return (
            <ListNftItem
              key={x.assetNameHex}
              displayFormat="list"
              owner={x.owner}
              owned={owned}
              isFilterOpen={isFilterOpen}
              hideCollectionName={hideCollectionName}
              {...x}
            />
          );
        })}
      </section>
    </div>
  );
};
ListItems.displayName = "ListItems";
