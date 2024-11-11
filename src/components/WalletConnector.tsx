import React from "react";

import { useStorageVersion } from "../stores/TestStore";

export const WalletConnector: React.FC = () => {
  const { version, setVersion } = useStorageVersion();

  return (
    <button
      className="bg-blue-500 h-24"
      onClick={() => setVersion(version + 1)}
    >
      {version}
    </button>
  );
};
