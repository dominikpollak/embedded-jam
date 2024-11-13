import { isAndroid, isFirefox, isIOS, isMobile } from "react-device-detect";
import { WalletInfo, WalletType } from "../types/wallet";

export const SUPPORTED_WALLETS: readonly WalletType[] = [
  "nami",
  "flint",
  "yoroi",
  "lace",
  "begin",
  "vespr",
  "eternl",
  "tokeo",
  "nufi",
  "gerowallet",
];

export const walletInfos: Record<WalletType, WalletInfo> = {
  nami: {
    name: "nami",
    icon: "../resources/images/nami.svg",
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: false,
    extensionUrl:
      "https://chrome.google.com/webstore/detail/nami/lpfcbjknijpeeillifnkikgncikgfhdo",
  },
  flint: {
    name: "flint",
    icon: "../resources/images/flint.png",
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: true,
    extensionUrl: `${
      isAndroid
        ? "https://play.google.com/store/apps/details?id=io.dcspark.flintwallet&hl=en_US"
        : ""
    } ${
      isIOS
        ? "https://apps.apple.com/cz/app/dcspark-flint-wallet/id1619660885"
        : ""
    }
      ${
        !isAndroid && !isIOS
          ? "https://chrome.google.com/webstore/detail/flint-wallet/hnhobjmcibchnmglfbldbfabcgaknlkj"
          : ""
      }`,
  },
  yoroi: {
    name: "yoroi",
    icon: "../resources/images/yoroi.svg",
    unsuportedBrowsers: ["safari"],
    hasMobileApp: true,
    extensionUrl: `${
      !isFirefox && !isMobile
        ? "https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb"
        : ""
    }
      ${isFirefox ? "https://addons.mozilla.org/cs/firefox/addon/yoroi/" : ""}
      ${
        isAndroid
          ? "https://play.google.com/store/apps/details?id=com.emurgo&hl=cs&gl=US"
          : ""
      }
      ${
        isIOS
          ? "https://apps.apple.com/us/app/emurgos-yoroi-cardano-wallet/id1447326389"
          : ""
      }`,
  },
  begin: {
    name: "begin",
    icon: "../resources/images/begin_dark.svg",
    darkIcon: "../resources/images/begin_light.svg",
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: true,
    extensionUrl: isAndroid
      ? "https://play.google.com/store/apps/details?id=is.begin.app"
      : isIOS
      ? "https://apps.apple.com/us/app/begin-cardano-wallet-by-b58/id1642488837"
      : "https://chromewebstore.google.com/detail/begin-cardano-wallet-by-b/nhbicdelgedinnbcidconlnfeionhbml",
  },
  tokeo: {
    name: "tokeo",
    icon: "../resources/images/tokeo.png",
    unsuportedBrowsers: ["firefox", "safari", "chrome", "brave", "opera"],
    hasMobileApp: true,
    extensionUrl:
      "https://apps.apple.com/us/app/tokeo-wallet/id6476824031?ign-itscg=30200&ign-itsct=apps_box_badge",
  },
  nufiSnap: {
    name: "metamask",
    icon: "../resources/images/metamask.svg",
    unsuportedBrowsers: ["safari"],
    hasMobileApp: true,
    extensionUrl: `${
      isFirefox
        ? "https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/"
        : isIOS
        ? "https://apps.apple.com/us/app/metamask-blockchain-wallet/id1438144202"
        : isAndroid
        ? "https://play.google.com/store/apps/details?id=io.metamask"
        : "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
    }`,
  },
  lace: {
    name: "lace",
    icon: "../resources/images/lacelogo.svg",
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: false,
    extensionUrl:
      "https://chrome.google.com/webstore/detail/lace/gafhhkghbfjjkeiendhlofajokpaflmk",
  },
  vespr: {
    name: "vespr",
    icon: "../resources/images/vespr-dark.png",
    darkIcon: "../resources/images/vespr-light.png",
    unsuportedBrowsers: ["safari", "firefox"],
    hasMobileApp: true,
    extensionUrl: `
      ${
        isAndroid
          ? "https://play.google.com/store/apps/details?id=art.nft_craze.gallery.main&pli=1"
          : ""
      }
      ${
        isIOS
          ? "https://apps.apple.com/app/id1565749376"
          : "https://chromewebstore.google.com/detail/vespr-wallet/bedogdpgdnifilpgeianmmdabklhfkcn"
      }`,
  },
  eternl: {
    name: "eternl",
    icon: "../resources/images/eternl-small.png",
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: true,
    extensionUrl: ` ${
      !isMobile
        ? "https://chrome.google.com/webstore/detail/eternl/kmhcihpebfmpgmihbkipmjlmmioameka"
        : ""
    }
      ${
        isAndroid
          ? "https://play.google.com/store/apps/details?id=io.ccvault.v1.main&hl=cs&gl=US"
          : ""
      }
      ${
        isIOS
          ? "https://apps.apple.com/us/app/eternl-by-tastenkunst/id1603854385"
          : ""
      }`,
  },
  nufi: {
    name: "nufi",
    icon: "../resources/images/nufi-small.svg",
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: false,
    extensionUrl:
      "https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca",
  },
  nufiSSO: {
    name: "nufiSSO",
    icon: "../resources/images/nufi-small.svg",
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: false,
    extensionUrl:
      "https://chrome.google.com/webstore/detail/nufi/gpnihlnnodeiiaakbikldcihojploeca",
  },
  gerowallet: {
    name: "gero",
    icon: "../resources/images/gero.svg",
    unsuportedBrowsers: ["firefox", "safari"],
    hasMobileApp: true,
    extensionUrl: ` ${
      !isMobile
        ? "https://chrome.google.com/webstore/detail/gerowallet/bgpipimickeadkjlklgciifhnalhdjhe"
        : ""
    }
      ${
        isAndroid
          ? "https://play.google.com/store/apps/details?id=io.gerowallet.dev"
          : ""
      }
      ${isIOS ? "https://apps.apple.com/us/app/gerowallet/id1630797611" : ""}`,
  },
};
