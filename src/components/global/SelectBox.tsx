import { ChevronDown } from "lucide-react";
import React from "react";
import { colors } from "../../constants/colors";
import { useContextMenu } from "../../hooks/common/useContextMenu";
import { ContextMenu, Options } from "./dropdown/BaseDropdownParts";

type Props = {
  value: string;
  openTo?: "left" | "right";
  onChange: (values: string) => void;
  options: string[];
  size: "medium" | "small";
};
export const SelectBox: React.FC<Props> = ({
  value,
  options,
  onChange,
  openTo = "right",
  size,
}) => {
  const [label, setLabel] = React.useState(value);
  const { isOpen, toggle, contextMenuRef, menuOpenerRef } = useContextMenu();

  const handleSelection = (newValue: string) => {
    onChange(newValue);
    setLabel(newValue);
    toggle();
  };

  return (
    <div className="w-[100px] relative z-[3] text-text">
      <div
        onClick={toggle}
        ref={menuOpenerRef}
        className={`cursor-pointer border h-[42px] border-border bg-background shadow active:border-text py-1 px-4 rounded-[10px] relative flex justify-between items-center [&>svg]:text-grayText ${
          isOpen ? "active" : ""
        }`}
      >
        {size === "medium" && (
          <span className="text-[16px] leading-[30px] font-bold pr-[10px]">
            {label}
          </span>
        )}
        {size === "small" && (
          <span className="text-[13px] leading-[20px] pr-[10px]">{label}</span>
        )}
        <ChevronDown size={20} color={colors.text} />
      </div>

      {isOpen && (
        <ContextMenu ref={contextMenuRef} opento={openTo}>
          <Options>
            {options.map((option) => {
              return (
                <div
                  key={option}
                  className={`box-border cursor-pointer py-1 px-2 rounded-[10px] hover:bg-darker active:bg-darker bg-background ${
                    option === label ? "active" : ""
                  }`}
                  onClick={() => handleSelection(option)}
                >
                  {size === "medium" && (
                    <span className="text-[16px] leading-[30px] font-bold pr-[10px]">
                      {option}
                    </span>
                  )}
                  {size === "small" && (
                    <span className="text-[13px] leading-[20px] pr-[10px]">
                      {option}
                    </span>
                  )}
                </div>
              );
            })}
          </Options>
        </ContextMenu>
      )}
    </div>
  );
};
