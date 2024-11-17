import { QueryClient, QueryClientProvider } from "react-query";
import { CollectionItems } from "./CollectionItems";

const queryClient = new QueryClient();

export const CollectionItemsWithProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CollectionItems />
    </QueryClientProvider>
  );
};
