import { flattenDeep, isUndefined } from "lodash";
import { useEffect, useRef, useState } from "react";
import Button from "../global/Button";
import { SpinningLoader } from "../global/loading/SpinningLoader";
import { NftList } from "../nft/NftList";

const Row = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  ${media.desktopS} {
    flex-direction: row;
  }
  gap: ${spacing.xs};
`;

const FilterWrapper = styled.div`
  display: flex;
  position: relative;
  min-height: 700px;
  width: 100%;
  gap: 15px;
  & > :first-child {
    margin-top: 0;
  }
`;

const MakeOffer = styled(motion.div)`
  position: fixed;
  bottom: 5px;
  right: 5px;
  z-index: 10;
  padding: 4px 5px 6px 5px;
  border-radius: 20px;
  box-shadow: 0px 0px 10px -2px rgba(0, 0, 0, 0.41);
  background-color: ${colors.background};
  ${media.desktopM} {
    display: none;
  }
`;

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
  const offerRef = useRef<HTMLDivElement>(null);
  const { pendingTrades } = usePendingTrades();
  const { explorerView, setExplorerView } = useSwitchStorage();
  const { data: activeCollectionDetail } = useCollectionDetail(collection);
  const offersQuery = useOffers({
    collection: collection,
    order: "price",
  });
  const router = useRouter();
  const applyIframeConfig =
    router.pathname.startsWith("/iframe") ||
    router.pathname.startsWith("/embed");
  const { textColor } = useIframeColors();
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);
  const [properties, setProperties] = useState<string[]>([]);
  const [rarity, setRarity] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 400);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [status, setStatus] = useState<NftStatus>(defaultStatus);
  const [currency, setCurrency] = useState<NationalCurrencies | "ada">("ada");
  const [view, setView] = useState<"grid" | "list" | "tab">(
    defaultView || explorerView
  );
  const { content, setOpenTradeModal } = useTradeModals({
    collection: activeCollectionDetail || undefined,
  });

  const [showSideFilter, setShowSideFilter] = useState(false);

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
    setOpenTradeModal("makeOffer");
  };

  useEffect(() => {
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

  useEffect(() => {
    const { sort, properties, minPrice, maxPrice, currency, status, rarities } =
      router.query as Query;

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
  }, [router.query]);

  return (
    <>
      {content}
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
        <FilterWrapper>
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
              setOpenTradeModal={setOpenTradeModal}
              hideCollectionName
            />
          </div>
          <MakeOffer
            ref={offerRef}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ bounce: 0 }}
          >
            {applyIframeConfig ? (
              <IframeButton
                bgcolor={textColor}
                onClick={handleCollectionOffer}
                size="superSmall"
                variant="primary"
                label={
                  Object.keys(pendingTrades).length !== 0 ? (
                    <Row>
                      <SpinnerCircular
                        color={colors.primary}
                        secondaryColor={colors.grey20}
                        thickness={150}
                        size={25}
                        enabled
                      />
                      <p>{tradeTypeLabels[pendingTrades[0].type]} pending</p>
                    </Row>
                  ) : (
                    "Make offer"
                  )
                }
                disabled={Object.keys(pendingTrades).length !== 0}
              />
            ) : (
              <Button
                onClick={handleCollectionOffer}
                size="xs"
                variant="primary"
                label={
                  Object.keys(pendingTrades).length !== 0 ? (
                    <Row>
                      <SpinningLoader size={25} />
                      <p>{tradeTypeLabels[pendingTrades[0].type]} pending</p>
                    </Row>
                  ) : (
                    "Make offer"
                  )
                }
                disabled={Object.keys(pendingTrades).length !== 0}
              />
            )}
          </MakeOffer>
        </FilterWrapper>
      </>
    </>
  );
};
