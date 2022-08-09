import { IPokemonInfo, PokemonListResponse } from "../types/PokemonInterfaces";

export function mapPokemonListResponse(respond: any): PokemonListResponse {
  try {
    return {
      nextUrl: respond.next,
      previousUrl: respond.previous,
      pokemonList: respond.results,
    };
  } catch (error) {
    throw new Error("The mapping of PokemonListResponse went wrong");
  }
}

export function mapPokemonInfo(
  species_respond: any,
  pokemon_respond: any
): IPokemonInfo {
  try {
    return {
      id: species_respond.id,
      name: species_respond.name,
      stats: pokemon_respond.stats,
      types: pokemon_respond.types,
      sprites: pokemon_respond.sprites,
      evolution_chain_url: species_respond.evolution_chain.url,
    };
  } catch (error) {
    throw new Error("The mapping of PokemonInfo went wrong");
  }
}
