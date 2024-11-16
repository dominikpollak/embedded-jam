import { Search, X } from "lucide-react";
import type { DOMAttributes } from "react";
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
        className={`${showSearchIcon && "pl-10"} pr-8 ${inputClassName}`}
        onKeyDown={onKeyDown}
      />
      {value && (
        <button className="absolute right-2" onClick={() => onchange("")}>
          <X size={20} color={colors.grayText} />
        </button>
      )}
    </div>
  );
};
