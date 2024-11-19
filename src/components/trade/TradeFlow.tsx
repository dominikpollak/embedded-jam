import React from "react";
import { TradeError } from "../../types/trade";
import {
  TradeModalError,
  TradeModalResult,
  TradeModalSuccess,
} from "./TradeModalResult";

type Step = "form" | "success";

type Props = {
  tradeState: ReturnType<typeof useTradeState>;
  onClose: () => void;
  successActionLabel?: string;
  successText: JSX.Element;
  explorerUrl: string;
  successInfoMessage: string;
  children: JSX.Element;
};

export const TradeFlow: React.FC<Props> = ({
  tradeState,
  onClose,
  successActionLabel,
  successText,
  explorerUrl,
  successInfoMessage,
  children,
}): React.ReactElement<TradeModalError | TradeModalSuccess> => {
  const { step, setStep, error, setError } = tradeState;

  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (error !== undefined) {
    return (
      <TradeModalResult
        error={error}
        action={() => {
          setError(undefined);
          setStep("form");
        }}
      />
    );
  }

  if (step === "success") {
    return (
      <TradeModalResult
        action={onClose}
        actionLabel={successActionLabel}
        successText={successText}
        explorerUrl={explorerUrl}
        infoMessage={successInfoMessage}
      />
    );
  }

  return children;
};

export const useTradeState = () => {
  const [step, setStep] = React.useState<Step>("form");
  const [error, setError] = React.useState<TradeError | any | undefined>(
    undefined
  );

  return { step, setStep, error, setError };
};
