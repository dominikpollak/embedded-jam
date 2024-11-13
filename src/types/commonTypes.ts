import { ReactNode } from "react";

export type DropdownOption =
  | {
      label: ReactNode;
      href?: string;
      onClick?: any;
    }
  | undefined;
