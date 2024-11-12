import type { ReactNode } from "react";
import React from "react";

type Props = {
  size: "xs" | "sm" | "md" | "lg" | "xl";
  variant: "primary" | "secondary" | "tertiary" | "purple";
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

  const variantClasses = {
    primary: "bg-primary text-white border-2 border-primary",
    secondary:
      "bg-secondaryBg text-secondaryText border-2 border-secondaryText",
    tertiary: "bg-background border border-border",
    purple: "bg-gradient-to-b from-purple-500 to-purple-700 text-white",
  };

  const commonClasses =
    "flex box-border max-w-fit justify-center min-w-fit items-center rounded-[8px] font-medium duration-150 hover:scale-[101%] active:scale-[98%] disabled:cursor-not-allowed disabled:opacity-50";

  if (href)
    return (
      <a
        href={href}
        className={`${commonClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        <span>{leftIcon}</span>
        {label && <span>{label}</span>}
        <span>{rightIcon}</span>
      </a>
    );

  return (
    <button
      onClick={onClick}
      className={`${commonClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
