import React from "react";

type Props = {
  height: string;
  width: string;
  maxHeight?: string;
  maxWidth?: string;
  margin?: string;
  borderRadius?: string;
  className?: string;
};

const UniversalSkeleton: React.FC<Props> = ({
  height,
  width,
  maxHeight,
  maxWidth,
  margin,
  borderRadius,
  className,
}) => {
  const styles = {
    height,
    width,
    maxHeight: maxHeight || "100%",
    maxWidth: maxWidth || "100%",
    margin: margin || "0",
    borderRadius: borderRadius || "10px",
    opacity: 0.2,
  };

  return (
    <div
      className={`aspect-w-1 shimmer bg-shimmer aspect-h-1 ${className}`}
      style={styles}
    />
  );
};

export default UniversalSkeleton;
