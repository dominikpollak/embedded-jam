import React from "react";
import UniversalSkeleton from "./UniversalSkeleton";

export const ListNftSkeleton: React.FC<{ isFilterOpen?: boolean }> = ({
  isFilterOpen,
}) => {
  return (
    <section
      className={`group grid items-center grid-cols-4 xl:grid-cols-5 p-[15px] pr-0 border-b border-border ${
        isFilterOpen ? "lg:grid-cols-5" : "md:grid-cols-5 lg:grid-cols-6"
      }`}
    >
      {/* IMAGE */}
      <div className="relative xl:col-span-1 w-full flex items-center gap-4 col-span-2">
        <div className={`relative shrink-0 w-[45px] h-[45px]`}>
          <UniversalSkeleton height="50px" width="50px" />
        </div>

        {/* NAME */}
        <span
          className={`font-bold text-[14px] whitespace-nowrap overflow-hidden block text-ellipsis md:text-[16px] leading-[25px] `}
        >
          <UniversalSkeleton height="20px" width="150px" />
        </span>
      </div>

      {/* COLLECTION */}
      <span
        className={`nft-name hidden lg:block text-text text-[15px] ${
          isFilterOpen ? "lg:hidden" : "lg:block"
        }`}
      >
        <UniversalSkeleton height="20px" width="70%" />
      </span>

      {/* RARITY */}
      <UniversalSkeleton
        className={`hidden ${isFilterOpen ? "md:hidden" : "md:block"} lg:block`}
        height="20px"
        width="60%"
      />
      {/* {rarity ? (
          <RarityBadge
            percentage={rarity.percentage}
            nftsInCollection={collection?.nftsInCirculation || 0}
            order={rarity.order}
            className={`w-fit hidden ${
              isFilterOpen ? "md:hidden" : "md:block"
            } lg:block`}
          />
        ) : (
          <div className="h-[30px]" />
        )} */}

      <span className="price flex w-full justify-start flex-col text-text text-right">
        <UniversalSkeleton height="20px" width="60%" />
      </span>

      <div className="flex justify-end items-center ml-auto gap-[10px] w-[60px] mr-[15px]">
        <UniversalSkeleton
          height="34px"
          width="75px"
          borderRadius="20px"
          margin="0 0 0 auto"
        />
        <UniversalSkeleton
          height="34px"
          width="75px"
          borderRadius="20px"
          margin="0 0 0 auto"
        />
      </div>
    </section>
  );
};
