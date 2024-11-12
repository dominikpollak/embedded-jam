import React from "react";
import { useWalletButtonData } from "../../hooks/wallet/useWalletButtonData";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { formatHash } from "../../utils/format";
import Button from "../global/Button";
import ConnectWalletModal from "./ConnectWalletModal";

export type WalletButtonProps = {
  onOpenConnect: () => void;
  onOpenDropdown: () => void;
};

export const WalletConnector: React.FC = () => {
  WalletConnector.displayName = "WalletConnector";
  const { address, walletType, disabledExt } = useWalletStore();
  const { walletButtonData } = useWalletButtonData();
  const userProfileImageObject = walletButtonData.find(
    (data) => data.address === address
  );
  const [showWalletModal, setShowWalletModal] = React.useState(false);

  const handleClick = () => {
    setShowWalletModal(true);
  };

  const label = (
    <span>
      {/* <Icon name="wallet" color="text" width={28} height={28} /> */}
      <span className="connect-text">Connect Wallet</span>
    </span>
  );

  return (
    <>
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      <Button
        variant={"primary"}
        onClick={handleClick}
        label={
          // userProfileImageObject?.username
          //   ? formatUsername(userProfileImageObject.username, "short")
          //   : formatHash(address, "shorter")
          address ? formatHash(address, "shorter") : "Connect Wallet"
        }
        size="md"
        // leftIcon={
        //   disabledExt
        //     ? ""
        //     : walletButtonData.some(
        //         (obj) => obj.address === address && obj.url
        //       ) && !userProfileImageObject?.url.includes("ipfs")
        //     ? assetUrls.getThumbnail(userProfileImageObject?.url || "")
        //     : theme !== "light" &&
        //       walletInfos[walletType as WalletType].darkIcon
        //     ? walletInfos[walletType as WalletType].darkIcon
        //     : walletInfos[walletType as WalletType].icon
        // }
      />
    </>
  );
};
