// axiosService.ts
import axios, { Method } from "axios";

export const SendRequest = async (
  url: string,
  method: Method,
  data?: any,
  params?: any,
  headers?: any
) => {
  try {
    const response = await axios({
      url,
      method,
      data, 
      params, 
      headers: headers || {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error with request to ${url}:`, error);
    throw error;
  }
};
