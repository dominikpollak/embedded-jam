import React from "react";
import { assetUrls } from "../../constants/nft";
import UniversalSkeleton from "../global/loading/UniversalSkeleton";

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
  onLoad,
}) => {
  const commonProps = {
    alt,
    className,
  };
  //   const [loading, setLoading] = React.useState(true);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [src, setSrc] = React.useState<string>(
    assetUrls.getThumbnail(metadataSrc)
  );

  //   React.useEffect(() => {
  //     const loadImage = (url: string, fallbackUrl: string) =>
  //       new Promise((resolve, reject) => {
  //         const image = new Image();

  //         image.src = url;

  //         image.addEventListener("load", () => {
  //           resolve(image);
  //         });

  //         image.addEventListener("error", (error) => {
  //           if (!fallbackUrl || image.src === fallbackUrl) {
  //             reject(error);
  //             setLoading(false);
  //           } else {
  //             setLoading(false);
  //             setSrc(fallbackUrl);
  //           }
  //         });
  //       });

  //     setLoading(true);

  //     loadImage(metadataSrc || "", ImgError || "")
  //       .catch(() => {
  //         setSrc(ImgError || "");
  //       })
  //       .finally(() => {
  //         setLoading(false);
  //       });
  //   }, [metadataSrc]);

  //   if (loading && !disablePlaceholder) {
  //     return (
  //       <LoadingSkeleton
  //         height={height + "px"}
  //         width={width + "px"}
  //         className={
  //           "object-cover aspect-square top-0 left-0 w-full h-auto absolute " +
  //           className
  //         }
  //         rounded={className?.includes("rounded-full") ? "full" : "md"}
  //       />
  //     );
  //   }

  return (
    <>
      {!imageLoaded && !disablePlaceholder && (
        <div className="absolute top-0 left-0 aspect-square object-cover w-full h-full">
          <UniversalSkeleton width="100%" height="100%" borderRadius="10%" />
        </div>
      )}
      <img
        key={JSON.stringify(src)}
        {...commonProps}
        src={src}
        onError={() => {
          //   setSrc(ImgError.src);
          setImageLoaded(true);
        }}
        onLoad={() => {
          onLoad && onLoad();
          setImageLoaded(true);
        }}
        alt="nft thumbnail"
        height={height}
        width={width}
        className={`object-cover aspect-square ${className}`}
      />
    </>
  );
};
