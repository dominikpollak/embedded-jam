import { Paginate } from "../types/commonTypes";

type SelectedOptions = [string, string][];

export const getNextPageParam = <T extends Paginate>(lastPage: T) => {
  if (!lastPage) return undefined;

  return lastPage.hasNextPage ? lastPage.cursor : undefined;
};

export const getPropertiesParams = (properties?: SelectedOptions) => {
  if (!properties || !properties.length) return undefined;
  return properties.map(
    ([key, value]: [string, string]) =>
      `[${encodeURIComponent(key)}]=${encodeURIComponent(value)}`
  );
};
export const getPropertiesFromParams = (values: string[]): SelectedOptions => {
  const decodedValues = values.map((value) => {
    const result = value.match(/\[(?<key>.*)\]=(?<value>.*)$/)?.groups;
    if (!result) {
      return undefined;
    }
    return [decodeURIComponent(result.key), decodeURIComponent(result.value)];
  });
  return decodedValues.filter(Boolean) as SelectedOptions;
};
