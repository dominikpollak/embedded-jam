import React from "react";
import { walletInfos } from "../../constants/wallet";
import { useThemeColors } from "../../stores/useThemeColors";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { WalletType } from "../../types/wallet";

type Props = {
  name: WalletType;
  onConnect: () => void;
  onInstall: () => void;
  isInstalled: boolean;
  supported?: boolean;
};

const WalletOption: React.FC<Props> = ({
  name,
  onConnect,
  isInstalled,
  onInstall,
  supported = false,
}) => {
  const { walletType } = useWalletStore();
  const { bgColor, textColor } = useThemeColors();

  return (
    <button
      className={`relative mb-[15px] flex h-20 w-full items-center justify-between hover:border-[${textColor}] rounded-xl border border-border py-[20px] pl-[65px] pr-[15px] ${
        supported && walletType !== name
          ? "cursor-pointer border border-border hover:text-link"
          : "cursor-not-allowed"
      }`}
      onClick={
        !supported || walletType === name
          ? () => {}
          : isInstalled
          ? onConnect
          : onInstall
      }
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div className="absolute left-[25px] top-1/2 -translate-y-1/2">
        <img
          alt="Wallet image"
          src={
            // theme === "dark" && walletInfos[name]?.darkIcon
            //   ? walletInfos[name].darkIcon!
            //   :
            walletInfos[name]?.icon
          }
          width={30}
          height={30}
        />
      </div>
      <span className="flex items-center text-lg font-medium">
        {walletInfos[name]?.name.slice(0, 1).toUpperCase() +
          walletInfos[name]?.name.slice(1)}
      </span>
      {walletType === name && (
        <span className="flex items-center text-sm font-bold text-green-500">
          Connected
        </span>
      )}
      {!isInstalled && (
        <div className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white">
          Install
        </div>
      )}
      <div className="absolute bottom-[3px] right-4 text-[10px] text-red-500">
        {!supported && "Unsupported browser or device"}
      </div>
    </button>
  );
};

export default WalletOption;
