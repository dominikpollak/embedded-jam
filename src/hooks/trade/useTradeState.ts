import React from "react";
import { TradeError } from "../../types/trade";

type Step = "form" | "success";

export const useTradeState = () => {
  const [step, setStep] = React.useState<Step>("form");
  const [error, setError] = React.useState<TradeError | any | undefined>(
    undefined
  );

  return { step, setStep, error, setError };
};
