import { formatHash, lovelaceToAda, useFormatPrice } from "../../utils/format";
import { generateImgLinkingUrl } from "../../utils/nft/nft";
import { NftThumbnail } from "./NftThumbnail";

type Props = {
  fingerprint: string;
  name: string;
  address?: string;
  price?: number;
};

export const NftRow: React.FC<Props> = ({
  fingerprint,
  name,
  address,
  price,
}) => {
  const formatPrice = useFormatPrice();

  return (
    <div className="flex flex-row items-center py-[15px]">
      <NftThumbnail
        src={generateImgLinkingUrl(fingerprint, "ico")}
        height={45}
        width={45}
        disablePlaceholder
        className="aspect-square h-[45px] w-auto rounded-[20%] float-left"
        alt="asset thumbnail"
      />
      <div className="flex-1 ml-[15px] flex flex-col text-ellipsis items-start">
        <span className="font-bold">{name}</span>
        {address && <span className="text-[13px]">{formatHash(address)}</span>}
      </div>
      {price && (
        <div className="flex flex-col items-end">
          <span className="font-bold">{lovelaceToAda(price)}</span>
          <span className="text-[13px]">{formatPrice(price) || ""}</span>
        </div>
      )}
    </div>
  );
};
