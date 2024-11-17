import React from "react";

export const Options: React.FC<React.ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div {...props} className="max-h-[200px] overflow-x-scroll hide-scrollbar">
      {children}
    </div>
  );
};

export const Field: React.FC<React.ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className="py-0 px-[12px] h-[32px] [&>svg]:text-grayText [&>svg]:ml-[10px] rounded-[2000px] border border-border shadow-sm bg-transparent flex justify-between items-center whitespace-nowrap"
    >
      {children}
    </div>
  );
};

export const FloatingLabel: React.FC<React.ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className="text-grayText top-[-4px] absolute bg-background rounded-[20px] px-[12px] whitespace-nowrap leading-[11px]"
    >
      {children}
    </div>
  );
};

export const ContextMenu: React.FC<
  React.ComponentProps<"div"> & {
    opento: "left" | "topRight" | "right";
  }
> = ({ children, opento, ...props }) => {
  return (
    <div
      {...props}
      className={`p-4 z-[1000] w-fit rounded-[20px] mt-[2px] origin-top shadow-md absolute bg-background flex flex-col ${
        opento === "left" ? "right-0" : ""
      } ${opento === "topRight" ? "right-0 top-[-290px]" : ""}`}
    >
      {children}
    </div>
  );
};

export const BaseOption: React.FC<React.ComponentProps<"button">> = ({
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className="py-[10px] px-4 rounded-[10px] border-none bg-transparent w-[17em] flex justify-between items-center whitespace-nowrap hover:bg-darkerBg active:bg-darkerBg"
    >
      {children}
    </button>
  );
};

export const Option: React.FC<React.ComponentProps<"button">> = ({
  children,
  ...props
}) => {
  return (
    <BaseOption
      {...props}
      className="whitespace-normal [&>span]:overflow-hidden [&>span]:text-ellipsis [&>svg]:ml-[5px] hover:bg-darkerBg active:bg-darkerBg"
    >
      {children}
    </BaseOption>
  );
};

export const SearchBox: React.FC<React.ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div {...props} className="mb-4 [&>div>input]:min-w-[150px] w-full">
      {children}
    </div>
  );
};
