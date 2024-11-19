import React from "react";
import { useFormatPrice } from "../../../utils/format";
import { NumberInput } from "./NumberInput";

type Props = {
  state: ReturnType<typeof usePriceState>;
  originalPrice?: number;
  autofocus?: boolean;
};

export const PriceInput: React.FC<Props> = ({
  state,
  originalPrice,
  autofocus = false,
}) => {
  const formatPrice = useFormatPrice();
  const { price, setPrice, priceError, setPriceError } = state;

  React.useEffect(() => {
    setPrice(originalPrice || null);
  }, []);

  React.useEffect(() => {
    setPriceError(null);
  }, [price]);

  return (
    <div>
      <NumberInput
        autofocus={autofocus}
        placeholder="Price"
        value={price}
        onChange={setPrice}
        leftText="₳"
        // specialState={priceError ? "error" : undefined}
        maxValue={10000000}
        // rightText={formatPrice(
        //   price ? adaToLovelace(price) : undefined
        // ).toString()}
      />
      {/* {priceError && (
        <ErrorContainer>
          <SmallText color="error">{priceError}</SmallText>
        </ErrorContainer>
      )} */}
    </div>
  );
};

export type PriceState = ReturnType<typeof usePriceState>;

export const usePriceState = () => {
  const [priceError, setPriceError] = React.useState<string | null>(null);
  const [price, setPrice] = React.useState<number | null>(null);
  return { price, setPrice, priceError, setPriceError };
};
