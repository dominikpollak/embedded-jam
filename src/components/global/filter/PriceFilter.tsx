import { isNull } from "lodash";
import React from "react";
import { NumberInput } from "../inputs/NumberInput";
import { ErrorContainer, SearchFields, Wrapper } from "./PriceFilterParts";
import { SelectBox } from "../SelectBox";
import DoubleSlider from "../DoubleSlider";

type Props = {
  minPrice: number | null;
  maxPrice: number | null;
  currency: string;
  floorPrice: number;
};

const PriceFilter: React.FC<Props> = ({
  minPrice,
  maxPrice,
  currency,
  floorPrice,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const [min, setMin] = React.useState(minPrice);
  const [max, setMax] = React.useState(maxPrice);
  const [error, setError] = React.useState<null | string>(null);

  const handleSetPrice = (min: number | null, max: number | null) => {
    if (!isNull(min)) urlParams.set("minPrice", min?.toString());
    else urlParams.delete("minPrice");

    if (!isNull(max)) urlParams.set("maxPrice", max?.toString());
    else urlParams.delete("maxPrice");

    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  const handleInstantSetPrice = (min: number | null, max: number | null) => {
    setMin(min);
    setMax(max);
  };

  const handleSetCurrency = (currency: string) => {
    if (!isNull(min) || !isNull(max)) urlParams.set("currency", currency);
    else urlParams.delete("currency");

    setSelectedCurrency(currency);
    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  const currencies = ["ada", "eur", "usd"];
  const [selectedCurrency, setSelectedCurrency] = React.useState(currency);

  React.useEffect(() => {
    setMin(minPrice);
    setMax(maxPrice);
    setSelectedCurrency(currency);
  }, [minPrice, maxPrice, currency]);

  React.useEffect(() => {
    setError(null);
  }, [min, max]);

  const handleApply = () => {
    if (min !== null && max !== null && min > max) {
      setError("Invalid price range");
      return;
    }
    handleSetPrice(min, max);
  };

  console.log("selectedCurrency", selectedCurrency);

  return (
    <Wrapper>
      <DoubleSlider
        key={`${minPrice}-${maxPrice}`}
        onChange={handleInstantSetPrice}
        onAfterChange={handleSetPrice}
        max={floorPrice ? floorPrice * 50 : 20000}
        min={floorPrice ? floorPrice : 1}
        defaultValue={[
          minPrice || 0,
          maxPrice ? maxPrice : floorPrice ? floorPrice * 50 : 20000,
        ]}
      />
      <SearchFields>
        <NumberInput
          placeholder="From"
          value={min}
          onChange={setMin}
          onBlurCapture={handleApply}
          onEnterPress={handleApply}
          //   specialState={error ? "error" : undefined}
          maxValue={floorPrice * 150 || 10000000}
        />
        <NumberInput
          placeholder="To"
          value={max}
          onChange={setMax}
          onBlurCapture={handleApply}
          onEnterPress={handleApply}
          //   specialState={error ? "error" : undefined}
          maxValue={floorPrice * 150 || 10000000}
        />
        <SelectBox
          value={selectedCurrency?.toUpperCase()}
          onChange={(x) => handleSetCurrency(x.toLowerCase())}
          options={currencies.map((x) => x.toUpperCase())}
          size="small"
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

export default PriceFilter;
