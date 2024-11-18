import React from "react";
import Button from "../Button";

type Props = {
  expand?: boolean;
  errorCode?: string;
  subTitle?: string;

  onRetry?: () => void;
};

export const ErrorPage: React.FC<Props> = ({
  expand = false,
  subTitle = "Well, this is unexpected",
  errorCode,
  onRetry,
}) => {
  return (
    <div
      className={`${
        expand ? "flex justify-center flex-col h-[calc(100vh-70px)]" : ""
      } my-0 mx-auto mb-0 text-center content-center max-w-[434px]`}
    >
      <div className="my-4">
        <h2>OOPS!</h2>
      </div>
      <p>{subTitle}</p>
      {errorCode && (
        <p className="mt-6 text-grayText">Error Code: {errorCode}</p>
      )}

      {onRetry && (
        <Button
          className="mt-6"
          variant="primary"
          onClick={onRetry}
          label="Retry"
          size="md"
        />
      )}
    </div>
  );
};
