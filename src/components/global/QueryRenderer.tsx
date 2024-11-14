import { flattenDeep } from "lodash";
import React, { useCallback, useEffect, useRef } from "react";
import { UseInfiniteQueryResult, UseQueryResult } from "react-query";
import { SpinningLoader } from "./SpinningLoader";
import { EmptyPage, EmptyPageProps } from "./pages/EmptyPage";
import { ErrorPage } from "./pages/ErrorPage";

type QueryRendererProps<T> = {
  query: UseQueryResult<T>;
  renderer: (data: T, query: UseQueryResult<T>) => JSX.Element | null;
  isEmpty?: (data: UseQueryResult<T>["data"]) => boolean;
  emptyPage?: EmptyPageProps;
};

export const QueryRenderer = <T,>({
  query,
  renderer,
  isEmpty,
  emptyPage,
}: QueryRendererProps<T>) => {
  if (query.isLoading || query.isIdle) {
    return <SpinningLoader />;
  }
  if (query.isError || !query.data) {
    return <ErrorPage onRetry={() => query.refetch()} />;
  }
  if (isEmpty !== undefined && isEmpty(query.data) && emptyPage) {
    return <EmptyPage {...emptyPage} />;
  }

  return renderer(query.data, query);
};

type InfiniteQueryRendererProps<Item, Response extends { items: Item[] }> = {
  query: UseInfiniteQueryResult<Response>;
  renderer: (
    items: Response["items"],
    query: UseInfiniteQueryResult<Response>
  ) => JSX.Element;
  emptyPage?: EmptyPageProps;
  ShowMore?: React.FC<{ query: UseInfiniteQueryResult }>;
  isLoadingFullscreen?: boolean;
};

export const InfiniteQueryRenderer = <
  Item,
  Response extends { items: Item[] }
>({
  query,
  renderer,
  emptyPage,
}: InfiniteQueryRendererProps<Item, Response>) => {
  const nextPageLoadingSkeletons = (): Response["items"] => {
    if (query.isFetchingNextPage) {
      return Array.from({ length: 14 }, () =>
        Math.random()
      ) as Response["items"];
    }

    return [];
  };

  const fetchNextPage = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOnScroll = () => {
      if (
        targetRef.current &&
        targetRef.current.getBoundingClientRect().bottom <
          window.innerHeight + 350 &&
        (query as UseInfiniteQueryResult).fetchNextPage
      ) {
        (query as UseInfiniteQueryResult).fetchNextPage();
      }
    };

    addEventListener("scroll", fetchOnScroll);

    return () => {
      removeEventListener("scroll", fetchOnScroll);
    };
  }, [fetchNextPage, query]);

  if (query.isLoading || query.isIdle) {
    return renderer(
      Array.from({ length: 14 }, () => Math.random()) as Response["items"],
      query
    );
  }

  if (query.isError || !query.data) {
    return <ErrorPage onRetry={() => query.refetch()} />;
  }

  const items = flattenDeep(query.data.pages.map((x) => x.items));

  if (!query.isLoading && items && items.length === 0 && emptyPage) {
    return <EmptyPage {...emptyPage} />;
  }

  return (
    <>
      {renderer([...items, ...nextPageLoadingSkeletons()], query)}
      <div ref={targetRef} style={{ height: "1px" }} />
    </>
  );
};
