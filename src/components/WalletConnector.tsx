import React from "react";

import { useStorageVersion } from "../stores/TestStore";

export const WalletConnector: React.FC = () => {
  const { version, setVersion } = useStorageVersion();
  // React.useEffect(() => {
  //   (async () => {
  //     const apiUrl = "https://api.jamonbread.io/api/".replace(/^\/+|\/+$/g, "");
  //     const wallet =
  //       typeof window !== "undefined" ? window.cardano?.["nami"] : undefined;
  //     const walletApi = await wallet?.enable();
  //     const provider = new JamOnBreadProvider(`${apiUrl}/lucid`);
  //     const lucid = await Lucid.new(provider, "Mainnet");
  //     console.log(lucid, walletApi);
  //   })();
  // }, []);

  return (
    <button
      className="bg-blue-500 h-24"
      onClick={() => setVersion(version + 1)}
    >
      {version}
    </button>
  );
};
