import { JobCardano } from "@jamonbread/sdk";
import { WalletApi } from "lucid-cardano";

export type WalletType =
  | "nami"
  | "flint"
  | "yoroi"
  | "lace"
  | "vespr"
  | "eternl"
  | "begin"
  | "nufi"
  | "tokeo"
  | "nufiSSO"
  | "gerowallet"
  | "nufiSnap";

export type WalletState = {
  address: string | undefined;
  stakeKey: string | undefined;
  walletType: WalletType | undefined;
  walletApi: WalletApi | undefined;
  disabledExt?: boolean;
  job: JobCardano | null;
};

type WalletButtonData = {
  address: string;
  url: string;
  username: string | undefined;
};

export type WalletButtonDataState = {
  walletButtonData: WalletButtonData[];
  setWalletButtonData: (
    address: string,
    url: string,
    username: string | undefined
  ) => void;
};

export type WalletInfo = {
  name: string;
  icon: string;
  darkIcon?: string;
  unsuportedBrowsers: string[];
  hasMobileApp: boolean;
  extensionUrl: string;
};

export type TokenBalance = {
  assetName: string;
  policyId: string;
  balance: number;
};
