import React from "react";

export const Wrapper: React.FC<React.ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div {...props} className="relative flex flex-col mb-4">
      {children}
    </div>
  );
};

type ContextMenuProps = {
  openTo?: "left" | "right";
  bgcolor?: string;
};

export const ContextMenu: React.FC<
  React.ComponentProps<"div"> & ContextMenuProps
> = ({ children, openTo }) => {
  return (
    <div
      className={`p-4 rounded-[20px] origin-top shadow-md absolute bg-background flex flex-col z-[2] ${
        openTo === "left" ? "right-0" : ""
      }`}
    >
      {children}
    </div>
  );
};

export const Buttons: React.FC<React.ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className="flex mt-4 w-[246px] self-end [&>*:first-child]:mr-2 [&>*]:w-full"
    >
      {children}
    </div>
  );
};

export const SearchFields: React.FC<React.ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div {...props} className="flex gap-[5px] mt-4 w-full self-end">
      {children}
    </div>
  );
};

export const ErrorContainer: React.FC<React.ComponentProps<"div">> = ({
  children,
  ...props
}) => {
  return (
    <div {...props} className="mt-2 pl-2">
      {children}
    </div>
  );
};
