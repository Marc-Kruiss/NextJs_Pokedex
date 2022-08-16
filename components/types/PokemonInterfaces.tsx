export interface IChainEntry {
  name: string;
  indexOffset: number;
}

interface IType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}
export interface IPokemonInfo {
  id: number;
  name: string;
  sprites: Record<string, string>;
  types: IType[];
  stats: {
    name: string;
    base_stat: number;
    stat: { name: string; url: string };
  }[];
  evolution_chain_url: string;
}

export interface IPokemonBase {
  pokemonInfo: IPokemonInfo;
  evolvingChainPokemons: IChainEntry[];
}

export interface PokemonListResponse {
  pokemonList: IPokemonUrl[];
  previousUrl: string;
  nextUrl: string;
}

export interface IPokemonUrl {
  name: string;
  url: string;
}
