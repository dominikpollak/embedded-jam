import { Portion } from "@jamonbread/sdk";

export const calculatePortions = (
  jobDatum: string,
  affilTreasury: string | undefined,
  subAffilTreasury: string | undefined
): Portion[] => {
  if (!affilTreasury && !subAffilTreasury) {
    return [{ percent: 1, treasury: jobDatum }];
  } else if (affilTreasury && !subAffilTreasury) {
    return [
      { percent: 0.6, treasury: jobDatum },
      { percent: 0.4, treasury: affilTreasury },
    ];
  } else if (affilTreasury && subAffilTreasury) {
    return [
      { percent: 0.5, treasury: jobDatum },
      { percent: 0.4, treasury: affilTreasury },
      {
        percent: 0.1,
        treasury: subAffilTreasury,
      },
    ];
  } else {
    return [];
  }
};
