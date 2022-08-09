export interface IChainEntry {
  name: string;
  indexOffset: number;
}

export interface IPokemonInfo {
  id: number;
  name: string;
  sprites: Record<string, string>;
  types: { name: string }[];
  stats: { name: string; base_stat: number }[];
  evolution_chain_url:string
}

export interface IPokemonBase {
  pokemonInfo: IPokemonInfo;
  evolvingChainPokemons: IChainEntry[];
}
