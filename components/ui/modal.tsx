import { LucideX } from "lucide-react";
import React from "react";

const Modal = ({
  children,
  onClose,
  isVisible,
  hideCloseButton,
}: {
  children: React.ReactNode;
  onClose: () => void;
  isVisible: boolean;
  hideCloseButton?: boolean;
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-900/70 w-full h-full z-50"
      />
      <div className=" md:fixed md:top-1/2 md:left-1/2 md:-translate-1/2 z-[90] w-full md:w-auto top-10 absolute left-3 overflow-y-scroll md:overflow-hidden">
        {!hideCloseButton && (
          <LucideX
            className="absolute top-8 right-8 text-neutral-700 w-4 h-4 cursor-pointer"
            onClick={onClose}
          />
        )}

        {children}
      </div>
    </>
  );
};

export default Modal;
