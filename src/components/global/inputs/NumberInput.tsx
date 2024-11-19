import React from "react";
import { TextField, TextFieldProps } from "../TextField";

type Props = Omit<TextFieldProps, "onChange" | "value"> & {
  maxValue?: number;
  value: number | null;
  integerOnly?: boolean;
  onChange: (value: number | null) => void;
  autofocus?: boolean;
};

export const NumberInput: React.FC<Props> = ({
  maxValue,
  autofocus,
  value,
  ...props
}) => {
  const [inputValue, setInputValue] = React.useState(
    value ? value.toString() : ""
  );

  React.useEffect(() => {
    setInputValue(value ? value.toString() : "");
  }, [value]);

  const handleInputChange = (newValue: string) => {
    const sanitizedValue = newValue.replace(/[^\d.,]/g, "");
    const commaDotCount = sanitizedValue.split(/[,.]/).length - 1;

    if (commaDotCount <= 1) {
      const formattedValue = sanitizedValue.replace(",", ".");
      setInputValue(formattedValue);

      if (/^[0-9]*\.?[0-9]*$/.test(formattedValue)) {
        let numericValue = parseFloat(formattedValue);
        if (!isNaN(numericValue)) {
          if (maxValue && numericValue >= maxValue) {
            setInputValue(maxValue.toString()); // Add this line
            props.onChange(maxValue);
            return;
          }
          props.onChange(numericValue);
        } else {
          props.onChange(null);
        }
      }
    }
  };

  return (
    <TextField
      {...props}
      autoFocus={autofocus}
      onChange={() => {}}
      type="text"
      value={inputValue}
      onInput={(event) => handleInputChange(event.currentTarget.value)}
      lang="en-US"
      min={0}
    />
  );
};
