import detectUrlChange from "detect-url-change";
import { isNull, isUndefined } from "lodash";
import { Check, X } from "lucide-react";
import React from "react";
import { colors } from "../../constants/colors";
import { useCollectionDetail, useCollections } from "../../services/collection";
import { SortOrder } from "../../types/commonTypes";
import { NationalCurrencies } from "../../types/currency";
import { NftStatus } from "../../types/nft";
import { NestedOption, SearchBox } from "../global/dropdown/BaseDropdownParts";
import PriceFilter from "../global/filter/PriceFilter";
import { PropertiesFilter } from "../global/filter/PropertiesFilter";
import RarityFilter from "../global/filter/RarityFilter";
import { SearchedText } from "../global/SearchedText";
import { TextField } from "../global/TextField";
import { Toggle } from "../global/Toggle";

type Props = {
  onClose: () => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  totalNfts?: number;
  collections?: string[];
  showCollectionsFilter?: boolean;
  showRarity?: boolean;
  minPrice?: number | null;
  maxPrice?: number | null;
  currency?: string;
};

const CollectionSideFilter = ({
  collections,
  showCollectionsFilter = false,
  searchValue,
  onSearchValueChange,
  showRarity,
  totalNfts,
  onClose,
}: Props) => {
  const urlParams = new URLSearchParams(window.location.search);
  const { data: allCollections } = useCollections(collections?.length === 0);
  const { data: activeCollectionDetail } = useCollectionDetail(
    collections?.length === 1 && !showCollectionsFilter ? collections[0] : null
  );
  const defaultStatus: NftStatus = "all";
  const defaultSortOrder: SortOrder = "price_low_to_high";
  const [searchCollections, setSearchCollections] = React.useState("");
  const [status, setStatus] = React.useState<NftStatus>(defaultStatus);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(defaultSortOrder);
  const [rarity, setRarity] = React.useState<number[]>([]);
  const [minPrice, setMinPrice] = React.useState<number | null>(null);
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
  const [currency, setCurrency] = React.useState<NationalCurrencies | "ada">(
    "ada"
  );
  const [properties, setProperties] = React.useState<string[]>([]);
  const [activeWindow, setActiveWindow] = React.useState<"filter" | "traits">(
    "filter"
  );
  const [selected, setSelected] = React.useState<string[]>([]);
  const [currentUrl, setCurrentUrl] = React.useState(window.location.href);
  const showPriceFilter =
    !isUndefined(currency) && !isUndefined(minPrice) && !isUndefined(maxPrice);

  const resetFilters = () => {
    urlParams.delete("status");
    urlParams.delete("sort");
    urlParams.delete("collections");
    urlParams.delete("minPrice");
    urlParams.delete("maxPrice");
    urlParams.delete("currency");
    urlParams.delete("properties");
    urlParams.delete("rarities");
    onSearchValueChange && onSearchValueChange("");
    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  const handleSelection = (name: string) => {
    let tempSelection = [];
    if (selected.some((colName) => colName === name)) {
      tempSelection = selected.filter((colName) => colName !== name);
    } else {
      tempSelection = [...selected, name];
    }
    setSelected(tempSelection);

    urlParams.set("collections", tempSelection.join(","));
    urlParams.delete("properties");
    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  const showResetFilters =
    selected.length > 0 ||
    properties.length !== 0 ||
    sortOrder !== "price_low_to_high" ||
    (showPriceFilter && (!isNull(minPrice) || !isNull(maxPrice))) ||
    searchValue !== "" ||
    status !== "all" ||
    rarity.length !== 0;

  const handleSetStatus = (value: NftStatus) => {
    urlParams.set("status", value);

    if (value === "all") {
      urlParams.delete("status");
    }

    setStatus(value);
    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  React.useEffect(() => {
    const sort = urlParams.get("sort") as SortOrder;
    const properties = urlParams.getAll("properties");
    const minPrice = urlParams.get("minPrice")
      ? Number(urlParams.get("minPrice"))
      : undefined;
    const maxPrice = urlParams.get("maxPrice")
      ? Number(urlParams.get("maxPrice"))
      : undefined;
    const currency = urlParams.get("currency") as
      | NationalCurrencies
      | undefined;
    const status = urlParams.get("status") as NftStatus;
    const rarities = urlParams.get("rarities");

    setProperties(
      (Array.isArray(properties)
        ? properties
        : [properties].filter(Boolean)) as string[]
    );

    if (!isUndefined(minPrice)) setMinPrice(minPrice);
    else setMinPrice(null);
    if (!isUndefined(maxPrice)) setMaxPrice(maxPrice);
    else setMaxPrice(null);
    if (!isUndefined(currency)) setCurrency(currency);
    else setCurrency("ada");

    setSortOrder(sort || "price_low_to_high");
    setStatus(status && status !== "all" ? "buy_now" : "all");

    if (rarities)
      setRarity([
        Number(rarities?.split("-")[0]),
        Number(rarities?.split("-")[1]),
      ]);
    else setRarity([]);

    if (collections) {
      setSelected(
        typeof collections === "string" ? [collections] : collections
      );
    } else {
      setSelected([]);
    }
  }, [currentUrl]);

  React.useEffect(() => {
    detectUrlChange.on("change", (newUrl) => {
      setCurrentUrl(newUrl);
    });

    return () => {
      detectUrlChange.off("change", () => {});
    };
  }, []);

  return (
    <section className="fixed rounded-[25px] p-[15px] overflow-y-scroll md:z-[1] md:bottom-[5px] md:h-[calc(100vh-90px)] md:top-[80px] shrink-0 border-2 border-border inset-[15px] z-[1000] bg-background text-text md:sticky md:w-[270px] hide-scrollbar">
      <div className="pb-3 border-b border-border flex items-center justify-between h-[27px]">
        <div
          className="justify-start gap-4 flex items-center"
          style={{ justifyContent: "start", gap: "15px" }}
        >
          <button
            className={`relative text-[15px] border-none bg-none font-medium cursor-pointer text-grayText ${
              activeWindow === "filter"
                ? "text-text border-b-2 border-text"
                : ""
            }`}
            onClick={() => setActiveWindow("filter")}
          >
            Filters
          </button>
          {activeCollectionDetail &&
            Object.keys(activeCollectionDetail.properties).length > 0 && (
              <button
                className={`relative text-[15px] border-none bg-none font-medium cursor-pointer text-grayText ${
                  activeWindow === "traits"
                    ? "text-text after:block after:w-full after:h-[2px] after:bg-text after:content-none after:absolute after:bottom-[-11px]"
                    : ""
                }`}
                onClick={() => setActiveWindow("traits")}
              >
                Traits
              </button>
            )}
        </div>
        {showResetFilters && (
          <button
            className={`relative text-[15px] border-none bg-none font-medium cursor-pointer text-grayText ml-auto mr-[10px]`}
            onClick={resetFilters}
          >
            Clear
          </button>
        )}
        <button
          className="border-none cursor-pointer md:hidden text-[15px]"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>

      {activeWindow === "filter" && (
        <>
          <div className="w-full mt-4 md:hidden">
            <TextField
              showSearchIcon
              value={searchValue || ""}
              onChange={(e: any) => {
                onSearchValueChange(e.target.value);
              }}
              placeholder={
                totalNfts ? `Search ${totalNfts} NFTs` : "Search NFTs"
              }
              width={260}
            />
          </div>
          <div className="flex items-center justify-between my-4">
            <span className="font-medium">For sale</span>
            <Toggle
              value={status === "buy_now"}
              label=""
              onToggle={() =>
                handleSetStatus(status !== "buy_now" ? "buy_now" : "all")
              }
            />
          </div>
          <span className="font-medium">Price</span>
          <PriceFilter
            currency={currency}
            minPrice={minPrice}
            maxPrice={maxPrice}
            floorPrice={
              activeCollectionDetail?.floorPrice
                ? activeCollectionDetail?.floorPrice / 1000000
                : 0
            }
          />
          {showRarity ? (
            <>
              <span className="font-medium">Rarity</span>
              <RarityFilter from={rarity[0]} to={rarity[1]} rarity={rarity} />
            </>
          ) : (
            <div style={{ width: "150px" }} />
          )}
          {showCollectionsFilter && (
            <>
              <span className="font-medium">Collections</span>
              <SearchBox style={{ marginTop: "10px", marginBottom: "7px" }}>
                <TextField
                  placeholder="Search collection"
                  value={searchCollections}
                  onChange={(e) => setSearchCollections(e.target.value)}
                  showSearchIcon
                />
              </SearchBox>
              <div className="w-full flex flex-col border border-border rounded-[10px] mb-4 shadow-sm">
                <div className="w-full p-0 h-auto min-h-[38px] max-h-[349px] overflow-y-auto thin-scrollbar">
                  {allCollections?.items.filter(
                    (col) =>
                      col.name
                        .toLowerCase()
                        .includes(searchCollections.toLowerCase()) ||
                      col.displayName
                        .toLowerCase()
                        .includes(searchCollections.toLowerCase())
                  ).length === 0 && (
                    <p className="w-full flex items-center justify-center h-[37px] m-0">
                      <span className="font-medium">No results </span>
                    </p>
                  )}
                  {allCollections?.items
                    .filter(
                      (col) =>
                        col.name
                          .toLowerCase()
                          .includes(searchCollections.toLowerCase()) ||
                        col.displayName
                          .toLowerCase()
                          .includes(searchCollections.toLowerCase())
                    )
                    .map((item, i) => (
                      <NestedOption
                        key={item.name}
                        style={{ width: "100%" }}
                        className={
                          selected?.some((col) => col === item.name)
                            ? "active"
                            : ""
                        }
                        onClick={() => handleSelection(item.name)}
                      >
                        <div className="flex justify-between w-full">
                          <SearchedText
                            uppercase={false}
                            text={item.displayName}
                            searchedValue={searchCollections}
                          />
                        </div>

                        <div className="text-right w-[20px]">
                          {selected?.some((col) => col === item.name) && (
                            <Check size={10} color={colors.text} />
                          )}
                        </div>
                      </NestedOption>
                    ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
      {activeWindow === "traits" && (
        <PropertiesFilter
          properties={properties}
          activeCollectionDetail={activeCollectionDetail}
        />
      )}
    </section>
  );
};

export default CollectionSideFilter;
