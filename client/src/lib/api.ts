import { json } from "react-router-dom";

type Method = "get" | "post" | "put" | "del";

export class Api {
  private token = "";
  constructor(token: string = "") {
    this.token = token
  }
  private async makeRequest(url: string, method: Method, body: Record<string, any> = {}) {
    const options: RequestInit = {
      method,
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json",
      },
    }

    if (method === 'post' || method === 'put') {
      options.body = JSON.stringify(body);
    }

    const result = await fetch(url, options);
    return result.json();
  }

  get(url: string) {
    return this.makeRequest(url, 'get');
  }

  post(url: string, body: Record<string, any>) {
    return this.makeRequest(url, 'post', body);
  }

  put(url: string, body: Record<string, any>) {
    return this.makeRequest(url, 'put', body);
  }

  del(url: string) {
    return this.makeRequest(url, 'del');
  }
}