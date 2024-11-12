import React from "react";
import Modal from "../global/Modal";

interface Props {
  text: string;
  bg: string;
}

export const NftList: React.FC<Props> = ({ text, bg }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          minWidth="400px"
          minHeight="200px"
        >
          modal
        </Modal>
      )}
      <span
        onClick={() => setIsOpen(true)}
        className="text-3xl"
        style={{ color: text, backgroundColor: bg }}
      >
        NFT LIST
      </span>
    </>
  );
};
