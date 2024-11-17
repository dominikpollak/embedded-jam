import React, { useRef } from "react";

type TooltipPosition =
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "right-bottom"
  | "left-top"
  | "right-top";

// const TooltipBox = styled.div<TooltipBoxProps>`
//   position: absolute;
//   background-color: ${({ bgcolor }) => bgcolor || colors.text};
//   border-radius: 15px;
//   padding: 15px;
//   line-height: 1;
//   box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.2);
//   width: ${({ width }) => (width ? `${width}px` : "auto")};
//   text-align: left;
//   display: ${(props) => (props.isHovered ? "unset" : "none")};
//   z-index: 1000;

//   ${({ position, offset }) => {
//     switch (position) {
//       case "top":
//         return css`
//           bottom: calc(100% + 5px);
//           left: calc(50% - ${offset}px);
//           transform: translateX(-50%);
//         `;
//       case "right":
//         return css`
//           transform: translateY(-50%);
//           top: 50%;
//           left: calc(100% + 5px);
//         `;
//       case "bottom":
//         return css`
//           top: calc(100% + 5px);
//           left: 50%;
//           transform: translateX(-50%);
//         `;
//       case "left":
//         return css`
//           transform: translateY(-50%) translateX(-100%);
//           top: 50%;
//           left: -5px;
//         `;
//       case "right-bottom":
//         return css`
//           top: calc(100% + 26px);
//           left: calc(100% - 140px);
//           transform: translateX(-50%);
//         `;
//       case "left-top":
//         return css`
//           bottom: calc(100% + 5px);
//           left: calc(50% - ${offset}px);
//           transform: translateX(-80%);
//         `;
//       case "right-top":
//         return css`
//           bottom: calc(100% + 5px);
//           left: calc(50% - ${offset}px);
//           transform: translateX(-30%);
//         `;
//     }
//   }}

//   &:after {
//     content: "";
//     position: absolute;
//     border: 5px solid;
//     border-color: ${({ bgcolor }) => bgcolor || colors.text};

//     ${({ position, offset }) => {
//       switch (position) {
//         case "top":
//           return css`
//             border-right-color: transparent;
//             border-left-color: transparent;
//             border-bottom-color: transparent;
//             left: calc(50% - 5px + ${offset}px);
//             top: 100%;
//           `;
//         case "bottom":
//           return css`
//             border-right-color: transparent;
//             border-top-color: transparent;
//             border-left-color: transparent;
//             top: unset;
//             bottom: 100%;
//             left: calc(50% - 5px);
//           `;
//         case "left":
//           return css`
//             border-right-color: transparent;
//             border-top-color: transparent;
//             border-bottom-color: transparent;
//             left: 100%;
//             top: calc(50% - 5px);
//           `;
//         case "right":
//           return css`
//             border-top-color: transparent;
//             border-left-color: transparent;
//             border-bottom-color: transparent;
//             right: 100%;
//             left: unset;
//             top: calc(50% - 5px);
//           `;
//         case "right-bottom":
//           return css`
//             border-width: 12px;
//             border-right-color: transparent;
//             border-top-color: transparent;
//             border-left-color: transparent;
//             top: unset;
//             bottom: 100%;
//             left: calc(82%);
//             border-left-width: 20px;
//           `;
//         case "left-top":
//           return css`
//             border-right-color: transparent;
//             border-left-color: transparent;
//             border-bottom-color: transparent;
//             left: calc(80% - 5px + ${offset}px);
//             top: 100%;
//           `;
//         case "right-top":
//           return css`
//             border-right-color: transparent;
//             border-left-color: transparent;
//             border-bottom-color: transparent;
//             left: calc(30% - 5px + ${offset}px);
//             top: 100%;
//           `;
//       }
//     }};
//   }
// `;

