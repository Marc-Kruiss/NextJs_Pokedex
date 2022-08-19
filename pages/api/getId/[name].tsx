import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.query;
  const maxResults: number = 15;

  if (req.method === "GET" && name) {
    const pokemonsResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon/name"
    );
    const pokemonId: number = await pokemonsResponse.json().then((data) => {
      return data.id;
    });

    res.end(JSON.stringify({ pokemonId }));
  }
}
