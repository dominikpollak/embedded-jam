import { Ban, Check, CircleAlert, Info } from "lucide-react";
import React from "react";
import { colors } from "../../constants/colors";

type Props = {
  type: "error" | "info" | "success" | "warning";
  text: string | JSX.Element;
  link?: {
    name: string;
    href: string;
  };
};

const renderIcon = (type: string) => {
  switch (type) {
    case "error":
      return <Ban size={20} color={colors.redText} />;
    case "info":
      return <Info size={20} color={colors.text} />;
    case "success":
      return <Check size={20} color={colors.greenText} />;
    case "warning":
      return <CircleAlert size={20} color={colors.yellowText} />;
    default:
      return <Info size={20} color={colors.text} />;
  }
};

const renderColor = (type: string) => {
  switch (type) {
    case "error":
      return colors.redText;
    case "info":
      return colors.text;
    case "success":
      return colors.greenText;
    case "warning":
      return colors.yellowText;
    default:
      return colors.text;
  }
};

export const Message: React.FC<Props> = ({ text, link, type }) => {
  return (
    <div className="relative bg-darker rounded-[15px] flex items-center gap-[10px] p-[15px] text-[14px] [&>svg]:shrink-0">
      {renderIcon(type)}
      <div
        className="text-start"
        style={{
          color: renderColor(type),
        }}
      >
        <span className="text-[13px]">{text}</span>
        {link && (
          <a href={link.href} target="_blank" rel="noreferrer">
            <span className="text-[13px]">
              {" "}
              <ins>{link.name}</ins>
            </span>
          </a>
        )}
      </div>
    </div>
  );
};
