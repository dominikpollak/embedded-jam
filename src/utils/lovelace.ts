import { ExchangeRates, NationalCurrencies } from "../types/currency";

export const adaToLovelace = (value: number) => {
  return Math.round(value * 1_000_000);
};
export const lovelaceToAda = (value: number) => {
  return value / 1_000_000;
};
export const lovelaceToPrice = (
  value: number,
  targetCurrency: NationalCurrencies,
  exchangeRates: ExchangeRates
): number | undefined => {
  const ada = lovelaceToAda(value);
  return exchangeRates ? ada * exchangeRates[targetCurrency] : undefined;
};
export const priceToLovelace = (
  value: number,
  targetCurrency: NationalCurrencies,
  exchangeRates: ExchangeRates | undefined
): number | undefined => {
  return exchangeRates
    ? adaToLovelace(value / exchangeRates[targetCurrency])
    : undefined;
};
export const priceOrAdaToLovelace = (
  value: number,
  targetCurrency: NationalCurrencies | "ada",
  exchangeRates: ExchangeRates | undefined
): number | undefined => {
  if (targetCurrency === "ada") return adaToLovelace(value);
  if (exchangeRates === undefined) return undefined;
  return priceToLovelace(value, targetCurrency, exchangeRates);
};
