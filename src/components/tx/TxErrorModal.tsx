import { forwardRef } from "react";
import Button from "../global/Button";
import Modal from "../global/Modal";

type Props = {
  setOpenWarningModal: (open: boolean) => void;
  txFunc: (e: any) => Promise<void>;
};

const TxErrorModal = forwardRef<HTMLDivElement, Props>(
  ({ setOpenWarningModal, txFunc }) => (
    <Modal
      onClose={() => setOpenWarningModal(false)}
      maxWidth="500px"
      minWidth="90%"
    >
      <div className="flex flex-col items-center text-center">
        <Button
          leftIcon="close"
          onClick={() => setOpenWarningModal(false)}
          variant="tertiary"
          size="sm"
          className="absolute top-[30px] right-[30px"
        />
        {/* <ImageWrapper>
          <Image
            src={ErrorAvatar}
            width={130}
            height={130}
            alt="error"
            placeholder="blur"
          />
        </ImageWrapper> */}
        <h2>Oops</h2>
        <div className="flex flex-col mt-6 self-stretch gap-5">
          <p className="text-[16px] text-center">
            You already have one pending transaction. Please wait for it to be
            finished and try again.
          </p>
          <Button
            variant="secondary"
            onClick={txFunc as any}
            size="md"
            label="Try again"
          />
          <Button
            variant="primary"
            onClick={() => setOpenWarningModal(false)}
            size="md"
            label="I got it"
          />
        </div>
      </div>
    </Modal>
  )
);

TxErrorModal.displayName = "TxErrorModal";

export default TxErrorModal;
