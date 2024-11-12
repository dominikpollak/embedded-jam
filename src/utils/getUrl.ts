import queryString, { StringifiableRecord } from "query-string";
import { config } from "../constants/config";

export const getUrl = (path: string, params?: StringifiableRecord) =>
  queryString.stringifyUrl({
    url: `${config.backendUrl}${path}`,
    query: params,
  });
