import { IChainEntry } from "../types/PokemonInterfaces";
import { mapMoveInfo, mapTypeInfo } from "./mapper";
import { MoveInfo, TypeInfo } from "./pokemonContext";

export function capitalize(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

export function numberToThreeBasedString(number: number) {
  return ("000" + number).slice(-3).toString();
}

export async function getTypeInfoByUrl(url: string) {
  const type_response = await fetch(url);
  const typeInfo: TypeInfo = await type_response
    .json()
    .then((data) => mapTypeInfo(data));

  return typeInfo;
}

export async function getMoveInfoByUrl(url: string) {
  const move_response = await fetch(url);
  const moveInfo: MoveInfo = await move_response
    .json()
    .then((data) => mapMoveInfo(data));

  return moveInfo;
}

export async function getEvolvingChainNamesByUrl(
  evolution_chain_url: string,
  currentPokeName: string
) {
  const evolutionChainUrl = evolution_chain_url;
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChain = await evolutionChainResponse.json();

  var pokemons: { name: string; url: string; id: number }[] = [];

  var chainState = evolutionChain.chain;
  while (chainState.evolves_to.length != 0) {
    // while next evolution exists
    pokemons = [...pokemons, chainState.species];
    chainState = chainState.evolves_to[0];
  }
  pokemons = [...pokemons, chainState.species];

  await Promise.all(
    pokemons.map(async (pokemon) => {
      const speciesResponse = await fetch(pokemon.url);
      await speciesResponse.json().then((data) => (pokemon.id = data.id));
    })
  );

  let chainEntries: IChainEntry[] = new Array<IChainEntry>(pokemons.length);
  for (let i = 0; i < pokemons.length; i++) {
    chainEntries[i] = {
      index: pokemons[i].id,
      name: pokemons[i].name,
    };
  }

  return chainEntries;
}

interface ISpriteConfig {
  version: {
    generationName: string;
    subVersion: { subversionName: string; spriteNames: string[] }[];
  }[];
}

export function getFilteredSprites(pokeIndex: string, sprites: any): string[] {
  // set thumbnail image urls
  const spriteConfig: ISpriteConfig = {
    version: [
      {
        generationName: "generation-i",
        subVersion: [
          {
            subversionName: "red-blue",
            spriteNames: ["front_default", "back_default"],
          },
          {
            subversionName: "yellow",
            spriteNames: ["front_default", "back_default"],
          },
        ],
      },
      {
        generationName: "generation-vii",
        subVersion: [
          {
            subversionName: "ultra-sun-ultra-moon",
            spriteNames: ["front_default", "front_female"],
          },
        ],
      },
    ],
  };

  let additionalThumbnailUrls: string[] = new Array();

  // get official image
  additionalThumbnailUrls.push(
    `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`
  );

  // get default images
  const spriteNames: string[] = [
    "front_default",
    "back_default",
    "front_shiny",
    "back_shiny",
  ];

  const defaultUrls = spriteNames.map((spriteName) =>
    sprites[spriteName] ? sprites[spriteName] : ""
  );
  additionalThumbnailUrls = additionalThumbnailUrls.concat(defaultUrls);

  // get subversion images
  /*
  spriteConfig.version.forEach((generation) => {
    generation.subVersion.forEach((subVersion) => {
      const subversionSprites =
        sprites.versions[generation.generationName][subVersion.subversionName];
      subVersion.spriteNames.forEach((spriteName) => {
        subversionSprites[spriteName]
          ? additionalThumbnailUrls.push(subversionSprites[spriteName])
          : null;
      });
    });
  });*/

  return additionalThumbnailUrls;
}
