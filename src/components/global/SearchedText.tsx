import { colors } from "../../constants/colors";

type Props = {
  text: string;
  searchedValue: string;
  color?: keyof typeof colors;
  uppercase?: boolean;
};

export const SearchedText: React.FC<Props> = ({
  text,
  searchedValue,
  color,
  uppercase = true,
}) => {
  if (searchedValue === "")
    return (
      <span
        className="text-[13px] font-bold leading-[17px] uppercase break-all whitespace-normal"
        style={
          uppercase ? { textTransform: "uppercase" } : { textTransform: "none" }
        }
        color={color}
      >
        {text}
      </span>
    );

  const highlightedText = text.replace(
    new RegExp(`(${searchedValue})`, "gi"),
    (match, p1) => `<span style="color: #fd6f4d;">${p1}</span>`
  );

  return (
    <span
      className="text-[13px] font-bold leading-[17px] uppercase break-all whitespace-normal"
      color={color}
      style={
        uppercase ? { textTransform: "uppercase" } : { textTransform: "none" }
      }
      dangerouslySetInnerHTML={{ __html: highlightedText }}
    />
  );
};
