import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import React from "react";
import { useDropdownState } from "../../stores/states/useDropdownState";
import { useThemeColors } from "../../stores/useThemeColors";
import { DropdownOption } from "../../types/commonTypes";

interface DropdownProps {
  id: string;
  options: DropdownOption[];
  width?: string;
  label: ReactNode;
  hideChevron?: boolean;
  triggerClassName?: string;
  disableHover?: boolean;
  closeOnSelect?: boolean;
  forceVerticalPosition?: "down" | "up";
}

const Dropdown: React.FC<DropdownProps> = ({
  id,
  label,
  options,
  width = "140px",
  hideChevron = false,
  triggerClassName,
  disableHover = false,
  closeOnSelect = false,
  forceVerticalPosition,
}) => {
  const { bgColor, textColor } = useThemeColors();
  const { openId, setOpenId } = useDropdownState();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);
  const [disabledClick, setDisabledClick] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const [verticalPosition, setVerticalPosition] = React.useState<"down" | "up">(
    forceVerticalPosition ?? "down"
  );
  const [horizontalPosition, setHorizontalPosition] = React.useState<
    "left" | "right"
  >("left");
  const wrapperRef = React.createRef<HTMLDivElement>();
  const contentRef = React.createRef<HTMLDivElement>();
  const triggerRef = React.createRef<HTMLButtonElement>();
  let timeout: any;

  const calculateDropdownPosition = () => {
    if (!contentRef.current || !triggerRef.current) return;

    const dropdownRect = contentRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const leftOverflow = dropdownRect.width > dropdownRect.left;
    const bottomOverflow =
      viewportHeight < triggerRect.bottom + dropdownRect.height;

    if (leftOverflow) {
      setHorizontalPosition("right");
    } else {
      setHorizontalPosition("left");
    }

    if (bottomOverflow && !forceVerticalPosition) {
      setVerticalPosition("up");
    } else {
      setVerticalPosition("down");
    }
  };

  const toggleDropdown = () => {
    if (disabledClick) return;
    if (!isOpen) {
      setIsClicked(!isClicked);
    }

    setIsOpen(!isOpen);

    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  const handleClose = () => {
    if (disableHover) return;
    if (isClicked) return;

    timeout = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleOpen = () => {
    if (disableHover) return;
    clearTimeout(timeout);
    setDisabledClick(true);
    setTimeout(() => {
      setDisabledClick(false);
    }, 300);
    setIsOpen(true);

    if (openId !== id) {
      setOpenId(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex((prev) => (prev + 1) % options.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && options[focusedIndex]?.onClick) {
          options[focusedIndex]?.onClick();
          if (closeOnSelect) handleClose();
        } else {
          toggleDropdown();
        }
        break;
      case "Escape":
        handleClose();
        break;
      default:
        break;
    }
  };

  React.useLayoutEffect(() => {
    if (isOpen) {
      calculateDropdownPosition();
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (closeOnSelect) {
        setTimeout(() => {
          setIsOpen(false);
          setIsClicked(false);
        }, 150);
      } else if (
        contentRef.current &&
        !contentRef.current.contains(event.target)
      ) {
        if (
          !triggerRef?.current?.contains(event.target) &&
          !wrapperRef?.current?.contains(event.target) &&
          !contentRef?.current?.contains(event.target)
        ) {
          setIsOpen(false);
          setIsClicked(false);
        }
      }
    };

    const controller = new AbortController();
    const signal = controller.signal;

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside, { signal });
    }

    return () => {
      controller.abort();
    };
  }, [isOpen, contentRef, triggerRef, wrapperRef, closeOnSelect]);

  React.useEffect(() => {
    if (openId && openId !== id) {
      setIsOpen(false);
    }
  }, [openId, id]);

  return (
    <div
      className="relative font-medium"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      ref={wrapperRef}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        onClick={toggleDropdown}
        className={`flex items-center gap-1 ${triggerClassName}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        style={{
          color: textColor,
          backgroundColor: bgColor,
        }}
      >
        <span className={`text-sm`}>{label}</span>
        {!hideChevron && (
          <span>
            <ChevronDown
              size={16}
              strokeWidth={2.5}
              className={`translate-y-[1px] duration-150 ${
                isOpen && "rotate-180"
              }`}
            />
          </span>
        )}
      </button>
      {isOpen && (
        <div
          ref={contentRef}
          className={`absolute animate-in ${
            horizontalPosition === "left" ? "right-0" : "left-0"
          } ${
            verticalPosition === "down"
              ? "top-[calc(100%+3px)]"
              : "bottom-[calc(100%+3px)]"
          } z-20 rounded-lg border border-border bg-background text-sm shadow`}
          style={{
            width: `${width}`,
            color: textColor,
            backgroundColor: bgColor,
          }}
        >
          {options
            .filter((option) => option)
            .map((option, index) => (
              <React.Fragment key={index}>
                {option?.href && option.href.includes("http") ? (
                  <a
                    href={option.href}
                    target="_blank"
                    className="border-b border-border first:rounded-t-lg last:rounded-b-lg last:border-b-0 hover:brightness-90"
                    style={{
                      display: "block",
                      padding: "10px",
                    }}
                    role="menuitem"
                    aria-label="Menu item"
                  >
                    {option.label}
                  </a>
                ) : option?.href ? (
                  <a
                    href={option.href}
                    className="border-b border-border first:rounded-t-lg last:rounded-b-lg last:border-b-0 hover:brightness-90"
                    style={{
                      display: "block",
                      padding: "10px",
                    }}
                    role="menuitem"
                    aria-label="Menu item"
                  >
                    {option.label}
                  </a>
                ) : (
                  <div
                    className="border-b border-border first:rounded-t-lg last:rounded-b-lg last:border-b-0 hover:brightness-90"
                    onClick={option?.onClick}
                    style={{
                      padding: "10px",
                      cursor: "pointer",
                    }}
                    role="menuitem"
                    aria-label="Menu item"
                  >
                    {option?.label}
                  </div>
                )}
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
