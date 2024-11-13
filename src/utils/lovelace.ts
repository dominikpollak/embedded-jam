import { ExchangeRates, NationalCurrencies } from "../types/currency";
import { formatNumberWithSuffix } from "./format";

export const lovelaceToAda = (lovelace: number): string => {
  const ada = lovelace / 1e6;

  return `₳ ${formatNumberWithSuffix(ada)}`;
};

const lovelaceToAdaWithoutSuffix = (lovelace: number): number => {
  return lovelace / 1e6;
};

export const lovelaceToPrice = (
  value: number,
  targetCurrency: NationalCurrencies,
  exchangeRates: ExchangeRates
): number | undefined => {
  const ada = lovelaceToAdaWithoutSuffix(value);
  return exchangeRates ? ada * exchangeRates[targetCurrency] : undefined;
};

export const priceToLovelace = (
  value: number,
  targetCurrency: NationalCurrencies,
  exchangeRates: ExchangeRates | undefined
): number | undefined => {
  return exchangeRates
    ? lovelaceToAdaWithoutSuffix(value / exchangeRates[targetCurrency])
    : undefined;
};
export const priceOrAdaToLovelace = (
  value: number,
  targetCurrency: NationalCurrencies | "ada",
  exchangeRates: ExchangeRates | undefined
): number | undefined => {
  if (targetCurrency === "ada") return lovelaceToAdaWithoutSuffix(value);
  if (exchangeRates === undefined) return undefined;
  return priceToLovelace(value, targetCurrency, exchangeRates);
};
