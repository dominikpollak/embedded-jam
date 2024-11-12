import axios, { AxiosResponse } from "axios";

type Props = {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: Record<string, any>;
  headers?: any;
  cache?: boolean;
};

export const customFetchHandler = async ({
  url,
  method = "GET",
  data,
  headers,
  cache = true,
}: Props): Promise<AxiosResponse> => {
  const headersAndCache = cache
    ? { ...headers }
    : {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        ...headers,
      };

  try {
    const res = await axios({
      url,
      method,
      data,
      headers: headersAndCache,
    });
    if (res.status == 200) return res;
    let error = "";
    if (
      res.status === 404 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/embed"
    ) {
      window.location.href = "/404";
      return new Promise((resolve, reject) => reject(error));
    }
    if (res.status >= 400 && res.status < 500 && res.status !== 404) {
      error = "Something went wrong with this request";
    } else if (res.status >= 500) {
      error = "Something went wrong with the server";
    }
    return res;
  } catch (error: any) {
    if (
      error.response &&
      error.response.status === 404 &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/embed"
    ) {
      window.location.href = "/404";
    }

    return new Promise((resolve, reject) => reject(error));
  }
};
