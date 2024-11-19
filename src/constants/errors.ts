import { TradeError } from "../types/trade";

export const tradeErrorMessages: Record<
  TradeError,
  | {
      title: string;
      description: string;
      url?: string;
      urlDescription?: string;
    }
  | undefined
> = {
  NO_COLLATERAL: {
    title: "No collateral set",
    description: "Make sure that you have set a collateral in your wallet.",
  },
  InputsExhaustedError: {
    title: "Not enough funds",
    description:
      "There is not enough funds in your wallet to complete this transaction.",
  },
  "Cannot read properties of undefined (reading 'length')": {
    title: "Not enough funds",
    description:
      "There is not enough funds in your wallet to complete this transaction.",
  },
  WRONG_ADDRESS: {
    title: "Wrong address",
    description:
      "You are connected with different address in your wallet. Try refreshing the page.",
  },
  TX_ASSEMBLE_ERROR: {
    title: "Transaction building error",
    description:
      "We have trouble building a correct transaction. Please contact support.",
  },
  TX_TOO_BIG: {
    title: "Transaction too big",
    description:
      "You probably have too many tokens or small UTxOs in your wallet. You can try creating a new wallet and sending assets you want to trade there.",
  },
  OFFER_DOES_NOT_EXIST: {
    title: "Offer not found",
    description:
      "The offer was not found in the contract. It might have been cancelled or accepted already.",
  },
  NO_MIN_ADA_LEFT: {
    title: "Too many small UTxOs",
    description:
      "If you have at least a few more ADA than needed for this transaction, sending all your assets to yourself should resolve this.",
  },
  FULL_MEMPOOL: {
    title: "Full mempool",
    description:
      "The Cardano network is congested right now, try again in few minutes please.",
  },
  MINTING_NOT_LIVE: {
    title: "Minting not live",
    description:
      "The minting has not started yet, is paused, or is finished already.",
  },
  NOT_IN_SCRIPT: {
    title: "Listing corrupted",
    description:
      "Don't despair! Please contact our support team via discord ticket or email. We will ask for as many details as possible - what you did, with which asset, your browser, time of the event, etc. Thank you.",
  },
  "User declined to sign the transaction.": {
    title: "Signature declined",
    description:
      "You have declined the signature request. Please try again and accept it.",
  },
};
