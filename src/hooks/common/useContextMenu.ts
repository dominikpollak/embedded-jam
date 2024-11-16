import React from "react";

export const useContextMenu = (onClose?: () => void) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const contextMenuRef = React.useRef<HTMLDivElement>(null);
  const menuOpenerRef = React.useRef<HTMLDivElement>(null);

  const listener = React.useCallback(
    (event: any) => {
      if (
        !contextMenuRef.current ||
        contextMenuRef.current.contains(event.target)
      ) {
        return;
      }

      if (
        !menuOpenerRef.current ||
        menuOpenerRef.current.contains(event.target)
      ) {
        return;
      }

      setIsOpen(false);
      onClose && onClose();
    },
    [onClose]
  );

  const toggle = () => setIsOpen(!isOpen);

  const addListeners = React.useCallback(() => {
    document.addEventListener("mouseup", listener);
    document.addEventListener("touchend", listener);
  }, [listener]);

  const removeListeners = React.useCallback(() => {
    document.removeEventListener("mouseup", listener);
    document.removeEventListener("touchend", listener);
  }, [listener]);

  React.useEffect(() => {
    if (isOpen) {
      addListeners();
    } else {
      removeListeners();
    }
    return () => {
      removeListeners();
    };
  }, [isOpen, addListeners, removeListeners]);

  return { isOpen, toggle, contextMenuRef, menuOpenerRef };
};
