import React from "react";

interface Props {
  size?: number;
}

export const SpinningLoader: React.FC<Props> = ({ size = 8 }) => {
  return (
    <div
      className={`flex shrink-0 grow-0 h-${size} max-h-${size} max-w-${size} w-${size} animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-text motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
    ></div>
  );
};
