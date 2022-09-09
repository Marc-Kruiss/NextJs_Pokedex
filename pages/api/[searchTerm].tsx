import type { NextApiRequest, NextApiResponse } from "next";
import type { PokeSearchApiRequest } from "../../components/types/ApiInterfaces";
import { IPokemonUrl } from "../../components/types/PokemonInterfaces";

export default async function handler(
  req: PokeSearchApiRequest,
  res: NextApiResponse
) {
  const { searchTerm } = req.query;
  const maxResults: number = 15;

  if (req.method === "GET" && searchTerm) {
    const pokemonsResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
    );
    const pokemonNames: IPokemonUrl[] = await pokemonsResponse
      .json()
      .then((data) => {
        return data.results;
      });

    const filteredPokemons: IPokemonUrl[] = pokemonNames
      .map((p, index) => ({ name: p.name, url: p.url, id: index }))
      .filter((p) =>
        p.name.toLowerCase().startsWith(String(searchTerm).toLowerCase())
      );
    res.end(JSON.stringify({ filteredPokemons: filteredPokemons }));
  }
}
