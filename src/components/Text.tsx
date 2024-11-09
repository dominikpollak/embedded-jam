import React from "react";

import { Lucid } from "lucid-cardano";
import { JamOnBreadProvider } from "@jamonbread/sdk";

export const Text: React.FC = () => {
  React.useEffect(() => {
    (async () => {
      const apiUrl = "https://api.jamonbread.io/api/".replace(/^\/+|\/+$/g, "");
      const wallet = typeof window !== "undefined" ? window.cardano?.["nami"] : undefined;
      const walletApi = await wallet?.enable();
      const provider = new JamOnBreadProvider(`${apiUrl}/lucid`);
      const lucid = await Lucid.new(provider, "Mainnet");
      console.log(lucid, walletApi);
    })();
  }, []);

  return <span>Hello from your Lib!</span>;
};
