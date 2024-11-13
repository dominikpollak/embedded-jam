import type { FC } from "react";

import { Check, Copy as CopyIcon } from "lucide-react";

import React from "react";
import { useThemeColors } from "../../stores/useThemeColors";

interface CopyComponentProps {
  size?: number;
  copyText: string | null | undefined;
  className?: string;
}

const CopyButton: FC<CopyComponentProps> = ({
  size = 13,
  copyText,
  className,
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);
  const [alreadyCopied, setAlreadyCopied] = React.useState<boolean>(false);
  const { textColor } = useThemeColors();

  const handleCopy = () => {
    navigator.clipboard.writeText(copyText || "");
    setCopied(true);
    setAlreadyCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return copied ? (
    <Check className={`shrink-0 ${className}`} size={size} />
  ) : (
    <CopyIcon
      className={`shrink-0 ${className}`}
      size={size}
      cursor="pointer"
      onClick={handleCopy}
      color={alreadyCopied ? "var(--border)" : textColor}
    />
  );
};

export default CopyButton;
