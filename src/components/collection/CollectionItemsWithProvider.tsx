import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CollectionItems } from "./CollectionItems";

interface Props {
  theme: "light" | "dark" | "gray" | "darkBlue";
  affiliateLink: string;
}

const queryClient = new QueryClient();

export const CollectionItemsWithProvider: React.FC<Props> = ({
  theme,
  affiliateLink,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CollectionItems />
    </QueryClientProvider>
  );
};
