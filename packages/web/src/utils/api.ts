import { Json } from "./misc";
import storage from "./storage";

type Method = "get" | "post" | "put" | "delete";
type ParamsType = Record<string, string>;

class RequestUtil {
  static request = async <T extends Json>(
    urlOrEndpoint: string,
    method: Method,
    body?: Json,
    params?: ParamsType,
  ): Promise<T> => {
    let url: URL;
    if (urlOrEndpoint.startsWith("/")) {
      url = new URL(process.env.REACT_APP_API_URL.concat(urlOrEndpoint));
    } else {
      url = new URL(urlOrEndpoint);
    }
    if (params) {
      url.search = new URLSearchParams(params).toString();
    }

    const token = storage.getToken();
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
      headers["Content-Type"] = "application/json";
    }

    const response = await window.fetch(url.toString(), config);

    const data = await response.json();

    if (response.ok) {
      return data as T;
    }

    return Promise.reject(Error(data?.errorMessage));
  };

  static get = <T extends Json = Json>(
    urlOrEndpoint: string,
    params?: ParamsType,
  ): Promise<T> => RequestUtil.request(urlOrEndpoint, "get", null, params);

  static post = <T extends Json = Json>(
    urlOrEndpoint: string,
    body?: Json,
    params?: ParamsType,
  ): Promise<T> => RequestUtil.request<T>(urlOrEndpoint, "post", body, params);

  static put = <T extends Json = Json>(
    urlOrEndpoint: string,
    body: Json,
    params?: ParamsType,
  ): Promise<T> => RequestUtil.request<T>(urlOrEndpoint, "put", body, params);

  static delete = <T extends Json = Json>(
    urlOrEndpoint: string,
    params?: ParamsType,
  ): Promise<T> => RequestUtil.request(urlOrEndpoint, "delete", null, params);
}

export default RequestUtil;
