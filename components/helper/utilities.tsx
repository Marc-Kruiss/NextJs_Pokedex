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
    generations : [{name:string,testnames:string[]}]
  };
}

export function getFilteredSprites(
  pokeIndex: string,
  sprites: Record<string, string>
): string[] {
  // set thumbnail image urls
  const spriteConfig:ISpriteConfig = {
    version:{
      generations:[
        {name:"hello",testnames:["esf","sef"]},
        {name:"hello",testnames:["esf","sef"]},
      ]
    }

  };

  /*versions: {
      "generation-i": [
        { "red-blue": ["front_default", "back_default"] },
        { yellow: ["front_default", "back_default"] },
      ],
    }, */
  const spriteNames = ["front_default", "back_default"];
  const versionNames = ["red-blue"];

  const initThumbnailUrls: string[] = spriteNames.map((spriteName) =>
    sprites[spriteName] ? sprites[spriteName] : ""
  );

  initThumbnailUrls.push(
    `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`
  );
  return initThumbnailUrls;
}
