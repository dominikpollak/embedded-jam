import { useQuery } from "react-query";
import { CollectionDetailResponse } from "../types/collection";
import { getUrl } from "../utils/getUrl";
import { customFetchHandler } from "./fetchWrapper";

export const fetchCollectionDetail = async (
  collection: string | null
): Promise<CollectionDetailResponse | null> => {
  if (!collection) return null;

  const res = await customFetchHandler({
    url: getUrl(`nfts/collections/${collection}`),
    cache: false,
  });
  return res as CollectionDetailResponse;
};

export const useCollectionDetail = (
  collection: string | null,
  initialData?: CollectionDetailResponse
) =>
  useQuery(
    useCollectionDetail.__key(collection),
    () => fetchCollectionDetail(collection),
    {
      initialData: initialData,
    }
  );

useCollectionDetail.__key = (collection: string | null) => [
  "collectionDetail",
  collection,
];

type CollectionsResponse = {
  items: {
    name: string;
    displayName: string;
    policyIds: string[];
  }[];
};

export const fetchCollections = async (): Promise<CollectionsResponse> => {
  const res = await customFetchHandler({ url: getUrl("nfts/collections", {}) });
  const collections = res.data as CollectionsResponse;
  const sortedCollections = collections.items.sort((a, b) =>
    a.displayName.toLocaleLowerCase() < b.displayName.toLocaleLowerCase()
      ? -1
      : 1
  );
  return {
    items: sortedCollections,
  };
};

export const useCollections = (enabled: boolean = true) =>
  useQuery(useCollections.__key, fetchCollections, {
    staleTime: 1_000 * 60 * 10,
    enabled: enabled,
  });

useCollections.__key = ["collections"];
