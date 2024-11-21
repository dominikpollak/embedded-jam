import React from "react";

export const Options = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className="max-h-[200px] overflow-x-scroll hide-scrollbar"
    >
      {children}
    </div>
  );
});

export const Field = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className="py-0 px-[12px] h-[32px] [&>svg]:text-grayText [&>svg]:ml-[10px] rounded-[2000px] border border-border shadow-sm bg-transparent flex justify-between items-center whitespace-nowrap"
    >
      {children}
    </div>
  );
});

export const FloatingLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className="text-grayText uppercase top-[-4px] text-[11px] font-medium absolute bg-background rounded-[20px] px-[12px] whitespace-nowrap leading-[11px]"
    >
      {children}
    </div>
  );
});

export const ContextMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    opento: "left" | "topRight" | "right";
  }
>(({ children, opento, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className={`z-[1000] w-fit rounded-lg mt-[2px] origin-top shadow-md absolute bg-background flex flex-col ${
        opento === "left" ? "right-0" : ""
      } ${opento === "topRight" ? "right-0 top-[-290px]" : ""}`}
    >
      {children}
    </div>
  );
});

export const BaseOption = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ children, ...props }, ref) => {
  return (
    <button
      {...props}
      ref={ref}
      className="py-[10px] px-4 rounded-lg border-none bg-transparent w-[17em] flex justify-between items-center whitespace-nowrap hover:bg-darkerBg active:bg-darkerBg"
    >
      {children}
    </button>
  );
});

export const Option = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ children, ...props }, ref) => {
  return (
    <BaseOption
      {...props}
      ref={ref}
      className="whitespace-normal [&>span]:overflow-hidden text-[12px] leading-[16px] [&>span]:text-ellipsis [&>svg]:ml-[5px] hover:bg-darkerBg active:bg-darkerBg"
    >
      {children}
    </BaseOption>
  );
});

export const SearchBox = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ children, ...props }, ref) => {
  return (
    <div
      {...props}
      ref={ref}
      className="mb-4 h-[40px] [&>div>input]:min-w-[150px] w-full"
    >
      {children}
    </div>
  );
});

export const NestedOption = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { hovercolor?: string }
>(({ children, hovercolor, ...props }, ref) => {
  return (
    <BaseOption
      {...props}
      ref={ref}
      className="whitespace-normal [&>div]:overflow-hidden [&>div]:text-ellipsis text-left  hover:bg-darkerBg active:bg-darkerBg"
    >
      {children}
    </BaseOption>
  );
});

export const KeyOption = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ children, ...props }, ref) => {
  return (
    <BaseOption
      {...props}
      ref={ref}
      className="whitespace-normal [&>span]:inline-block rounded-none border-r border-darker bg-transparent hover:bg-darkerBg active:bg-darkerBg [&>span]:pr-2 [&>span]:overflow-hidden [&>span]:text-ellipsis text-left"
    >
      {children}
    </BaseOption>
  );
});
