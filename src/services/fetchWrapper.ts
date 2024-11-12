// import axios, { AxiosResponse } from "axios";

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
}: Props): Promise<any> => {
  const headersAndCache = cache
    ? { ...headers }
    : {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        ...headers,
      };

  try {
    const res = await fetch(url, {
      method,
      headers: headersAndCache,
      body: JSON.stringify(data),
    });
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
