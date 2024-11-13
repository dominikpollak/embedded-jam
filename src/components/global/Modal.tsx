import React, { useEffect, useRef } from "react";
import { useThemeColors } from "../../stores/useThemeColors";

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  hideClose?: boolean;
}

const Modal: React.FC<Props> = ({
  onClose,
  children,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  hideClose,
}) => {
  const { bgColor, textColor } = useThemeColors();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Tab" && modalRef.current) {
        const focusableElements =
          modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const controller = new AbortController();
    const signal = controller.signal;

    document.addEventListener("keydown", handleKeyDown, { signal });
    return () => {
      controller.abort();
    };
  }, [onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 h-full w-full bg-black/30 backdrop-blur-[1px]"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        tabIndex={-1}
        style={{
          width: minWidth || "95%",
          height: minHeight,
          maxWidth: maxWidth || "400px",
          maxHeight: maxHeight,
          backgroundColor: bgColor,
          color: textColor,
        }}
        className="thin-scrollbar fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-background p-3 md:p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {!hideClose && (
          <button
            aria-label="Close dialog"
            onClick={onClose}
            className="absolute right-3 top-3 cursor-pointer md:right-5 md:top-5"
          >
            <span aria-hidden="true">X</span>
          </button>
        )}

        <div id="modal-title">{children}</div>
      </div>
    </>
  );
};

export default Modal;
