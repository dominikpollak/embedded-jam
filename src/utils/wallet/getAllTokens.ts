import { toHex, WalletApi } from "lucid-cardano";
import { TokenBalance } from "../../types/wallet";
import { getWalletBalance } from "./getWalletBalance";

export async function getAllTokens(walletApi: WalletApi) {
  const balance = await getWalletBalance(walletApi);
  let res: TokenBalance[] = [];
  const ma = balance.multiasset();
  const keys = ma?.keys();

  const maLen = keys?.len();
  if (keys && maLen && ma) {
    for (let i = 0; i < maLen; i++) {
      const sh = keys.get(i);
      const pa = ma.get(sh);

      const an = pa?.keys();
      const anLen = an?.len();
      if (an && anLen && pa) {
        for (let j = 0; j < anLen; j++) {
          const asset = an.get(j);
          const balance = Number(pa.get(asset)?.to_str() || "0");
          res.push({
            assetName: toHex(asset.name()),
            policyId: toHex(sh.to_bytes()),
            balance,
          });
        }
      }
    }
  }
  return res;
}
