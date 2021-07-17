import type { AxiosError } from 'axios';
import type { ErrorResponse, Response } from './types';

export const parseError = async (e: any): Promise<ErrorResponse> => {
  try {
    // e.text function should be fetch error
    if (e.text && typeof e.text === 'function') {
      try {
        const text = (await e.clone().text()) as string;

        return JSON.parse(text);
      } catch {
        return { status: e.status, statusText: e.statusText, url: e.url } as Response;
      }
    }

    // Axios error has buffer properties, toJSON will create a nice object
    if (e.isAxiosError) {
      return e.toJSON() as AxiosError;
    }

    if (e.response) {
      return {
        status: e.response.status,
        statusText: e.response.statusText,
        data: e.response.data,
      } as Response;
    }

    if (e.body) {
      try {
        return JSON.parse(e.body as string) as Response;
      } catch {
        return e.body as Response;
      }
    }

    return e as Response;
  } catch {
    return e as Response;
  }
};
