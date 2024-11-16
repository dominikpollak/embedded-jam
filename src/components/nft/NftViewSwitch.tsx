import { Grid3X3, LayoutGrid, List } from "lucide-react";
import { colors } from "../../constants/colors";

export type Views = "grid" | "list" | "tab";

type Props = {
  view: Views | undefined;
  onChange: (newView: Views) => void;
  style?: React.CSSProperties;
};

export const NftListViewSwitch: React.FC<Props> = ({
  view,
  onChange,
  style,
}) => {
  const handleClick = (newView: Views) => {
    onChange(newView);
  };

  return (
    <>
      <div
        className="relative flex items-center bg-transparent text-text"
        style={style}
      >
        <span
          title="Grid view"
          className={`rounded-tl-[50px] rounded-bl-[50px] border-r-0 ${
            view === "tab" ? "bg-text text-bg" : ""
          } cursor-pointer items-center relative inline-flex h-[40px] border-[1px] border-border py-0 px-[10px]`}
          onClick={() => handleClick("tab")}
        >
          <LayoutGrid
            size={30}
            name="grid"
            color={view === "tab" ? colors.background : colors.text}
          />
        </span>
        <span
          title="Small grid view"
          className={`cursor-pointer items-center relative inline-flex h-[40px] border-[1px] border-border py-0 px-[10px] ${
            view === "grid" ? "bg-text text-bg" : ""
          } `}
          onClick={() => handleClick("grid")}
        >
          <Grid3X3
            size={30}
            name="row"
            color={view === "tab" ? colors.background : colors.text}
          />
        </span>
        <span
          title="Table view"
          className={`rounded-tr-[50px] rounded-br-[50px] border-l-0 cursor-pointer items-center relative inline-flex h-[40px] border-[1px] border-border py-0 px-[10px] ${
            view === "list" ? "bg-text text-bg" : ""
          }`}
          onClick={() => handleClick("list")}
        >
          <List
            size={30}
            name="list"
            color={view === "tab" ? colors.background : colors.text}
          />
        </span>
      </div>
    </>
  );
};
