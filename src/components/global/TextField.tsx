import { Search } from "lucide-react";
import type { DOMAttributes } from "react";
import React from "react";
import { colors } from "../../constants/colors";

export interface TextFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "size" | "onBlur" | "onFocus" | "value" | "color"
  > {
  placeholder: string;
  className?: string;
  showSearchIcon?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
  options?: React.HTMLInputTypeAttribute;
  outline?: boolean;
  onKeyDown?: DOMAttributes<HTMLInputElement>["onKeyDown"];
  value: string;
  onEnterPress?: (e: React.BaseSyntheticEvent) => void;
  rightText?: string;
  width?: number;
  leftText?: string;
  errorMessage?: string;
  multiline?: boolean;
  autofocus?: boolean;
  ignoreIFrameTheme?: boolean;
}

export const TextField = ({
  placeholder,
  value,
  inputClassName,
  wrapperClassName,
  showSearchIcon,
  onKeyDown,
  onEnterPress,
  ...rest
}: TextFieldProps) => {
  return (
    <div
      className={`relative flex shrink w-full items-center ${wrapperClassName}`}
    >
      {showSearchIcon && (
        <Search
          size={20}
          className={`absolute left-3`}
          color={colors.grayText}
        />
      )}
      <input
        value={value}
        placeholder={placeholder}
        className={`p-2 bg-background border border-border w-full rounded-lg ${
          showSearchIcon && "pl-10"
        } ${inputClassName}`}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (onEnterPress) {
              onEnterPress(e);
            }
          }
        }}
        {...rest}
      />
    </div>
  );
};