type Props = {
  position: TooltipPosition;
  text: React.ReactNode;
  children: JSX.Element;
  preferredWidth?: number;
  closeDelay?: number;
  show?: boolean;
};
export const Tooltip: React.FC<Props> = ({
  position: initialPosition,
  text,
  children,
  preferredWidth,
  closeDelay = 0,
  show = true,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = React.useState(0);
  const [width, setWidth] = React.useState(preferredWidth);
  const [tId, setTId] = React.useState<any>(null);
  const [position, setPosition] = React.useState(initialPosition);

  const baseStyles =
    "absolute bg-darker rounded-lg text-text rounded-lg p-4 text-left shadow-lg z-50";
  const visibilityStyles = isHovered ? "block" : "hidden";

  const positionStyles = (() => {
    switch (position) {
      case "top":
        return {
          bottom: `calc(100% + 5px)`,
          left: `calc(50% - ${offset}px)`,
          transform: "translateX(-50%)",
        };
      case "right":
        return {
          top: "50%",
          left: `calc(100% + 5px)`,
          transform: "translateY(-50%)",
        };
      case "bottom":
        return {
          top: `calc(100% + 5px)`,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          top: "50%",
          left: `calc(-${offset}px)`,
          transform: "translateY(-50%) translateX(-100%)",
        };
      case "right-bottom":
        return {
          top: `calc(100% + 5px)`,
          left: `calc(100% + 5px)`,
        };
      case "left-top":
        return {
          bottom: `calc(100% + 5px)`,
          left: `calc(-${offset}px)`,
        };
      case "right-top":
        return {
          bottom: `calc(100% + 5px)`,
          left: `calc(100% + 5px)`,
        };
      default:
        return {};
    }
  })();

  React.useEffect(() => {
    if (!tooltipRef.current) return;

    const left = tooltipRef.current.getBoundingClientRect().left;
    const right = tooltipRef.current.getBoundingClientRect().right;

    let newOffset = 0;
    const screenWidth = document.documentElement.clientWidth;

    if (left < 0) {
      newOffset = left;
      if (right - newOffset > screenWidth) {
        setWidth(screenWidth);
      } else {
        setOffset(newOffset);
      }
    } else if (right > screenWidth) {
      newOffset = right - screenWidth;
      if (left - newOffset < 0) {
        setWidth(screenWidth);
      } else {
        setOffset(newOffset);
      }
    }
  }, []);

  const handleClick = () => {
    setIsHovered((prev) => !prev);
  };

  const handleMouseEnter = () => {
    if (!show) return;

    if (tId) {
      clearTimeout(tId);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!show) return;

    if (tId) {
      clearTimeout(tId);
    }
    const timeoutId = setTimeout(() => setIsHovered(false), closeDelay);
    setTId(timeoutId);
  };

  React.useEffect(() => {
    if (!tooltipRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (tooltipRect.right > viewportWidth) {
      setPosition("left");
    }
    if (tooltipRect.bottom > viewportHeight) {
      setPosition("top");
    }
    if (tooltipRect.left < 0) {
      setPosition("right");
    }
    if (tooltipRect.top < 0) {
      setPosition("bottom");
    }
    if (
      tooltipRect.right > viewportWidth &&
      tooltipRect.bottom > viewportHeight
    ) {
      setPosition("right-bottom");
    }
    if (tooltipRect.left < 0 && tooltipRect.top < 0) {
      setPosition("left-top");
    }
    if (tooltipRect.right > viewportWidth && tooltipRect.top < 0) {
      setPosition("right-top");
    }
  }, [isHovered]);

  return (
    <div
      className="relative inline-flex z-1"
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      <div onClick={handleClick}>{children}</div>
      <div
        className={`bg-background text-text ${
          isHovered ? "opacity-100" : "opacity-0"
        } transition-opacity duration-100`}
      >
        <div
          className={`${baseStyles} ${visibilityStyles}`}
          style={{
            width: width ? `${width}px` : "auto",
            ...positionStyles,
          }}
          ref={tooltipRef}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
