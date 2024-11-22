import React from "react";
import { colors } from "../../constants/colors";
import { useWalletStore } from "../../stores/wallet/walletStore";
import { CollectionDetailResponse } from "../../types/collection";
import { NftListData, NftOffer } from "../../types/nft";
import { ScriptConstants } from "../../types/script";
import { getRoyalty } from "../../utils/nft/nft";
import { getAdaBalance } from "../../utils/wallet/getAdaBalance";
import { getWalletBalance } from "../../utils/wallet/getWalletBalance";
import Button from "../global/Button";
import { PriceState } from "../global/inputs/PriceInput";
import { SpinningLoader } from "../global/loading/SpinningLoader";
import { BalanceRow } from "./BalanceRow";
import { ModalItemRow } from "./ModalItemRow";
import { PriceAndFeeInfoRow } from "./PriceAndFeeInfoRow";

type Props = {
  title: React.ReactNode;
  onClose: () => void;
  nftListings?: NftListData[] | undefined;
  offer?: NftOffer;
  collection?: CollectionDetailResponse;
  summaryTemplateType?: "sell" | "buy" | "offer" | "cancel";
  children?: React.ReactNode;
  script?: ScriptConstants;
  showDepositInfo?: boolean;
  showFeeInfo?: boolean;
  priceState?: PriceState;
  prices?: {
    assetNameHex: string;
    price: number;
    collection: string;
  }[];
  button?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  loading?: boolean;
  priceInLovelace?: number;
  royaltyPercentage?: number;
  royalties?:
    | {
        collection: string;
        percentage: number;
      }[];
  message?: React.ReactNode;
};

export const ModalBase: React.FC<Props> = (props) => {
  const royalty =
    !!props.nftListings?.length && !props.royaltyPercentage
      ? getRoyalty(props.collection || props.nftListings[0]?.collection || {})
      : undefined;
  const [balance, setBalance] = React.useState<number | undefined>(undefined);
  const { walletApi } = useWalletStore();
  console.log("stored walletApi", walletApi);

  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        props.button?.onClick();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [props]);

  React.useEffect(() => {
    (async () => {
      const balance = await getWalletBalance(walletApi!);
      console.log("balance", balance);
    })();
    const getBalance = async () => {
      const balance = await getAdaBalance(walletApi!);
      setBalance(balance);
    };
    getBalance();
  }, [walletApi]);

  return (
    <div className="flex text-text bg-background flex-col relative">
      <div className="flex justify-center items-center text-center w-full">
        <h3 color={colors.text}>{props.title}</h3>
      </div>
      {props.message && (
        <p className="text-[16px] mb-0 font-normal text-center">
          {props.message}
        </p>
      )}
      <div className="relative h-full flex flex-wrap mt-6 gap-[15px]">
        <div className="flex flex-col gap-[5px] basis-[470px] grow">
          {(!!props.nftListings ||
            props.collection ||
            props.offer ||
            props.children) && (
            <div className="thin-scrollbar flex flex-col justify-start items-start overflow-y-auto max-h-[350px] w-full">
              {props.offer && <ModalItemRow offer={props.offer} />}

              {props.nftListings &&
                props.nftListings?.map((item, index) => (
                  <ModalItemRow
                    key={index}
                    nftListing={item}
                    collection={props.collection}
                    priceState={props.priceState}
                    offer={props.offer}
                  />
                ))}
            </div>
          )}
          {props.children}
        </div>
        {props.summaryTemplateType && (
          <div className="basis-[300px] grow-0 flex flex-col gap-[5px]">
            <BalanceRow lovelace={balance} />
            <PriceAndFeeInfoRow
              templateType={props.summaryTemplateType}
              royalties={props.royalties}
              royaltyPercentage={
                royalty?.royaltyPercentage ||
                props.royaltyPercentage ||
                undefined
              }
              priceInLovelace={props.priceInLovelace || 0}
              prices={props.prices}
              scriptInfo={props.script}
              showDepositInfo={props.showDepositInfo}
              showFeeInfo={props.showFeeInfo}
            />
          </div>
        )}
      </div>
      {props.button && (
        <div className="flex w-full justify-center mt-6 [&>*]:w-[300px]">
          <Button
            variant="primary"
            onClick={props.button.onClick}
            label={
              props.loading ? (
                <div className="flex gap-[15px] items-center">
                  <SpinningLoader size={25} />
                  <p>Loading</p>
                </div>
              ) : (
                props.button.label
              )
            }
            disabled={props.loading || props.button.disabled}
            size="md"
          />
        </div>
      )}
    </div>
  );
};
