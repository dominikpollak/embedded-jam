import React from "react";
import UniversalSkeleton from "./UniversalSkeleton";

export const TabNftSkeleton: React.FC = () => {
  return (
    <section className="group relative grid-cols-1 w-full h-full pb-3 border-b border-border grid hover:border-text">
      {/* IMAGE */}
      <div className="relative w-full flex gap-4 flex-col col-span-2 items-start">
        <div className={`relative w-full h-full`}>
          <UniversalSkeleton height="100%" width="100%" margin="0 0 0px 0" />
        </div>

        {/* NAME */}
        <span className={`font-bold text-[18px] leading-6 h-[55px]`}>
          <UniversalSkeleton height="18px" width="250px" margin="0px 0 5px 0" />
        </span>
      </div>

      {/* COLLECTION */}
      <span className="flex flex-col justify-start w-full gap-[1px]">
        <UniversalSkeleton height="16px" width="60%" />
      </span>

      <span className="price flex w-full flex-col text-text text-right order-1 grid-row-span-2 ml-auto">
        {/* PRICE IN ADA */}
        <span className="text-[17px] leading-6 font-bold mb-0">
          <UniversalSkeleton height="18px" width="100%" margin="0px 0 0 auto" />
        </span>
        {/* PRICE IN DOLLARS */}
        <span className="text-grayText text-[14px] leading-4">
          <UniversalSkeleton height="15px" width="80%" margin="5px 0 0 auto" />
        </span>
      </span>
    </section>
  );
};
