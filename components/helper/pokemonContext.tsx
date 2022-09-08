import { type } from "os";
import { SortedArray } from "typescript";
import { IChainEntry } from "../types/PokemonInterfaces";
import { getEvolvingChainNamesByUrl, getFilteredSprites, getMoveInfoByUrl, getTypeInfoByUrl, numberToThreeBasedString } from "./utilities";

//#region types
export interface PokemonType {
  pokemonSpeciesInfo: PokemonSpeciesInfo | undefined;
  pokemonInfo: PokemonInfo | undefined;
  evolvingChain: IChainEntry[];
  //typeInfo: TypeInfo
}

export interface TypeInfo{
  damage_relations:{
    double_damage_from:{name:string, url:string}[],
    double_damage_to:{name:string, url:string}[],
    half_damage_from:{name:string, url:string}[],
    half_damage_to:{name:string, url:string}[],
    no_damage_from:{name:string, url:string}[],
    no_damage_to:{name:string, url:string}[]
  }
} 

export interface MoveInfo{
  accuracy:number,
  pp:number,
  power:number,
  contest:string,
  type:{
    name:string,
    url:string
  },
  damage_class:{
    name:string
  }

}

type PokemonSearchinfo = {
  name: string;
  url: string;
};
type PokemonSpeciesInfo = {
  base_happiness: number;
  evolution_chain_url: string;
  name: string;
  names: { language: { name: string }; name: string }[];
  evolutionChain: any;
};

interface IPokemonState {
  name: string;
  base_stat: number;
  stat: { name: string; url: string };
}

interface IType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
  info:TypeInfo
}

export interface IMove{
  move:{
    name:string,
    url:string
  },
  info:MoveInfo
}

type PokemonInfo = {
  id: number;
  weight: number;
  sprites:string[]// Record<string, string>;
  stats: IPokemonState[];
  types: IType[];
  moves:IMove[];
};

function mapperSpecies(species_respond: any): PokemonSpeciesInfo {
  if (species_respond === undefined) {
    return {
      base_happiness: -1,
      name: "No Name",
      evolution_chain_url: "",
      evolutionChain: [],
      names: [],
    };
  }
  return {
    base_happiness: species_respond.base_happiness,
    evolutionChain: species_respond.evolution_chain,
    evolution_chain_url: species_respond.evolution_chain.url,
    name: species_respond.name,
    names: species_respond.names,
  };
}

function mapperInfo(info_respond: any): PokemonInfo {
  if (info_respond === undefined) {
    return {
      id: 1000,
      sprites: [],//{ sprite: "none_sprite" },
      weight: 5,
      stats: [],
      types: [],
      moves:[]
    };
  } else {
    return {
      id: info_respond.id,
      weight: info_respond.weight,
      sprites: getFilteredSprites(
        numberToThreeBasedString(info_respond.id),
        info_respond.sprites
      ),
      stats: info_respond.stats,
      types: info_respond.types,
      moves: info_respond.moves
    };
  }
}

export type pokemonContextType = {
  pokemonData: PokemonType | null;
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
    .then((data) => mapperSpecies(data));

  const pokemonInfo: PokemonInfo = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${speciesInfo.name}/`
  )
    .then((value) => value.json())
    .then((data) => mapperInfo(data));

  const evolvingChainPokemons = await getEvolvingChainNamesByUrl(
    speciesInfo.evolution_chain_url,
    speciesInfo.name
  );

  pokemonInfo.types.forEach(async element => {
    element.info = await getTypeInfoByUrl(element.type.url)
  });
  console.log(pokemonInfo.moves)
  pokemonInfo.moves?.forEach(async element => {
    element.info = await getMoveInfoByUrl(element.move.url)
  });



  const pokemon: PokemonType = {
    pokemonInfo: pokemonInfo,
    pokemonSpeciesInfo: speciesInfo,
    evolvingChain: evolvingChainPokemons,
  };

  if (
    pokemon.pokemonInfo !== undefined &&
    pokemon.pokemonSpeciesInfo !== undefined &&
    evolvingChainPokemons !== undefined
  ) {
    console.log(pokemon)
    pokemonInfoSetter(pokemon);
  } else {
    console.log("Failure");
  }
}
