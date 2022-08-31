//#region types
export interface PokemonType {
  pokemonSearchInfo: PokemonSearchinfo;
  pokemonSpeciesInfo: PokemonSpeciesInfo | undefined;
  pokemonInfo: PokemonInfo | undefined;
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
      evolutionChain: [],
      names: [],
    };
  }
  return {
    base_happiness: species_respond.base_happiness,
    evolutionChain: species_respond.evolution_chain,
    names: species_respond.names,
  };
}

function mapperInfo(info_respond: any): PokemonInfo {
  return {
    id: info_respond.id,
    weight: info_respond.weight,
    sprites: info_respond.sprites,
  };
}

export type pokemonContextType = {
  allPokemons: PokemonType[];
  initAllPokemons: () => Promise<void>;
};
//#endregion

export async function getPokemonData(setter: Function): Promise<void> {
  const pokemonInfoCollection: Array<PokemonType> = new Array();

  const pokemonsSearchResponse = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );
  const pokemonSearchInfos: { name: string; url: string }[] =
    await pokemonsSearchResponse.json().then((data) => {
      return data.results;
    });

  const pokemonMappingData = await Promise.all(pokemonSearchInfos.map(async (searchInfo) => {
    const speciesInfo: PokemonSpeciesInfo | void = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${searchInfo.name}/`
    )
      .then((value) => value.json())
      .then((data) => mapperSpecies(data))
      .catch(() => console.log("Error species"));

    const pokemonInfo: PokemonInfo | void = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchInfo.name}/`
    )
      .then((value) => value.json())
      .then((data) => mapperInfo(data))
      .catch(() => console.log("Error info"));

    const pokemon: PokemonType = {
      pokemonInfo: pokemonInfo ? pokemonInfo : undefined,
      pokemonSearchInfo: searchInfo,
      pokemonSpeciesInfo: speciesInfo ? speciesInfo : undefined,
    };
    console.log("Pokemon:");
    console.log(pokemon);
    if (
      pokemon.pokemonInfo !== undefined &&
      pokemon.pokemonSearchInfo !== undefined &&
      pokemon.pokemonSpeciesInfo !== undefined
    ) {
      return pokemon
      pokemonInfoCollection.push(pokemon);
    }
    else{
      return undefined
    }
  }));

  pokemonMappingData.map((pokemon)=>{
    if(pokemon!==undefined){
      pokemonInfoCollection.push(pokemon)
    }
  })
  setter(pokemonInfoCollection);
}
