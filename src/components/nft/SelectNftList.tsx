import React from "react";
import { useNftInfo } from "../../services/nft";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { NftInfo } from "../../types/nft";
import { TokenBalance } from "../../types/wallet";
import { getAssetFingerprint } from "../../utils/nft/nft";
import { getAllTokens } from "../../utils/wallet/getAllTokens";
import { QueryRenderer } from "../global/QueryRenderer";
import { ModalBase } from "../trade/ModalBase";
import { NftRow } from "./NftRow";

type Props = {
  title: string;
  policyId?: string;
  onSelect: (assetInfo: NftInfo) => void;
  onClose: () => void;
};

export const SelectNftList: React.FC<Props> = ({
  title,
  policyId,
  onSelect,
  onClose,
}) => {
  const [assets, setAssets] = React.useState<TokenBalance[] | undefined>(
    undefined
  );
  const { walletApi, address } = useWalletStore();
  React.useEffect(() => {
    const getTokens = async () => {
      const allAssets = await getAllTokens(walletApi!);
      setAssets(allAssets);
    };
    getTokens();
  }, [walletApi, address]);
  const query = useNftInfo(
    assets
      ? policyId
        ? assets.filter((item) => item.policyId === policyId)
        : assets
      : undefined
  );

  return (
    <ModalBase title={title} onClose={onClose}>
      <div className="flex flex-col h-[300px] mt-[20px] overflow-y-scroll hide-scrollbar">
        <QueryRenderer
          query={query}
          renderer={({ items }) => (
            <>
              {items.map((item) => (
                <div
                  className="cursor-pointer rounded-[15px] px-[15px] hover:bg-darkerBg"
                  key={item.assetNameHex}
                  onClick={() => onSelect(item)}
                >
                  <NftRow
                    fingerprint={getAssetFingerprint({
                      assetName: item.assetNameHex,
                      policyId: item.policyId,
                    })}
                    name={item.displayName}
                  />
                </div>
              ))}
            </>
          )}
        />
      </div>
    </ModalBase>
  );
};
