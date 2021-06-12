import storage from "./storage";

type Method = "get" | "post" | "put" | "delete";
type ParamsType = Record<string, string>;

class RequestUtil {
  static request = async <Response, Body>(
    urlOrEndpoint: string,
    method: Method,
    body?: Body,
    params?: ParamsType,
  ): Promise<Response> => {
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
      return data as Response;
    }

    return Promise.reject(Error(data?.message));
  };

  static get = <Response>(
    urlOrEndpoint: string,
    params?: ParamsType,
  ): Promise<Response> =>
    RequestUtil.request(urlOrEndpoint, "get", null, params);

  static post = <Response, Body = unknown>(
    urlOrEndpoint: string,
    body?: Body,
    params?: ParamsType,
  ): Promise<Response> =>
    RequestUtil.request<Response, Body>(urlOrEndpoint, "post", body, params);

  static put = <Response, Body = unknown>(
    urlOrEndpoint: string,
    body: Body,
    params?: ParamsType,
  ): Promise<Response> =>
    RequestUtil.request<Response, Body>(urlOrEndpoint, "put", body, params);

  static delete = <Response>(
    urlOrEndpoint: string,
    params?: ParamsType,
  ): Promise<Response> =>
    RequestUtil.request(urlOrEndpoint, "delete", null, params);
}

export default RequestUtil;
