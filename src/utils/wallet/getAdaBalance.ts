import { Buffer } from "buffer";
import { C, WalletApi } from "lucid-cardano";

export async function getBalance(walletApi: WalletApi) {
  const balance = await walletApi.getBalance();
  return C.Value.from_bytes(Buffer.from(balance, "hex"));
}

export async function getAdaBalance(walletApi: WalletApi): Promise<number> {
  const balance = await getBalance(walletApi);
  return Number(balance.coin().to_str());
}
