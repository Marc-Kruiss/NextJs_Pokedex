import { SortedArray } from "typescript";
import { IChainEntry } from "../types/PokemonInterfaces";
import { getEvolvingChainNamesByUrl } from "./utilities";

//#region types
export interface PokemonType {
  pokemonSpeciesInfo: PokemonSpeciesInfo | undefined;
  pokemonInfo: PokemonInfo | undefined;
  evolvingChain:IChainEntry[]
}

interface EvolutionChain {
  species: { name: string };
  evolves_to?: EvolutionChain;
}

type PokemonSearchinfo = {
  name: string;
  url: string;
};
type PokemonSpeciesInfo = {
  base_happiness: number;
  evolution_chain_url:string,
  name:string,
  names: { language: { name: string }; name: string }[];
  evolutionChain: any;
};
type PokemonInfo = {
  id: number;
  weight: number;
  sprites: Record<string, string>;
};

function mapperSpecies(species_respond: any): PokemonSpeciesInfo {
  if (species_respond === undefined) {
    return {
      base_happiness: -1,
      name:'No Name',
      evolution_chain_url:"",
      evolutionChain: [],
      names: [],
    };
  }
  return {
    base_happiness: species_respond.base_happiness,
    evolutionChain: species_respond.evolution_chain,
    evolution_chain_url:species_respond.evolution_chain.url,
    name:species_respond.name,
    names: species_respond.names,
  };
}

function mapperInfo(info_respond: any): PokemonInfo {
  if (info_respond === undefined) {
    return {
      id: 1000,
      sprites: { sprite: "none_sprite" },
      weight: 5,
    };
  } else {
    return {
      id: info_respond.id,
      weight: info_respond.weight,
      sprites: info_respond.sprites,
    };
  }
}

export type pokemonContextType = {
  pokemonData:PokemonType|null
  initPokemonInfo: (id: number) => Promise<void>;
};
//#endregion

export async function getPokemonData(
  pokemonInfoSetter: Function,
  pokeIndex: number
): Promise<void> {
  const speciesInfo: PokemonSpeciesInfo = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokeIndex}/`
  )
    .then((value) => value.json())
    .then((data) => mapperSpecies(data))

  const pokemonInfo: PokemonInfo = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${speciesInfo.name}/`
  )
    .then((value) => value.json())
    .then((data) => mapperInfo(data))

    const evolvingChainPokemons = await getEvolvingChainNamesByUrl(
      speciesInfo.evolution_chain_url,
      speciesInfo.name
    );

  const pokemon: PokemonType = {
    pokemonInfo: pokemonInfo,
    pokemonSpeciesInfo: speciesInfo,
    evolvingChain: evolvingChainPokemons,
  };

  if (
    pokemon.pokemonInfo !== undefined &&
    pokemon.pokemonSpeciesInfo !== undefined&&
    evolvingChainPokemons !== undefined
  ) {
    pokemonInfoSetter(pokemon);
    console.log("Loaded Info for Number ",pokeIndex)
    console.log(pokemon)
  }
}
