import { useInfiniteQuery } from "react-query";
import { ExploreNftsResponse, FetchExploreNftsParams } from "../types/nft";
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
  return res.data as ExploreNftsResponse;
};

export const useExploreNfts = (
  params: Exclude<FetchExploreNftsParams, "pageParam">
) =>
  useInfiniteQuery(
    useExploreNfts.__key(params),
    ({ pageParam }) => fetchExploreNfts({ ...params, pageParam }),
    {
      getNextPageParam: getNextPageParam,
      refetchOnWindowFocus: false,
    }
  );

useExploreNfts.__key = (
  params: Exclude<FetchExploreNftsParams, "pageParam">
) => ["exploreNfts", params];
