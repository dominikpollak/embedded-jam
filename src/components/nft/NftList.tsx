// import React from "react";
// import { usePendingTrades } from "../../hooks/usePendingTrades";
// import { UseInfiniteQueryResult } from "react-query";

// interface NftListProps {
//   query?: UseInfiniteQueryResult<ExploreNftsResponse, unknown>;
//   view: "grid" | "list" | "tab" | undefined;
//   owned?: boolean;
//   isFilterOpen?: boolean;
//   ownAssetOffer?: NftOffer;
//   setOpenTradeModal?: (
//     modal: TradeModal | null,
//     extraData: TradeModalData
//   ) => void;
//   hideCollectionName?: boolean;
// }

// export const NftList: React.FC<NftListProps> = ({
//   query,
//   view,
//   owned,
//   ownAssetOffer,
//   isFilterOpen,
//   setOpenTradeModal,
//   hideCollectionName,
// }) => {
//   const { pendingTrades } = usePendingTrades();
//   const tradesLength = Object.keys(pendingTrades).length;

//   React.useEffect(() => {
//     if (tradesLength === 0) {
//       query?.refetch();
//     }
//   }, [tradesLength]);

//   const renderItems = (items: any[]) => {
//     switch (view) {
//       case "tab":
//         return (
//           <TabItems
//             setOpenTradeModal={setOpenTradeModal}
//             items={items}
//             owned={owned}
//             ownAssetOffer={ownAssetOffer}
//             hideCollectionName={hideCollectionName}
//           />
//         );
//       case "grid":
//         return (
//           <GridItems
//             items={items}
//             owned={owned}
//             ownAssetOffer={ownAssetOffer}
//             setOpenTradeModal={setOpenTradeModal}
//             hideCollectionName={hideCollectionName}
//           />
//         );
//       case "list":
//         return (
//           <ListItems
//             items={items}
//             owned={owned}
//             ownAssetOffer={ownAssetOffer}
//             isFilterOpen={isFilterOpen}
//             setOpenTradeModal={setOpenTradeModal}
//             hideCollectionName={hideCollectionName}
//           />
//         );
//       default:
//         return (
//           <GridItems
//             items={items}
//             owned={owned}
//             ownAssetOffer={ownAssetOffer}
//             setOpenTradeModal={setOpenTradeModal}
//             hideCollectionName={hideCollectionName}
//           />
//         );
//     }
//   };

//   return (
//     <>
//       <InfiniteQueryRenderer
//         query={query as any}
//         renderer={renderItems}
//         emptyPage={{
//           title: "No NFTs found",
//           description: "You can browse NFTs in our marketplace!",
//           button: {
//             onClick: () => {
//               router.push(urls.exploreNfts);
//             },
//             label: "Browse NFTs",
//           },
//         }}
//         isLoadingFullscreen
//       />
//     </>
//   );
// };
