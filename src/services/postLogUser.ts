import { config } from "../constants/config";
import { customFetchHandler } from "./fetchWrapper";

type LogUserParams = {
  cookie: string;
  address: string;
};

export const postLogUser = async (params: LogUserParams) => {
  try {
    await customFetchHandler({
      url: `${config.backendUrl}users/log-user`,
      data: {
        ...params,
      },
      method: "POST",
    });
  } catch (e: any) {
    if (e.response && e.response.status === 403) {
      localStorage.setItem("disabled", "true");
    } else {
      localStorage.removeItem("disabled");
    }
  }
};
