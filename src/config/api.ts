import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import keys from "lodash/keys";
import isDate from "lodash/isDate";
import queryString from "query-string";

export class ApiProvider {
  static apiUrl = process.env.API_URL;

  static init(getHeaders: () => Promise<any>, apiUrl?: string) {
    this.getHeaders = getHeaders;
    this.apiUrl = apiUrl || process.env.API_URL;
  }

  static async post<T>(url: string, data?: any): Promise<T> {
    try {
      const res = await axios.post<T>(`${this.resolveUrl(url)}`, data, {
        headers: await this.getHeaders(),
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        throw {
          message: error.response.data.message || error.response.data,
        };
      }
      throw error;
    }
  }

  static async upload<T>(url: string, data: any, put?: boolean): Promise<T> {
    try {
      const formData = new FormData();
      for (const k of keys(data)) {
        formData.append(k, data[k]);
      }

      const method = put ? axios.put : axios.post;
      const res = await method<T>(`${this.resolveUrl(url)}`, formData, {
        headers: {
          ...(await this.getHeaders()),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        throw {
          message: error.response.data.message || error.response.data,
        };
      }
      throw error;
    }
  }

  static async put<T>(url: string, data?: any): Promise<T> {
    try {
      const res = await axios.put<T>(`${this.resolveUrl(url)}`, data, {
        headers: await this.getHeaders(),
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        throw {
          message: error.response.data.message,
        };
      }
      throw error;
    }
  }

  static async get<T>(
    url: string,
    params?: object,
    queries?: object
  ): Promise<T> {
    function parse(v: any) {
      if (typeof v === "object") {
        if (isDate(v)) {
          return (v as Date).toISOString();
        }
        return JSON.stringify(v);
      }

      return v;
    }

    try {
      let query = "";
      if (params) {
        for (const k of Object.keys(params)) {
          if (Array.isArray(params[k])) {
            params[k] = params[k].map((v: any) => {
              return parse(v);
            });
          } else if (typeof params[k] === "object") {
            params[k] = parse(params[k]);
          }
        }

        query = "?" + queryString.stringify(params);
        if (queries) {
          query += Object.keys(queries)
            .map((key) => `&${key}=${JSON.stringify(queries[key])}`)
            .join("");
        }
      }

      const res = await axios.get<T>(`${this.resolveUrl(url)}${query}`, {
        headers: await this.getHeaders(),
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        throw {
          message: error.response.data.message,
        };
      }
      throw error;
    }
  }

  static async request<T>(
    method: "get" | "post" | "put" | "del",
    url: string,
    config?: AxiosRequestConfig
  ) {
    return axios[method]<T>(`${this.resolveUrl(url)}`, {
      headers: await this.getHeaders(),
      withCredentials: true,
      ...config,
    }) as AxiosResponse<T>;
  }

  static async del<T>(url: string): Promise<T> {
    try {
      const res = await axios.delete<T>(`${this.resolveUrl(url)}`, {
        headers: await this.getHeaders(),
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      if (error.response) {
        throw {
          message: error.response.data.message,
        };
      }
      throw error;
    }
  }

  private static async getHeaders(): Promise<any> {
    throw new Error("ApiService.getHeaders is not implemented.");
  }

  private static resolveUrl(url: string) {
    if (!url.startsWith("/")) {
      url = "/" + url;
    }

    return this.apiUrl + url;
  }
}
