import { useInfiniteQuery } from "react-query";
import {
  ExploreNftsResponse,
  FetchExploreNftsParams,
  FetchNftOffersParams,
  FetchNftsByAddress,
  NftOffersResponse,
  NftsByAddressResponse,
} from "../types/nft";
import { getUrl } from "../utils/getUrl";
import { getNextPageParam } from "../utils/queryParams";
import { customFetchHandler } from "./fetchWrapper";

export const fetchExploreNfts = async ({
  pageParam,
  sortOrder,
  collections,
  nftName,
  rarities,
  minPrice,
  maxPrice,
  status,
  properties = [],
  limit,
}: FetchExploreNftsParams): Promise<ExploreNftsResponse> => {
  const collectionsParam = !collections.length ? undefined : collections;
  const propertiesParam = !properties.length
    ? ""
    : `&properties${properties.join("&properties")}`;

  const res = await customFetchHandler({
    url:
      getUrl("nfts", {
        limit: limit || 40,
        cursor: pageParam,
        order: sortOrder,
        collections: collectionsParam,
        nameQuery: nftName,
        rarities: rarities,
        priceMin: minPrice,
        priceMax: maxPrice,
        status: status === "all" ? undefined : status,
      }) + propertiesParam,
  });

  return res as ExploreNftsResponse;
};

export const useExploreNfts = (
  params: Exclude<FetchExploreNftsParams, "pageParam">
) =>
  useInfiniteQuery(
    useExploreNfts.__key(params),
    ({ pageParam }) => fetchExploreNfts({ ...params, pageParam }),
    {
      getNextPageParam,
      refetchOnWindowFocus: false,
    }
  );

useExploreNfts.__key = (
  params: Exclude<FetchExploreNftsParams, "pageParam">
) => ["exploreNfts", params];

export const fetchNftsByAddress = async (
  params: FetchNftsByAddress
): Promise<NftsByAddressResponse> => {
  const { stakeKey, pageParam, ...rest } = params;
  const res = await customFetchHandler({
    url: getUrl("nfts/held-by-addresses", {
      limit: 40,
      stakeKeys: [stakeKey],
      cursor: pageParam,
      ...rest,
    }),
  });
  return res as NftsByAddressResponse;
};

export const useNftsByAddress = (
  params: Exclude<FetchNftsByAddress, "pageParam">
) =>
  useInfiniteQuery(
    useNftsByAddress.__key(params),
    ({ pageParam }) => fetchNftsByAddress({ ...params, pageParam }),
    {
      getNextPageParam,
      refetchOnWindowFocus: false,
      enabled: !!params.stakeKey,
    }
  );

useNftsByAddress.__key = (params: Exclude<FetchNftsByAddress, "pageParam">) => [
  "nftsByAddress",
  params,
];

export const fetchOffers = async ({
  collection,
  policyId,
  assetNameHex,
  pageParam,
  offerType,
  order,
  stakeKey,
}: FetchNftOffersParams & {
  pageParam?: string;
}): Promise<NftOffersResponse> => {
  const res = await customFetchHandler({
    url: getUrl("nfts/offers", {
      collection,
      policyId,
      assetNameHex,
      createdByStakeKey: stakeKey,
      offerType,
      order,
      limit: 30,
      cursor: pageParam,
    }),
  });

  return res as NftOffersResponse;
};
export const useOffers = (params: FetchNftOffersParams) =>
  useInfiniteQuery(
    useOffers.__key(params),
    ({ pageParam }) => fetchOffers({ ...params, pageParam }),
    {
      getNextPageParam,
      refetchOnWindowFocus: false,
      staleTime: 20000,
      cacheTime: 20000,
      enabled:
        !!params.assetNameHex || !!params.collection || !!params.stakeKey,
    }
  );

useOffers.__key = (params: FetchNftOffersParams) => ["offers", params];
