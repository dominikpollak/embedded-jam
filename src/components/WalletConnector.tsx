import React from "react";
import { useWalletStore } from "../stores/wallet/walletStore";
import { useWalletButtonData } from "../hooks/wallet/useWalletButtonData";
import { formatHash, formatUsername } from "../utils/format";

const ResponsiveButton = styled(Button)`
  height: 40px;
  width: 40px;
  padding: 0 5px;
  border: 1px solid ${colors.tertiary};

  ${media.desktopS} {
    width: auto;
  }

  span > span > svg {
    display: block;
  }

  span > span.connect-text {
    display: none;
    color: ${colors.text};
  }

  ${media.desktopS} {
    border: 2px solid ${colors.text};
    padding: 0 10px;
    span > span > svg {
      display: none;
    }
    span > span.connect-text {
      display: block;
    }
  }
`;

export type WalletButtonProps = {
  onOpenConnect: () => void;
  onOpenDropdown: () => void;
};

export const ConnectWalletButton : React.FC = () => {
  ConnectWalletButton.displayName = "ConnectWalletButton";
  const { address, walletType, disabledExt } = useWalletStore();
  const { walletButtonData } = useWalletButtonData();
  const userProfileImageObject = walletButtonData.find(
    (data) => data.address === address
  );

  const label = (
    <span>
      {/* <Icon name="wallet" color="text" width={28} height={28} /> */}
      <span className="connect-text">Connect Wallet</span>
    </span>
  );

  return address === undefined ? (
    <ResponsiveButton
      variant="secondary"
      size="small"
      onClick={onOpenConnect}
      ref={ref}
      label={label}
    />
  ) : (
    <div
      style={{ zIndex: "10", minWidth: "40px" }}
      className="mobile-button-connected"
    >
      <Button
        variant={disabledExt ? "grey" : "secondary"}
        onClick={onOpenDropdown}
        label={
          userProfileImageObject?.username
            ? formatUsername(userProfileImageObject.username, "short")
            : formatHash(address, "shorter")
        }
        size="small"
        leftIcon={disabledExt ? "lock" : undefined}
        leftImageUrl={
          disabledExt
            ? ""
            : walletButtonData.some(
                (obj) => obj.address === address && obj.url
              ) && !userProfileImageObject?.url.includes("ipfs")
            ? assetUrls.getThumbnail(userProfileImageObject?.url || "")
            : theme !== "light" &&
              walletInfos[walletType as WalletType].darkIcon
            ? walletInfos[walletType as WalletType].darkIcon
            : walletInfos[walletType as WalletType].icon
        }
        leftSize={23}
        title={disabledExt ? "Wallet extension is disabled" : undefined}
        rightIcon="chevron-down"
        rightSize={8}
        ref={ref}
      />
    </div>
  );
});
