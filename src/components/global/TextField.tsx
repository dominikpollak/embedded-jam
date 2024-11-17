import { Search } from "lucide-react";
import type { DOMAttributes } from "react";
import React from "react";
import { colors } from "../../constants/colors";

type Props = {
  placeholder: string;
  className?: string;
  value: string;
  onchange: (e: any) => void;
  showSearchIcon?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
  options?: React.HTMLInputTypeAttribute;
  outline?: boolean;
  onKeyDown?: DOMAttributes<HTMLInputElement>["onKeyDown"];
};

export const TextField = ({
  placeholder,
  value,
  onchange,
  inputClassName,
  wrapperClassName,
  showSearchIcon,
  onKeyDown,
}: Props) => {
  return (
    <div className={`relative flex items-center ${wrapperClassName}`}>
      {showSearchIcon && (
        <Search
          size={20}
          className={`absolute left-3`}
          color={colors.grayText}
        />
      )}
      <input
        value={value}
        onChange={onchange}
        placeholder={placeholder}
        className={`p-2 bg-background border border-border rounded-lg ${
          showSearchIcon && "pl-10"
        } pr-8 ${inputClassName}`}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};
