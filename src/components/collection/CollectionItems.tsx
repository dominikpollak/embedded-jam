import { flattenDeep, isUndefined } from "lodash";
import React from "react";
import { tradeTypeLabels } from "../../constants/nft";
import useDebounce from "../../hooks/common/useDebounce";
import { usePendingTrades } from "../../hooks/usePendingTrades";
import { useCollectionDetail } from "../../services/collection";
import { useExchangeRates } from "../../services/exchangeRates";
import {
  useExploreNfts,
  useNftsByAddress,
  useOffers,
} from "../../services/nft";
import { useSwitchStorage } from "../../stores/useSwitchStorage";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { SortOrder } from "../../types/commonTypes";
import { NationalCurrencies } from "../../types/currency";
import { NftStatus } from "../../types/nft";
import { priceOrAdaToLovelace } from "../../utils/format";
import Button from "../global/Button";
import { SpinningLoader } from "../global/loading/SpinningLoader";
import { NftList } from "../nft/NftList";
import { NftsFilter } from "../nft/NftsFilter";

type Query = {
  sort?: SortOrder;
  properties?: string[];
  minPrice?: number;
  maxPrice?: number;
  currency?: NationalCurrencies;
  status?: NftStatus;
  rarities?: string;
};

type Props = {
  collection: string;
  totalNFts: number;
  defaultView?: "grid" | "list" | "tab";
  hasRarity: boolean;
};

const defaultSortOrder: SortOrder = "price_low_to_high";
const defaultStatus: NftStatus = "all";

export const CollectionItems: React.FC<Props> = ({
  collection,
  totalNFts,
  defaultView,
  hasRarity,
}) => {
  const urlQuery = new URLSearchParams(window.location.search).get(
    "query"
  ) as Query;
  const offerRef = React.useRef<HTMLDivElement>(null);
  const { pendingTrades } = usePendingTrades();
  const { explorerView, setExplorerView } = useSwitchStorage();
  const { data: activeCollectionDetail } = useCollectionDetail(collection);
  const offersQuery = useOffers({
    collection: collection,
    order: "price",
  });
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(defaultSortOrder);
  const [properties, setProperties] = React.useState<string[]>([]);
  const [rarity, setRarity] = React.useState<string>("");
  const [searchValue, setSearchValue] = React.useState("");
  const debouncedSearchValue = useDebounce(searchValue, 400);
  const [minPrice, setMinPrice] = React.useState<number | null>(null);
  const [maxPrice, setMaxPrice] = React.useState<number | null>(null);
  const [status, setStatus] = React.useState<NftStatus>(defaultStatus);
  const [currency, setCurrency] = React.useState<NationalCurrencies | "ada">(
    "ada"
  );
  const [view, setView] = React.useState<"grid" | "list" | "tab">(
    defaultView || explorerView
  );
  //   const { content, setOpenTradeModal } = useTradeModals({
  //     collection: activeCollectionDetail || undefined,
  //   });

  const [showSideFilter, setShowSideFilter] = React.useState(false);

  const { stakeKey, address } = useWalletStore();
  const assetsQuery = useNftsByAddress({ stakeKey: stakeKey || "" });
  const walletAssets = flattenDeep(assetsQuery.data?.pages.map((x) => x.items));
  const offers = flattenDeep(offersQuery?.data?.pages.map((x) => x.items));
  const filteredOffers = offers.filter(
    (offer) => offer?.createdByAddress !== address && !offer.nft
  );

  const highestCollectionOffer = filteredOffers.reduce(
    (maxOffer, currentOffer) => {
      return currentOffer?.price > maxOffer?.price ? currentOffer : maxOffer;
    },
    filteredOffers[0]
  );

  const ownAssetOffer = walletAssets.find((x) =>
    highestCollectionOffer?.collection?.policyIds.some(
      (policyId) => policyId === x.policyId
    )
  )
    ? highestCollectionOffer
    : undefined;

  const handleCollectionOffer = () => {
    // setOpenTradeModal("makeOffer");
  };

  React.useEffect(() => {
    if (!defaultView) return;

    setView(defaultView);
    setExplorerView(defaultView);
  }, [defaultView, setExplorerView]);

  const exchangeRates = useExchangeRates();

  const handleViewChange = (newView: "grid" | "list" | "tab") => {
    setExplorerView(newView);
    setView(newView);
  };

  const query = useExploreNfts({
    sortOrder,
    collections: [collection],
    properties: properties,
    nftName: debouncedSearchValue,
    rarities: rarity ? [rarity] : undefined,
    minPrice: minPrice
      ? priceOrAdaToLovelace(minPrice, currency, exchangeRates.data)
      : undefined,
    maxPrice: maxPrice
      ? priceOrAdaToLovelace(maxPrice, currency, exchangeRates.data)
      : undefined,
    status: status,
  });

  const hasCollectionRarity =
    hasRarity !== undefined
      ? hasRarity
      : query.data?.pages[0]?.items[0]?.rarity?.percentage;

  React.useEffect(() => {
    const { sort, properties, minPrice, maxPrice, currency, status, rarities } =
      urlQuery;

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

    setSortOrder(sort ?? defaultSortOrder);
    setStatus(status ?? defaultStatus);
    if (rarities) setRarity(rarities);
    else setRarity("");
  }, [urlQuery]);

  return (
    <>
      {/* {content} */}
      <>
        <NftsFilter
          view={view}
          setView={handleViewChange}
          collections={[collection]}
          minPrice={minPrice}
          maxPrice={maxPrice}
          currency={currency}
          showRarity={!!hasCollectionRarity}
          searchValue={searchValue}
          onSearchValueChange={setSearchValue}
          totalNfts={totalNFts}
          setShowSideFilter={setShowSideFilter}
          showSideFilter={showSideFilter}
          activeCollectionDetail={activeCollectionDetail}
        />
        <div className="flex relative min-h-[700px] w-full gap-[15px] first:mt-0">
          {showSideFilter && (
            <CollectionSideFilter
              key="sideFilter"
              collections={[collection]}
              minPrice={minPrice}
              maxPrice={maxPrice}
              currency={currency}
              showRarity={!!hasCollectionRarity}
              searchValue={searchValue}
              onSearchValueChange={setSearchValue}
              totalNfts={totalNFts}
              onClose={() => setShowSideFilter(false)}
            />
          )}
          <div
            style={{
              zIndex: "2",
              width: "100%",
              height: "100%",
              margin: "0",
            }}
          >
            <NftList
              view={explorerView}
              query={query}
              isFilterOpen={showSideFilter}
              ownAssetOffer={ownAssetOffer}
              //   setOpenTradeModal={setOpenTradeModal}
              hideCollectionName
            />
          </div>
          <div
            ref={offerRef}
            className="fixed bottom-1 right-1 z-10 pt-[4px] pr-[5px] pb-[6px] pl-[5px] rounded-[20px] shadow-md bg-background md:hidden"
          >
            <Button
              onClick={handleCollectionOffer}
              size="xs"
              variant="primary"
              label={
                Object.keys(pendingTrades).length !== 0 ? (
                  <div className="flex items-center w-fit lg:flex-row gap-4">
                    <SpinningLoader size={25} />
                    <p>{tradeTypeLabels[pendingTrades[0].type]} pending</p>
                  </div>
                ) : (
                  "Make offer"
                )
              }
              disabled={Object.keys(pendingTrades).length !== 0}
            />
          </div>
        </div>
      </>
    </>
  );
};
