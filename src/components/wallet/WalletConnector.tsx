import { Unlink, Wallet } from "lucide-react";
import React, { useEffect } from "react";
import { walletInfos } from "../../constants/wallet";
import { useConnectWallet } from "../../hooks/wallet/useConnectWallet";
import { useThemeColors } from "../../stores/useThemeColors";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { formatString, lovelaceToAda } from "../../utils/format";
import { getWalletBalance } from "../../utils/wallet/getWalletBalance";
import Button from "../global/Button";
import CopyButton from "../global/CopyButton";
import Dropdown from "../global/Dropdown";
import ConnectWalletModal from "./ConnectWalletModal";

interface Props {
  textColor?: string;
  bgColor?: string;
}

export const WalletConnector: React.FC<Props> = ({ textColor, bgColor }) => {
  WalletConnector.displayName = "WalletConnector";
  const { address, walletType, setWalletState, walletApi } = useWalletStore();
  const { setBgColor, setTextColor } = useThemeColors();
  const [showWalletModal, setShowWalletModal] = React.useState(false);
  const { disconnect } = useConnectWallet();

  const walletChannel = new BroadcastChannel("wallet_channel");
  const [balance, setBalance] = React.useState(0);

  useEffect(() => {
    const handleMessage = (event: any) => {
      const { type, payload } = event.data;
      switch (type) {
        case "WALLET_CONNECTED":
          setWalletState({
            address: payload.address,
            walletType: payload.walletType,
          });
          break;
        case "WALLET_DISCONNECTED":
          disconnect();
          break;
        default:
          break;
      }
    };
    const controller = new AbortController();
    const signal = controller.signal;

    walletChannel.addEventListener("message", handleMessage, { signal });

    return () => {
      controller.abort();
    };
  }, [disconnect]);

  useEffect(() => {
    if (address && walletType) {
      walletChannel.postMessage({
        type: "WALLET_CONNECTED",
        payload: { address, walletType },
      });
    }
  }, [address, walletType]);

  useEffect(() => {
    const getBalance = async () => {
      const balance = await getWalletBalance(walletApi!);
      if (balance !== undefined) {
        setBalance(Number(balance.coin().to_str()));
      }
    };

    if (address !== undefined && walletApi !== undefined) {
      getBalance();
    }
  }, [address, walletApi]);

  useEffect(() => {
    if (textColor && bgColor) {
      setBgColor(bgColor);
      setTextColor(textColor);
    }
  }, [textColor, bgColor]);

  return (
    <>
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      {!address && !walletType ? (
        <Button
          label={"Connect Wallet"}
          variant="secondary"
          size="md"
          leftIcon={<Wallet size={20} />}
          onClick={() => setShowWalletModal(true)}
        />
      ) : (
        <Dropdown
          id="wallet-dropdown"
          hideChevron
          label={
            <div className="box-border flex min-w-fit max-w-fit items-center justify-between rounded-[8px] border-2 border-secondaryText bg-secondaryBg px-4 py-2 text-sm font-medium text-secondaryText duration-150 hover:scale-[101%] active:scale-[98%] disabled:cursor-not-allowed disabled:opacity-50">
              <span className="mr-2">
                <img
                  className="h-[20px] min-h-[20px] w-[20px] min-w-[20px] shrink-0"
                  src={walletInfos[walletType!].icon}
                  alt="wallet"
                  height={20}
                  width={20}
                />
              </span>
              <span>{formatString(address?.split("1")[1] ?? "", "long")}</span>
            </div>
          }
          options={[
            {
              label: (
                <div className="flex cursor-default flex-col gap-3 hover:text-text">
                  <div className="mb-2 flex items-center justify-between gap-1 break-all">
                    <span>{formatString(address ?? "", "longer")}</span>
                    <CopyButton copyText={address ?? ""} />
                  </div>
                  <div className="flex w-full justify-between gap-1 text-sm">
                    <span className="">ADA Balance: </span>
                    <span className="">{lovelaceToAda(balance)}</span>
                  </div>
                </div>
              ),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Wallet size={15} />
                  Switch Wallet
                </span>
              ),
              onClick: () => setShowWalletModal(true),
            },
            {
              label: (
                <span className="flex items-center gap-2">
                  <Unlink size={15} />
                  Disconnect
                </span>
              ),
              onClick: () => {
                // if (walletType === "nufiSSO" || walletType === "nufiSnap") {
                //   nufiCoreSdk.getApi().hideWidget();
                // }
                disconnect();
                walletChannel.postMessage({ type: "WALLET_DISCONNECTED" });
              },
            },
          ]}
          width="250px"
        />
      )}
    </>
  );
};
