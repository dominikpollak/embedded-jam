import { useQuery } from "react-query";
import { ExchangeRates } from "../types/currency";
import { getUrl } from "../utils/getUrl";
import { customFetchHandler } from "./fetchWrapper";

export const fetchExchangeRates = async (): Promise<ExchangeRates> => {
  const res = await customFetchHandler({
    url: getUrl("coins/cardano/exchange-rates", {}),
  });
  return res.data as ExchangeRates;
};

export const useExchangeRates = () =>
  useQuery(useExchangeRates.__key, fetchExchangeRates, {
    staleTime: 1_000 * 60,
  });

useExchangeRates.__key = ["exchangeRates"];
