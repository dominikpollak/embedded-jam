import React from "react";
import { rarityColors } from "../../../constants/colors";
import { RarityOrder } from "../../nft/RarityBadge";
import DoubleSlider from "../DoubleSlider";
import { JamDropdown } from "../dropdown/JamDropdown";
import { NumberInput } from "../inputs/NumberInput";
import { ErrorContainer, SearchFields, Wrapper } from "./PriceFilterParts";

type DotProps = {
  rarityOrder: RarityOrder;
};

type Props = {
  from: number | null;
  to: number | null;
  rarity: number[];
};

const Dot: React.FC<DotProps> = ({ rarityOrder }) => {
  return (
    <div
      style={{
        backgroundColor: rarityColors[rarityOrder].text,
      }}
      className={`w-4 h-4 rounded-[20px] inline-block relative mr-[17px] translate-y-[3px]`}
    ></div>
  );
};

const RarityFilter: React.FC<Props> = ({ from, to, rarity }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const [min, setMin] = React.useState(from);
  const [max, setMax] = React.useState(to);
  const [error, setError] = React.useState<null | string>(null);

  const raritiesOptions: Array<{
    name: string;
    value: number[];
    leftElement: JSX.Element;
  }> = [
    {
      name: "TOP 1%",
      value: [0, 1],
      leftElement: <Dot rarityOrder="1" />,
    },
    {
      name: "TOP 5%",
      value: [0, 5],
      leftElement: <Dot rarityOrder="2" />,
    },
    {
      name: "TOP 10%",
      value: [0, 10],
      leftElement: <Dot rarityOrder="3" />,
    },
    {
      name: "TOP 20%",
      value: [0, 20],
      leftElement: <Dot rarityOrder="4" />,
    },
    {
      name: "TOP 50%",
      value: [0, 50],
      leftElement: <Dot rarityOrder="5" />,
    },
  ];

  const handleSetRarities = (min: number, max: number) => {
    if (min !== undefined && max !== undefined && max > min) {
      urlParams.set("rarities", `${min}-${max}`);
    } else {
      urlParams.delete("rarities");
    }

    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  const handleInstantApply = (min: number, max: number) => {
    setMin(min);
    setMax(max);
  };

  React.useEffect(() => {
    setMin(from);
    setMax(to);
  }, [from, to]);

  React.useEffect(() => {
    setError(null);
  }, [min, max]);

  const handleApply = () => {
    if (min !== null && max !== null && min > max) {
      setError("Invalid rarity range");
      return;
    }
    handleSetRarities(min || 0, max || 0);
  };

  return (
    <Wrapper>
      <DoubleSlider
        key={`${from}-${to}`}
        onChange={handleInstantApply}
        onAfterChange={handleSetRarities}
        max={50}
        defaultValue={[from ?? 0, to ?? 50]}
      />
      <SearchFields>
        <NumberInput
          //   rightText="%"
          placeholder="From"
          value={min}
          onChange={setMin}
          onBlurCapture={handleApply}
          onEnterPress={handleApply}
          //   specialState={error ? "error" : undefined}
          min={0}
          maxValue={50}
        />
        <NumberInput
          //   rightText="%"
          placeholder="To"
          value={max}
          onChange={setMax}
          onBlurCapture={handleApply}
          onEnterPress={handleApply}
          //   specialState={error ? "error" : undefined}
          maxValue={50}
        />
        <JamDropdown
          style={{ width: "85px" }}
          label="rank"
          value={rarity ? [String(rarity[0]), String(rarity[1])] : []}
          selection="single"
          onChange={(value) => {
            handleSetRarities(Number(value[0][0]), Number(value[0][1]));
          }}
          options={raritiesOptions}
          openTo="left"
        />
      </SearchFields>
      {error && (
        <ErrorContainer>
          <span className="text-[13px] text-redText">{error}</span>
        </ErrorContainer>
      )}
    </Wrapper>
  );
};

export default RarityFilter;
