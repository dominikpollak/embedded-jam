import { Network, OutRef } from "lucid-cardano";

export type ScriptConstants = {
  deposit: number;
  treasuryFeeBasis: number;
  treasuryFeeIgnoreUntil: number;
  royaltyFeeIgnoreUntil: number;
  minTreasuryFee?: number;
  minRoyaltyFee?: number;
};

export type ScriptInfo = {
  address: string;
  paymentCred: string;
  scriptCborHex: string;
  treasuryAddress: string;
  type: "PlutusV1" | "PlutusV2";
  referenceUtxoRef?: OutRef;
};

export type ScriptConfig = ScriptConstants & ScriptInfo;

export type Config = Record<Network, Record<string, ScriptConfig>>;
