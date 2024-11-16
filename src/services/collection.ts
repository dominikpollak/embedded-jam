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
  return res.data as CollectionDetailResponse;
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
