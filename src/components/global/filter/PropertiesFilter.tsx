import _, { isEqual, orderBy } from "lodash";
import { Check, ChevronRight, X } from "lucide-react";
import React from "react";
import { UseQueryResult } from "react-query";
import { colors } from "../../../constants/colors";
import { CollectionDetailResponse } from "../../../types/collection";
import { getPropertyName } from "../../../utils/nft/nft";
import { getPropertiesFromParams } from "../../../utils/queryParams";
import { SearchedText } from "../SearchedText";
import { TextField } from "../TextField";
import { KeyOption, NestedOption } from "../dropdown/BaseDropdownParts";

type Props = {
  properties: string[];
  activeCollectionDetail:
    | UseQueryResult<CollectionDetailResponse, unknown>["data"]
    | null;
};

export type NestedFilterOptionsRenderer = [string, string][];

export const PropertiesFilter: React.FC<Props> = ({
  activeCollectionDetail,
  properties,
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  const options = _.mapValues(
    activeCollectionDetail?.properties,
    (value, name) => ({ label: getPropertyName(name), value })
  );

  const keys = Object.keys(options);
  const value = getPropertiesFromParams(properties);
  const [activeKey, setActiveKey] = React.useState(keys[0]);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState(value);

  const handleSetProperties = (value: [string, string][]) => {
    urlParams.delete("properties");

    value.forEach(([key, val]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedVal = encodeURIComponent(val);
      const propertyString = `[${encodedKey}]=${encodedVal}`;
      urlParams.append("properties", propertyString);
    });

    if (!urlParams.get("properties")) urlParams.delete("properties");

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${urlParams.toString()}`
    );
  };

  React.useEffect(() => {
    setSelected(getPropertiesFromParams(properties));
  }, [properties]);

  const handleToggleSelection = (key: string, value: string) => {
    const selection: [string, string] = [key, value];

    setSelected((prevSelected) => {
      let newSelected;
      if (prevSelected.some((property) => _.isEqual(property, selection))) {
        newSelected = prevSelected.filter(
          (property) => !_.isEqual(property, selection)
        );
      } else {
        newSelected = [...prevSelected, selection];
      }
      handleSetProperties(newSelected);
      return newSelected;
    });
  };

  const activeKeyvalues = !options[activeKey]
    ? []
    : orderBy(
        Object.entries(options[activeKey].value),
        ([_, nftCount]) => nftCount,
        "desc"
      ).filter(([key]) => key.toLowerCase().includes(search.toLowerCase()));

  const allKeyValues = React.useMemo(
    () =>
      keys.reduce((acc, key) => {
        if (!options[key]) {
          return acc;
        }

        const keyValues = orderBy(
          Object.entries(options[key].value),
          ([_, nftCount]) => nftCount,
          "desc"
        ).filter(([keyValue]) =>
          keyValue.toLowerCase().includes(search.toLowerCase())
        );

        return { ...acc, [key]: keyValues };
      }, {} as Record<string, typeof activeKeyvalues>),
    [keys, options, search]
  );

  const sortedKeys = [activeKey, ...Object.keys(allKeyValues)];
  const sortedValues = [
    allKeyValues[activeKey],
    ...Object.values(allKeyValues),
  ];

  const sortedAllKeyValues = sortedKeys.reduce((acc, key, index) => {
    return { ...acc, [key]: sortedValues[index] };
  }, {} as Record<string, typeof activeKeyvalues>);

  return (
    <div className="w-full flex flex-col">
      <div className="relative flex items-center my-[15px] mr-[10px] w-full">
        <TextField
          placeholder="Search property"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          showSearchIcon
          wrapperClassName="w-[236px] pr-[30px]"
        />
        {search.length > 0 && (
          <button
            className="absolute right-0 cursor-pointer border-none bg-transparent"
            onClick={() => setSearch("")}
          >
            <X size={20} color={colors.text} />
          </button>
        )}
      </div>
      <div className="w-full flex flex-col border border-border rounded-[10px] mb-4 shadow">
        <div className="w-full h-auto min-h-[81px] max-h-[171px] overflow-y-auto pt-[0px] thin-scrollbar">
          {keys.map((key) => {
            const isActive = activeKey === key;

            const selectedCount = selected.filter(([x]) => x === key).length;
            return (
              <KeyOption
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  backgroundColor: isActive
                    ? colors.darkerBg
                    : colors.background,
                }}
                key={key}
                onClick={() => setActiveKey(key)}
              >
                <span className="font-bold text-[13px]">
                  {options[key].label}
                </span>
                <div className="flex items-center gap-[5px] ml-auto w-fit">
                  {selectedCount > 0 && (
                    <span className="text-[13px] text-text shrink-0 grow-0 font-bold flex justify-center items-center bg-border rounded-full h-[20px] w-[20px] px-[7px] text-center">
                      {selectedCount}
                    </span>
                  )}
                  <span className="ml-auto text-[12px] leading-[20px] uppercase font-bold text-grayText">
                    {Object.keys(options[key].value).length}
                  </span>
                </div>

                <div className="flex items-center">
                  <ChevronRight color={colors.grayText} size={20} />
                </div>
              </KeyOption>
            );
          })}
        </div>
      </div>
      {!search ? (
        <div className="w-full flex flex-col border border-border rounded-[10px] mb-4 shadow">
          <div className="w-full min-h-[81px] max-h-[349px] overflow-y-auto pt-[10px] thin-scrollbar">
            <span className="font-bold pl-[10px]">{activeKey}</span>
            <div className="w-[calc(100%-20px)] h-[1px] bg-border mx-[10px] mt-[5px]" />
            {!activeKeyvalues.length && (
              <span className="font-bold w-full flex items-center justify-center h-[37px]">
                No results{" "}
              </span>
            )}
            {activeKeyvalues.map(([value, nftCount]) => {
              const isActive = selected.some((property) =>
                isEqual(property, [activeKey, value])
              );

              return (
                <NestedOption
                  style={{ width: "100%" }}
                  className={isActive ? "bg-darkerBg" : ""}
                  key={value}
                  onClick={() => handleToggleSelection(activeKey, value)}
                >
                  <div className="flex justify-between w-full">
                    <SearchedText
                      uppercase={false}
                      text={value}
                      searchedValue={search}
                    />
                    <span className="ml-auto text-[12px] leading-[20px] uppercase font-bold text-grayText">
                      &nbsp;{nftCount}
                    </span>
                  </div>
                  <div className="text-right pl-[10px] w-[20px]">
                    {isActive && <Check size={10} color={colors.text} />}
                  </div>
                </NestedOption>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col border border-border rounded-[10px] mb-4 shadow">
          {Object.entries(sortedAllKeyValues).every(
            ([_, keyValues]) => keyValues.length === 0
          ) && (
            <span className="font-bold w-full flex items-center justify-center h-[37px]">
              No results{" "}
            </span>
          )}

          <div className="w-full min-h-[81px] max-h-[349px] pt-[10px] thin-scrollbar">
            {Object.entries(sortedAllKeyValues).map(([key, keyValues]) => (
              <>
                {keyValues.length > 0 && (
                  <div className="mt-[0px]" key={key}>
                    <span className="font-bold" style={{ padding: "0px 10px" }}>
                      {key}
                    </span>
                    <div className="w-[calc(100%-20px)] h-[1px] bg-border mx-[10px] mt-[5px]" />

                    {keyValues.map(([keyValue, nftCount], index) => {
                      const isActive = selected.some((property) =>
                        isEqual(property, [activeKey, keyValue])
                      );

                      return (
                        <NestedOption
                          style={{ width: "100%" }}
                          className={isActive ? "active" : ""}
                          key={keyValue}
                          onClick={() => handleToggleSelection(key, keyValue)}
                        >
                          <div className="w-full flex justify-between">
                            <SearchedText
                              uppercase={false}
                              text={keyValue}
                              searchedValue={search}
                            />
                            <span className="ml-auto text-[12px] leading-[20px] uppercase font-bold text-grayText">
                              &nbsp;{nftCount}
                            </span>
                          </div>
                          <div className="text-right w-[20px]">
                            {isActive && (
                              <Check size={10} color={colors.text} />
                            )}
                          </div>
                        </NestedOption>
                      );
                    })}
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
