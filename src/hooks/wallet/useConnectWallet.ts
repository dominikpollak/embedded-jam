import { JamOnBreadProvider, JobCardano } from "@jamonbread/sdk";
import type { WalletApi } from "lucid-cardano";
import { Lucid } from "lucid-cardano";
import { useCookies } from "react-cookie";
import { v4 as uuidv4 } from "uuid";
import { postLogUser } from "../../services/postLogUser";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { WalletState, WalletType } from "../../types/wallet";
import { useUserTokens } from "../user/useUserTokens";

const defaultState: WalletState = {
  address: undefined,
  stakeKey: undefined,
  walletType: undefined,
  walletApi: undefined,
  disabledExt: false,
  job: null,
};

export const useConnectWallet = () => {
  const { setWalletState } = useWalletStore();
  const { tokens, removeToken } = useUserTokens();
  const [cookies, setCookie] = useCookies(["q"]);

  const _connect = async (walletType: WalletType) => {
    const apiUrl = "https://api.jamonbread.io/api/".replace(/^\/+|\/+$/g, "");
    const wallet =
      typeof window !== "undefined"
        ? window?.cardano && window.cardano?.[walletType]
        : undefined;
    const walletApi = await wallet?.enable();
    const provider = new JamOnBreadProvider(
      `https://api.jamonbread.io/api/lucid`
    );
    const lucid = await Lucid.new(provider, "Preprod");
    lucid.selectWallet(walletApi as WalletApi);
    const address = await lucid.wallet.address();
    const stakeKey = lucid.utils.stakeCredentialOf(address).hash;
    const job = new JobCardano(lucid, apiUrl);

    if (tokens[address] && new Date() >= new Date(tokens[address].expires)) {
      removeToken(address);
    }

    if (localStorage.getItem("disabled")) {
      setWalletState(defaultState);
      throw new Error("Wallet is disabled");
    }

    let userTrackCookie = cookies["q"];
    if (typeof userTrackCookie !== "string") {
      userTrackCookie = uuidv4();
      setCookie("q", userTrackCookie, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365 * 3,
      });
    }

    await postLogUser({
      address,
      cookie: userTrackCookie,
    });

    setWalletState({
      walletType,
      address,
      stakeKey,
      disabledExt: false,
      job,
      walletApi,
    });
  };

  const connect = async (walletType: WalletType) => {
    await _connect(walletType);
  };

  const disconnect = () => {
    setWalletState(defaultState);
  };

  return { connect, disconnect };
};
