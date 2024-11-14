import type { ReactNode } from "react";
import React from "react";

type Props = {
  size: "xs" | "sm" | "md" | "lg" | "xl";
  variant: "primary" | "secondary" | "tertiary";
  label?: ReactNode;
  href?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const Button: React.FC<Props> = ({
  size,
  variant,
  label,
  href,
  rightIcon,
  leftIcon,
  className,
  disabled,
  onClick,
}) => {
  const sizeClasses = {
    xs: "py-1 px-1 text-[12px]",
    sm: "py-2 px-3 text-[13px]",
    md: "py-2 px-4 text-sm",
    lg: "py-2 px-4 text-md",
    xl: "py-3 px-5 text-lg",
  };

  const commonClasses =
    "flex box-border max-w-fit justify-center min-w-fit items-center rounded-[8px] font-medium duration-150 hover:scale-[101%] active:scale-[98%] disabled:cursor-not-allowed disabled:opacity-50";

  const variantClasses = {
    primary: "bg-text text-background border-text border hover:border-text",
    secondary: "bg-transparent text-text border-text border hover:border-text",
    tertiary:
      "bg-transparent text-grayText border-grayText border hover:border-grayText",
  };

  if (href)
    return (
      <a
        href={href}
        className={`${commonClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      >
        <span>{leftIcon}</span>
        {label && <span>{label}</span>}
        <span>{rightIcon}</span>
      </a>
    );

  return (
    <button
      onClick={onClick}
      className={`${commonClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
    >
      <span className={`${leftIcon && label && "mr-2"}`}>{leftIcon}</span>
      {label && <span>{label}</span>}
      {rightIcon && (
        <span className={`${rightIcon && "ml-2"}`}>{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
