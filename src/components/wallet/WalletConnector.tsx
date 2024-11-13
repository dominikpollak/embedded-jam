import React, { useEffect } from "react";
import { useWalletButtonData } from "../../hooks/wallet/useWalletButtonData";
import { useThemeColors } from "../../stores/useThemeColors";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { formatHash } from "../../utils/format";
import Button from "../global/Button";
import ConnectWalletModal from "./ConnectWalletModal";

interface Props {
  textColor: string;
  bgColor: string;
}

export const WalletConnector: React.FC<Props> = ({ textColor, bgColor }) => {
  WalletConnector.displayName = "WalletConnector";
  const { address, walletType, disabledExt } = useWalletStore();
  const { walletButtonData } = useWalletButtonData();
  const { setBgColor, setTextColor } = useThemeColors();
  const [showWalletModal, setShowWalletModal] = React.useState(false);

  const handleClick = () => {
    setShowWalletModal(true);
  };

  useEffect(() => {
    setBgColor(bgColor);
    setTextColor(textColor);
  }, [textColor, bgColor]);

  return (
    <>
      {showWalletModal && (
        <ConnectWalletModal onClose={() => setShowWalletModal(false)} />
      )}
      <Button
        variant="primary"
        onClick={handleClick}
        label={
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
