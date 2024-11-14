import { ReactNode } from "react";

export type DropdownOption =
  | {
      label: ReactNode;
      href?: string;
      onClick?: any;
    }
  | undefined;

export type Paginate = {
  cursor: string;
  hasNextPage: boolean;
};
