import React from "react";
import { assetUrls } from "../../constants/nft";
import ImgError from "../../resources/images/ImgError.svg";

type Props = {
  src: string;
  height: number;
  width: number;
  alt?: string;
  className?: string;
  lazy?: boolean;
  disablePlaceholder?: boolean;
  onLoad?: () => void;
};

export const NftThumbnail: React.FC<Props> = ({
  src: metadataSrc,
  height,
  width,
  alt,
  className,
  disablePlaceholder = false,
}) => {
  const commonProps = {
    alt,
    className,
  };
  const [loading, setLoading] = React.useState(true);
  const [src, setSrc] = React.useState<string>(
    assetUrls.getThumbnail(metadataSrc)
  );

  React.useEffect(() => {
    setSrc(assetUrls.getThumbnail(metadataSrc));
  }, [metadataSrc]);

  React.useEffect(() => {
    const loadImage = (url: string, fallbackUrl: string) =>
      new Promise((resolve, reject) => {
        const image = new Image();

        image.src = url;

        image.addEventListener("load", () => {
          resolve(image);
        });

        image.addEventListener("error", (error) => {
          if (!fallbackUrl || image.src === fallbackUrl) {
            reject(error);
            setLoading(false);
          } else {
            setLoading(false);
            setSrc(fallbackUrl);
          }
        });
      });

    setLoading(true);

    loadImage(metadataSrc || "", ImgError || "")
      .catch(() => {
        setSrc(ImgError || "");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [metadataSrc]);

  if (loading) {
    return (
      <LoadingSkeleton
        height={height + "px"}
        width={width + "px"}
        className={className}
        rounded={className?.includes("rounded-full") ? "full" : "md"}
      />
    );
  }

  return (
    <>
      {loading && !disablePlaceholder && (
        <div className="object-cover aspect-square top-0 left-0 w-full h-auto absolute">
          <UniversalSkeleton width="100%" height="100%" borderRadius="10%" />
        </div>
      )}
      <img
        key={JSON.stringify(src)}
        {...commonProps}
        className="object-cover aspect-square"
        src={src}
        alt="nft thumbnail"
        height={height}
        width={width}
      />
    </>
  );
};
