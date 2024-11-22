import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { useConnectWallet } from "../../hooks/wallet/useConnectWallet";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { WalletType } from "../../types/wallet";
import { CollectionItems } from "./CollectionItems";

interface Props {
  theme: "light" | "dark" | "gray" | "darkBlue";
  affiliateLink: string;
}

const queryClient = new QueryClient();

export const CollectionItemsWithProvider: React.FC<Props> = ({
  theme,
  affiliateLink,
}) => {
  const { walletType, address, job } = useWalletStore();
  const { connect } = useConnectWallet();

  const tryReconnect = React.useCallback(
    async (type?: WalletType, ignoreSync?: boolean) => {
      if (walletType) {
        //ignoreSync prevents an infinite loop on reconnect
        await connect(type || walletType);
      }
    },
    [walletType]
  );

  React.useEffect(() => {
    tryReconnect(walletType, true);
  }, [walletType]);

  return (
    <QueryClientProvider client={queryClient}>
      <CollectionItems />
    </QueryClientProvider>
  );
};
