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

export type SortOrder =
  | "recently_listed"
  | "least_recently_listed"
  | "price_low_to_high"
  | "price_high_to_low"
  | "rarity_low_to_high"
  | "rarity_high_to_low";

export type Timespans = "all" | "12h" | "24h" | "7d" | "30d";

export type Views = "grid" | "list" | "tab";
