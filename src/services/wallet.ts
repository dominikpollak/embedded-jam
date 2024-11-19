import { getUrl } from "../utils/getUrl";
import { customFetchHandler } from "./fetchWrapper";

type AffilTranslateResult = {
  treasury: string;
  parentTreasury: string | null;
  errorCode: number;
};

export const translateAffiliateLink = async (
  value: string,
  txbuild?: boolean
): Promise<AffilTranslateResult> => {
  const res = await customFetchHandler({
    url: getUrl("affiliate/use-link"),
    data: {
      value: value,
      txbuild: !!txbuild,
    },
    method: "POST",
  });

  const data = res.data;
  return data as AffilTranslateResult;
};
