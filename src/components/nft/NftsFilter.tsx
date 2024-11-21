import { Grid3X3, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import React from "react";
import { UseQueryResult } from "react-query";
import { colors } from "../../constants/colors";
import { tradeTypeLabels } from "../../constants/nft";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useTradeModals } from "../../hooks/wallet/useTradeModals";
import { useIsTradeModalOpen } from "../../stores/states/useIsTradeModalOpen";
import { CollectionDetailResponse } from "../../types/collection";
import { SortOrder, Views } from "../../types/commonTypes";
import { NationalCurrencies } from "../../types/currency";
import { NftStatus } from "../../types/nft";
import Button from "../global/Button";
import { JamDropdown } from "../global/dropdown/JamDropdown";
import { SpinningLoader } from "../global/loading/SpinningLoader";
import { TextField } from "../global/TextField";
import { NftListViewSwitch } from "./NftViewSwitch";

const sortOptions: Array<{ name: string; value: SortOrder }> = [
  {
    name: "recently listed",
    value: "recently_listed",
  },
  {
    name: "least recently listed",
    value: "least_recently_listed",
  },
  {
    name: "least expensive first",
    value: "price_low_to_high",
  },
  {
    name: "most expensive first",
    value: "price_high_to_low",
  },
  {
    name: "most rare first",
    value: "rarity_high_to_low",
  },
  {
    name: "common first",
    value: "rarity_low_to_high",
  },
];

export type Query = {
  sort?: SortOrder;
  properties?: string[];
  minPrice?: number;
  maxPrice?: number;
  currency?: NationalCurrencies;
  collections?: string[];
  status?: NftStatus;
  rarities?: string;
};

type Props = {
  view: Views;
  setView: (newView: Views) => void;
  totalNfts?: number;
  collections?: string[];
  showRarity?: boolean;
  minPrice?: number | null;
  maxPrice?: number | null;
  currency?: string;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  setShowSideFilter: React.Dispatch<React.SetStateAction<boolean>>;
  showSideFilter: boolean;
  activeCollectionDetail?:
    | UseQueryResult<CollectionDetailResponse, unknown>["data"]
    | undefined
    | null;
};
export const NftsFilter: React.FC<Props> = ({
  collections,
  view,
  setView,
  searchValue,
  onSearchValueChange,
  showRarity,
  totalNfts,
  setShowSideFilter,
  showSideFilter,
  activeCollectionDetail,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const sort = urlParams.get("sort");
  const { pendingTrades } = usePendingTrades();
  const defaultSortOrder: SortOrder = "price_low_to_high";
  const { isTradeModalOpen } = useIsTradeModalOpen();
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(defaultSortOrder);
  const { content, setOpenTradeModal } = useTradeModals({
    collection: activeCollectionDetail || undefined,
  });
  const views: Views[] = ["tab", "grid", "list"];
  const viewIcons = [<LayoutGrid />, <Grid3X3 />, <List />];
  const tradeType = pendingTrades[0]
    ? tradeTypeLabels[pendingTrades[0].type]
    : "";

  const handleCollectionOffer = () => {
    setOpenTradeModal("makeOffer");
  };

  const handleSetSortOrder = (value: string) => {
    if (!value) {
      setSortOrder(defaultSortOrder);
      urlParams.delete("sort");
      window.history.replaceState(null, "", `?${urlParams.toString()}`);
      return;
    }

    urlParams.set("sort", value);
    setSortOrder(value as SortOrder);

    if (value === "price_low_to_high") {
      urlParams.delete("sort");
    }

    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  const [scrolled, setScrolled] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (wrapperRef.current) {
        const top = wrapperRef.current.getBoundingClientRect().top;
        setScrolled(top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [wrapperRef]);

  React.useEffect(() => {
    if (urlParams.has("sort")) {
      setSortOrder(sort as SortOrder);
    }
  }, [sort]);

  return (
    <>
      {content}
      <div
        className={`bg-background duration-200 mb-6 ml-auto flex justify-end gap-4 ${
          isTradeModalOpen ? "relative" : "sticky z-[3]"
        } w-full ${
          scrolled
            ? "shadow-md top-0 p-[10px] pt-[15px] rounded-b-[15px] rounded-l-[15px]"
            : "p-0 top-auto"
        }`}
        ref={wrapperRef}
      >
        <div className="w-full max-w-full flex items-start gap-4 md:flex-row md:items-center">
          <Button
            leftIcon={
              <SlidersHorizontal
                color={colors.text}
                className={showSideFilter ? "rotate-90" : "rotate-0"}
              />
            }
            onClick={() => setShowSideFilter((prev) => !prev)}
            size="sm"
            variant="secondary"
            className="shrink-0"
          />
          {collections?.length === 1 && (
            // <VisibleFrom breakpoint="desktopM">
            <Button
              onClick={handleCollectionOffer}
              size="sm"
              variant="primary"
              className="min-w-[130px] hidden xl:block"
              label={
                Object.keys(pendingTrades).length !== 0 ? (
                  <div className="w-fit flex gap-4 items-center">
                    <SpinningLoader size={25} />
                    <p>{tradeType} pending</p>
                  </div>
                ) : (
                  "Make offer"
                )
              }
              disabled={Object.keys(pendingTrades).length !== 0}
            />
            // </VisibleFrom>
          )}
          {onSearchValueChange && (
            <TextField
              showSearchIcon
              value={searchValue || ""}
              onChange={(e: any) => {
                onSearchValueChange(e.target.value);
              }}
              placeholder={
                totalNfts ? `Search ${totalNfts} NFTs` : "Search NFTs"
              }
              wrapperClassName="hidden md:flex w-[500px]"
              inputClassName="w-full"
            />
          )}
          <JamDropdown
            label="sort by"
            value={[sortOrder]}
            selection="single"
            openTo="right"
            onChange={(value) => handleSetSortOrder(value[0])}
            options={
              !showRarity
                ? sortOptions.filter(
                    (x) =>
                      x.value !== "rarity_low_to_high" &&
                      x.value !== "rarity_high_to_low"
                  )
                : sortOptions
            }
          />
        </div>
        <div className="hidden [500px]:block">
          <NftListViewSwitch view={view} onChange={setView} />
        </div>
        {/* <VisibleTo breakpointPixels={500}> */}
        <Button
          size="sm"
          variant="secondary"
          leftIcon={viewIcons[views.indexOf(view)]}
          onClick={() => {
            let newView = views[(views.indexOf(view) + 1) % views.length];
            setView(newView);
          }}
          className="[500px]:hidden block"
        />
        {/* </VisibleTo> */}
      </div>
    </>
  );
};
