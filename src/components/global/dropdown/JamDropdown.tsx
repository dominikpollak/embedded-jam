import { Check, ChevronDown } from "lucide-react";
import React from "react";
import { colors } from "../../../constants/colors";
import { useContextMenu } from "../../../hooks/common/useContextMenu";
import Button from "../Button";
import { SearchedText } from "../SearchedText";
import { TextField } from "../TextField";
import {
  ContextMenu,
  Field,
  FloatingLabel,
  Option,
  Options,
  SearchBox,
} from "./BaseDropdownParts";

export const createLabel = (
  values: string[],
  defaultLabel: string,
  selection: "single" | "multiple",
  options?: Array<{
    name: string;
    value: string;
  }>
) => {
  if (values.length === 0) return { value: defaultLabel };

  const maxChars = 25;
  const usedValues = [];
  let fakeValues = 0;
  if (selection === "single" && options) {
    const singleValue = options.find((x) => x.value === values[0])?.name;
    if (singleValue === undefined) return { value: defaultLabel };
    return {
      value:
        singleValue.length <= maxChars
          ? singleValue
          : singleValue.slice(0, maxChars - 3) + "...",
    };
  }

  for (let value of values) {
    const usedChars =
      usedValues.reduce((acc, val) => acc + val.length, 0) +
      2 * (usedValues.length - 1);
    const newValue = options
      ? options.find((x) => x.value === value)?.name
      : value;
    if (!newValue) fakeValues++;
    else if (newValue && usedChars + newValue.length <= maxChars)
      usedValues.push(newValue);
  }

  if (usedValues.length === 0) {
    usedValues.push(values[0].slice(0, maxChars - 3) + "...");
  }

  return {
    value: usedValues.join(", "),
    hiddenValuesCount: values.length - usedValues.length - fakeValues,
  };
};

type Props = {
  style?: React.CSSProperties;
  label: string;
  value: string[];
  selection?: "single" | "multiple";
  openTo?: "left" | "right";
  onChange: (values: string[]) => void;
  maxSelections?: number;
  options: Array<{
    name: string;
    value: any;
    leftElement?: JSX.Element;
  }>;
  renderOption?: (option: {
    name: string;
    value: string;
    leftElement?: JSX.Element;
  }) => JSX.Element;
  renderSocials?: JSX.Element;
  className?: string;
};
export const JamDropdown: React.FC<Props> = ({
  label,
  options,
  value,
  onChange,
  selection = "multiple",
  openTo = "right",
  maxSelections,
  renderOption,
  className,
  renderSocials,
  style,
}) => {
  const { isOpen, toggle, contextMenuRef, menuOpenerRef } = useContextMenu();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState(value);

  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleToggleSelection = (value: string) => {
    if (selection === "single") {
      const newSelected = selected.includes(value) ? [] : [value];

      onChange(newSelected);
      setSelected(newSelected);

      toggle();
      return;
    }

    if (selected.includes(value))
      setSelected(selected.filter((x) => x !== value));
    else if (maxSelections == undefined || selected.length < maxSelections) {
      setSelected([...selected, value]);
    }
  };

  const handleClear = () => {
    setSelected([]);
    setSearch("");
  };

  const handleApply = () => {
    onChange(selected);
    toggle();
  };

  const actualLabel = createLabel(value, label, selection, options);

  const activeOptions = options.filter((x) =>
    x.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={style} text-text className={`relative ${className}`}>
      <Field
        role="button"
        className="cursor-pointer"
        onClick={toggle}
        ref={menuOpenerRef}
        style={{
          height: "42px",
        }}
      >
        <span className="text-[12px] leading-[16px] font-bold uppercase">
          {actualLabel.value}
        </span>
        {!!actualLabel.hiddenValuesCount && (
          <span className="text-[13px] leading-[17px] font-bold uppercase ml-2">
            {"+" + actualLabel.hiddenValuesCount}
          </span>
        )}
        <ChevronDown color={colors.text} size={15} />
        {value.length != 0 && <FloatingLabel>{label}</FloatingLabel>}
      </Field>

      {isOpen && (
        <ContextMenu ref={contextMenuRef} opento={openTo}>
          <div>
            {label === "collection" && (
              <SearchBox>
                <TextField
                  placeholder="Search collection"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  showSearchIcon
                />
              </SearchBox>
            )}
            <Options>
              {activeOptions.map((option) => {
                const active = selected.includes(option.value);

                return (
                  <Option
                    key={option.value}
                    className={active ? "active" : ""}
                    onClick={() => handleToggleSelection(option.value)}
                  >
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <>
                        {option.name
                          .toLowerCase()
                          .includes(search.toLowerCase()) && (
                          <div className="text-text flex">
                            {option.leftElement && option.leftElement}
                            <SearchedText
                              text={option.name}
                              searchedValue={search}
                            />
                          </div>
                        )}
                      </>
                    )}
                    {active && (
                      <Check className="ml-2" size={15} color={colors.text} />
                    )}
                  </Option>
                );
              })}
            </Options>
            {renderSocials}
          </div>

          {selection === "multiple" && (
            <div className="flex mt-4 w-full self-end first:mr-3 [&>*]:w-full">
              <Button
                variant="tertiary"
                size="sm"
                onClick={handleClear}
                label="CLEAR"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
                label="APPLY"
              />
            </div>
          )}
        </ContextMenu>
      )}
    </div>
  );
};
