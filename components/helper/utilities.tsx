import { IChainEntry } from "../types/PokemonInterfaces";

export function numberToThreeBasedString(number: number) {
  return ("000" + number).slice(-3).toString();
}

export async function getEvolvingChainNamesByUrl(
  evolution_chain_url: string,
  currentPokeName: string
) {
  const evolutionChainUrl = evolution_chain_url;
  const evolutionChainResponse = await fetch(evolutionChainUrl);
  const evolutionChain = await evolutionChainResponse.json();

  var names: string[] = [];

  var chainState = evolutionChain.chain;
  while (chainState.evolves_to.length != 0) {
    // while next evolution exists
    names = [...names, chainState.species.name];
    chainState = chainState.evolves_to[0];
  }
  names = [...names, chainState.species.name];

  const localCurrentIndex = names.findIndex(
    (n) => n.toLowerCase() === currentPokeName.toLowerCase()
  );

  let chainEntries: IChainEntry[] = new Array<IChainEntry>(names.length);
  for (let i = 0; i < names.length; i++) {
    chainEntries[i] = {
      indexOffset: i - localCurrentIndex,
      name: names[i],
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
  const spriteNames = ["front_default", "back_default"];

  additionalThumbnailUrls = spriteNames.map((spriteName) =>
    sprites[spriteName] ? sprites[spriteName] : ""
  );

  // get subversion images
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
  });

  

  
  return additionalThumbnailUrls;
}
