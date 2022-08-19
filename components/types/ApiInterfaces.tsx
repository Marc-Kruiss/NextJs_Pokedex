import { NextApiRequest } from "next";

export interface PokeSearchApiRequest extends NextApiRequest {
  body: {
    searchString: string;
    maxResults: number;
  };
}
