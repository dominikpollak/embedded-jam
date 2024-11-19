import React from "react";

type Props = {
  value: boolean;
  onToggle: () => void;
  label: string;
  hasGap?: boolean;
};
export const Toggle: React.FC<Props> = ({
  value,
  onToggle,
  label,
  hasGap = false,
}) => {
  return (
    <div className={`flex ${hasGap ? "gap-[10px]" : ""}`}>
      <div
        className={`cursor-pointer items-center justify-start flex h-[25px] w-[44px] border border-border rounded-[100px] p-[5px] bg-transparent shadow-sm ${
          value ? "justify-end border-greenText bg-greenText" : ""
        }`}
        onClick={onToggle}
      >
        <div
          className={`w-[13px] h-[13px] rounded-[13px] ${
            value ? "bg-text" : "bg-border"
          }`}
        />
      </div>
      <span>{label}</span>
    </div>
  );
};
