import { format } from "date-fns";
import { useExchangeRates } from "../services/exchangeRates";
import { usePreferredCurrency } from "../stores/wallet/usePreferredCurrency";
import { ExchangeRates, NationalCurrencies } from "../types/currency";

export const formatUsername = (username: string, type: "short" | "long") => {
  if (type === "short") {
    if (username.length < 11) return username;

    return username.slice(0, 8) + "...";
  } else {
    if (username.length < 17) return username;

    return username.slice(0, 15) + "...";
  }
};

export const cropString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength / 2 - 4) + "..." + str.slice(-maxLength / 2);
};

export const lovelaceToAda = (lovelace?: number): string => {
  if (lovelace === undefined) return "0";

  const ada = lovelace / 1e6;

  return `₳ ${formatNumberWithSuffix(ada)}`;
};

const lovelaceToAdaWithoutSuffix = (lovelace: number): number => {
  return lovelace / 1e6;
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

export const adaToLovelace = (value: number) => {
  return Math.round(value * 1_000_000);
};

export const priceOrAdaToLovelace = (
  value: number,
  targetCurrency: NationalCurrencies | "ada",
  exchangeRates: ExchangeRates | undefined
): number | undefined => {
  console.log("priceOrAdaToLovelace", value, targetCurrency, exchangeRates);
  if (targetCurrency === "ada") return adaToLovelace(value);
  if (exchangeRates === undefined) return undefined;
  return priceToLovelace(value, targetCurrency, exchangeRates);
};

export const lovelaceToPrice = (
  value: number,
  targetCurrency: NationalCurrencies,
  exchangeRates: ExchangeRates
): number | undefined => {
  const ada = lovelaceToAdaWithoutSuffix(value);
  return exchangeRates ? ada * exchangeRates[targetCurrency] : undefined;
};

export const formatHash = (
  hash?: string,
  trim?: "short" | "shorter" | "normal"
) => {
  if (hash === undefined || hash === null) return "";
  const trimmed = hash.replace("addr_test", "").replace("addr", "");

  if (trim === "shorter") {
    const text =
      trimmed.length <= 12
        ? trimmed
        : trimmed.substring(0, 4) +
          "..." +
          trimmed.substring(trimmed.length - 4);
    return text;
  } else if (trim === "short") {
    const text =
      trimmed.length <= 12
        ? trimmed
        : trimmed.substring(0, 6) +
          "..." +
          trimmed.substring(trimmed.length - 6);
    return text;
  } else {
    const text =
      trimmed.length <= 16
        ? trimmed
        : trimmed.substring(0, 8) +
          "..." +
          trimmed.substring(trimmed.length - 8);
    return text;
  }
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatString = (
  text: string | null,
  type: "short" | "long" | "shorter" | "longer",
  startIndex?: number
) => {
  if (!text) return;

  const startFromIndex = startIndex || 0;
  if (type === "short") {
    return `${text.slice(
      0 + startFromIndex,
      5 + startFromIndex
    )}...${text.slice(-5)}`;
  }

  if (type === "shorter") {
    return `${text.slice(
      0 + startFromIndex,
      4 + startFromIndex
    )}...${text.slice(-4)}`;
  }

  if (type === "longer") {
    return `${text.slice(
      0 + startFromIndex,
      11 + startFromIndex
    )}...${text.slice(-11)}`;
  }

  return `${text.slice(0 + startFromIndex, 8 + startFromIndex)}...${text.slice(
    -8
  )}`;
};

export const formatNumberWithSuffix = (
  num: number,
  removeUnusedZeroes?: boolean,
  numberOfDecimals?: number
): string => {
  switch (true) {
    case num >= 1e9:
      return (num / 1e9).toFixed(numberOfDecimals ?? 2) + "B";
    case num >= 1e6:
      return (num / 1e6).toFixed(numberOfDecimals ?? 2) + "M";
    case num >= 1e3:
      return (num / 1e3).toFixed(numberOfDecimals ?? 2) + "k";
    default:
      return num.toFixed(removeUnusedZeroes ? 0 : 2) + "";
  }
};

export const formatTableDate = (value: string) =>
  format(new Date(value), "MMM dd y");

export const formatTableTime = (value: string) =>
  format(new Date(value), "h:mm aa");

export const formatNumber = (
  value?: number,
  config: FormatAdaConfig = defaultFormatAdaConfig
) => {
  if (!value) return "0";
  const currencyConfig = config.currency
    ? {
        currency: config.currency.toUpperCase(),
        style: "currency" as const,
      }
    : {};

  const isInteger = Number.isInteger(value);

  const precision = isInteger ? 0 : 1;

  return Intl.NumberFormat("en-US", {
    notation: config.truncatedValues ? "compact" : "standard",
    maximumSignificantDigits: config.significantDigits,
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
    ...currencyConfig,
  }).format(value);
};

type FormatAdaConfig = {
  truncatedValues?: boolean;
  significantDigits?: number;
  includeSuffix?: boolean;
  currency?: NationalCurrencies;
};
const defaultFormatAdaConfig: FormatAdaConfig = {
  truncatedValues: true,
  includeSuffix: true,
};

export const formatVolume = (
  value?: number,
  config: FormatAdaConfig = defaultFormatAdaConfig
) => {
  if (!value) return 0;
  const currencyConfig = config.currency
    ? {
        currency: config.currency.toUpperCase(),
        style: "currency" as const,
      }
    : {};
  return Intl.NumberFormat("en-US", {
    notation: config.truncatedValues ? "compact" : "standard",
    maximumSignificantDigits: config.significantDigits,
    ...currencyConfig,
  }).format(value);
};

export const useFormatPrice = () => {
  const { data: exchangeRates } = useExchangeRates();
  const { preferredCurrency } = usePreferredCurrency();
  const formatPrice = (
    lovelace: number | undefined,
    config?: FormatAdaConfig
  ) => {
    const _config = {
      ...defaultFormatAdaConfig,
      ...config,
      currency: preferredCurrency,
    };
    if (lovelace === undefined || exchangeRates === undefined) return "-";

    return formatNumber(
      lovelaceToPrice(lovelace, preferredCurrency, exchangeRates),
      _config
    );
  };
  return formatPrice;
};

const defaultFormatFullPriceConfig: FormatAdaConfig = {
  truncatedValues: false,
  significantDigits: 3,
};

export const useFormatFullPrice = () => {
  const { data: exchangeRates } = useExchangeRates();
  const { preferredCurrency } = usePreferredCurrency();

  const formatFullPrice = (
    lovelace: number | undefined,
    config?: FormatAdaConfig
  ) => {
    const _config = {
      ...defaultFormatFullPriceConfig,
      ...config,
      currency: preferredCurrency,
    };
    if (!lovelace || !exchangeRates) return "-";

    return formatNumber(
      lovelaceToPrice(lovelace, preferredCurrency, exchangeRates),
      _config
    );
  };
  return formatFullPrice;
};

export const formatNumberWithCommas = (number: number) => {
  return number.toLocaleString();
};

export const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  } else if (diffInSeconds < 3600) {
    // less than 1 hour
    return `${Math.floor(diffInSeconds / 60)}m ago`;
  } else if (diffInSeconds < 86400) {
    // less than 1 day
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  } else if (diffInSeconds < 604800) {
    // less than 1 week
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  } else if (diffInSeconds < 2592000) {
    // less than 1 month
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  } else if (diffInSeconds < 31536000) {
    // less than 1 year
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  } else {
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  }
};
