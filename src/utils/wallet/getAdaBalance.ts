import { WalletApi } from "lucid-cardano";
import { getWalletBalance } from "./getWalletBalance";

export async function getAdaBalance(walletApi: WalletApi): Promise<number> {
  const balance = await getWalletBalance(walletApi);
  return Number(balance.coin().to_str());
}
