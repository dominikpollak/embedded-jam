import React from "react";
import { tradeErrorMessages } from "../../constants/errors";
import { TradeError } from "../../types/trade";
import Button from "../global/Button";
import { Message } from "../global/Message";

export type TradeModalSuccess = {
  action: () => void;
  actionLabel?: string;
  successText: JSX.Element;
  explorerUrl?: string;
  infoMessage: string;
};

export type TradeModalError = {
  action: () => void;
  error: TradeError | undefined;
};

export type TradeProps = TradeModalSuccess | TradeModalError;

const isErrorProps = (props: TradeProps): props is TradeModalError => {
  return "error" in props;
};

export const TradeModalResult: React.FC<TradeProps> = (props) => {
  if (isErrorProps(props)) {
    const { error, action } = props;
    const errorMessage = error ? tradeErrorMessages[error] : undefined;
    const title = errorMessage?.title || "Oops! Something went wrong";
    const description = errorMessage?.description || error;
    const url = errorMessage?.url;
    const urlDescription = errorMessage?.urlDescription;
    const discordRef = () => {
      window.open(
        "https://discord.com/channels/914349532119187516/937382823650820146",
        "_blank"
      );
    };

    return (
      <div className="flex flex-col items-center [&>span]:text-center">
        {/* <div className="mb-4"> */}
        {/* <img src={ErrorAvatar} width={160} height={160} alt="error" /> */}
        {/* </div> */}
        <h2>{title}</h2>

        <div className="flex flex-col w-full mt-6 content-center items-center gap-[20px] [&>*]:w-[300px]">
          {description && url && urlDescription ? (
            <Message
              type="error"
              text={description}
              link={{ name: urlDescription, href: url }}
            />
          ) : (
            description && <Message type="error" text={description} />
          )}
          {title !== "Listing corrupted" && (
            <>
              <Button
                variant="primary"
                onClick={action}
                size="md"
                label="Try it again"
              />
            </>
          )}
          {title === "Listing corrupted" && (
            <>
              <Button
                variant="primary"
                onClick={discordRef}
                size="md"
                label="discord"
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex text-text flex-col items-center [&>span]:text-center">
      {/* <div className="mb-4"> */}
      {/* <img src={SuccessAvatar} width={120} height={120} alt="success" /> */}
      {/* </div> */}
      <h2>Success!</h2>
      <div className="flex flex-col gap-[25px] mt-4 text-center">
        <span className="text-grayText">
          {props.successText} See the{" "}
          {props.explorerUrl && (
            <>
              <a
                className="underline mr-1"
                href={props.explorerUrl}
                target="_blank"
                rel="noreferrer"
              >
                transaction detail
              </a>
              {/* <Icon name="cexplorer" height={18} width={18} /> */}
            </>
          )}
        </span>

        <Message type="info" text={props.infoMessage} />
      </div>
      <div className="flex flex-col w-full mt-6 content-center items-center gap-[20px] [&>*]:w-[300px]">
        <Button
          variant="primary"
          onClick={props.action}
          size="md"
          label={props.actionLabel || "Close"}
        />
      </div>
      <div className="w-full border-t border-border my-6" />
      {/* <SocialsWrapper>
        <Share>Share this transaction on your socials:</Share>
        <CommunityIcons>
          <a
            href={`https://twitter.com/intent/tweet?text=${props.explorerUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            <TwitterImage src={TwitterIcon} alt="twitter share" />
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${props.explorerUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            <FacebookImage src={FacebookIcon} alt="facebook share" />
          </a>

          <a
            href={`https://t.me/share/url?url=${props.explorerUrl}`}
            target="_blank"
            rel="noreferrer"
          >
            <TelegramImage src={TelegramIcon} alt="telegram share" />
          </a>
        </CommunityIcons>
      </SocialsWrapper> */}
    </div>
  );
};
