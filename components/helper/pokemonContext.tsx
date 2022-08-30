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
      evolutionChain: undefined,
      names: [],
    };
  }
  return {
    base_happiness: -1,
    evolutionChain: undefined,
    names: [],
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
  allPokemons: PokemonType[] | undefined;
  initAllPokemons: (setter: Function) => Promise<void>;
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

  pokemonSearchInfos.map(async (searchInfo) => {
    let speciesInfo: PokemonSpeciesInfo | undefined = undefined;
    let pokemonInfo: PokemonInfo | undefined = undefined;

    const pokemonSpeciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${searchInfo.name}`
    )
      .then((value) => value.json)
      .then((data) => (speciesInfo = mapperSpecies(data)))
      .catch((error) => console.log("Error species"));

    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchInfo.name}`
    )
      .then((value) => value.json)
      .then((data) => (pokemonInfo = mapperInfo(data)))
      .catch((error) => console.log("Error info"));

    const pokemon: PokemonType = {
      pokemonInfo: pokemonInfo,
      pokemonSearchInfo: searchInfo,
      pokemonSpeciesInfo: speciesInfo,
    };
    pokemonInfoCollection.push(pokemon);
  });
  setter(pokemonInfoCollection);
}
