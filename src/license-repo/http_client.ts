import ky, { HTTPError, type KyInstance, type SearchParamsOption } from "ky";

export interface HTTPRequestOptions {
  url: string;
  searchParams?: SearchParamsOption;
  json?: unknown;
  body?: RequestInit["body"];
  headers?: HeadersInit;
}

export class HTTPClient {
  private client: KyInstance;

  public constructor({
    prefixURL,
    headers,
  }: {
    prefixURL: string;
    headers?: HeadersInit;
  }) {
    this.client = ky.create({
      fetch,
      headers,
      retry: 3,
      prefixUrl: prefixURL,
    });
  }

  public get = <T>({ url, searchParams, headers }: HTTPRequestOptions) =>
    this.client
      .get<T>(url, this.buildRequestOptions({ searchParams, headers }))
      .json();

  public post = <T>({ url, json, body, headers }: HTTPRequestOptions) =>
    this.client
      .post<T>(url, this.buildRequestOptions({ json, body, headers }))
      .json();

  public put = <T>({ url, json, body, headers }: HTTPRequestOptions) =>
    this.client
      .put<T>(url, this.buildRequestOptions({ json, body, headers }))
      .json();

  public delete = <T>({ url, searchParams, headers }: HTTPRequestOptions) =>
    this.client
      .delete<T>(url, this.buildRequestOptions({ searchParams, headers }))
      .json();

  private buildRequestOptions = ({
    searchParams,
    json,
    body,
    headers,
  }: Partial<HTTPRequestOptions>) => ({
    searchParams,
    json,
    body,
    headers,
  });
}

export const isHTTPError = (error: unknown) => error instanceof HTTPError;
