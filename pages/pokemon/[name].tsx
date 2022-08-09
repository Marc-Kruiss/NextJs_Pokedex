import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { numberToThreeBasedString } from "../../components/helper/utilities";
import Layout from "../../components/Layout";
import Pokemon from "../../components/Pokemon";
import { getTypeColor } from "../../components/TypeColor";
import { IPokemonBase } from "../../components/types/IPokemonBase";

interface Props {}

function PokemonDetail({ pokemon, evolvingChainPokemons }: IPokemonBase) {
  //#region useStates
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const [pokeIndex, setPokeIndex] = useState(
    ("000" + pokemon.id).slice(-3).toString()
  );
  //#endregion

  //#region useEffect
  useEffect(() => {
    // set big image url
    setSelectedImageUrl(
      `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`
    );

    // set thumbnail image urls
    const spriteNames = ["front_default", "back_default"];

    const initThumbnailUrls: string[] = spriteNames.map((spriteName) =>
      pokemon.sprites[spriteName] ? pokemon.sprites[spriteName] : ""
    );
    initThumbnailUrls.push(
      `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`
    );
    setThumbnailUrls(initThumbnailUrls);
  }, []);
  //#endregion

  //#region Variables
  const pokeName: string =
    pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
  //#endregion

  //#region Functions
  const renderTypes = () =>
    pokemon.types.map((type, index) => {
      const color = getTypeColor(type.name);
      return (
        <li
          key={index}
          className={`px-2 py-1 rounded text-white`}
          style={{ backgroundColor: `${color}` }}
        >
          {type.name}
        </li>
      );
    });

  const renderStats = () =>
    pokemon.stats.map((stat, index) => (
      <div key={index} className="my-2 rounded p-1 bg-slate-700">
        <div
          className="bg-slate-900 rounded px-2"
          style={{ width: `${stat.base_stat}%` }}
        >
          {stat.base_stat}
        </div>
      </div>
    ));

  const renderImages = () => {
    const spriteNames = ["front_default", "back_default"];
    return thumbnailUrls.map((url, index) => (
      <div
        key={index}
        className="bg-slate-400 bg-opacity-10 rounded-full my-8 hover:bg-opacity-50
        transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 hover:bg-slate-800 duration-300"
      >
        <button onClick={() => handleThumbnailClick(url)}>
          <Image
            src={`${url}`}
            height={200}
            width={200}
            alt={pokemon.name}
            placeholder={"blur"}
            blurDataURL="/blackedPokemon.png"
          />
        </button>
      </div>
    ));
  };

  const handleThumbnailClick = (thumbnailUrl: string) => {
    setSelectedImageUrl(thumbnailUrl);
  };

  //#endregion

  return (
    <Layout title={pokeName}>
      <div className="flex flex-col justify-center items-center">
        <span className="absolute text-[400px] font-bold text-slate-500">
          #{pokeIndex}
        </span>
        <Image
          src={selectedImageUrl}
          height={400}
          width={400}
          alt={pokemon.name}
          placeholder={"blur"}
          blurDataURL="/blackedPokemon.png"
        />
      </div>

      <div className="flex flex-row justify-center items-center gap-9">
        {renderImages()}
      </div>

      <div className="bg-slate-900 rounded p-5">
        <ul className="flex gap-5">{renderTypes()}</ul>

        <div>{renderStats()}</div>
        <div>
          {evolvingChainPokemons
            ? evolvingChainPokemons.map((pokemonUrl, index) => (
                <div key={index}>
                  <Pokemon
                    name={pokemonUrl.name}
                    index={index}
                  />
                </div>
              ))
            : null}
        </div>
      </div>
    </Layout>
  );
}

export default PokemonDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const poke_response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${context.query.name}`
    );
    const pokemon = await poke_response.json();

    // get species info
    const species_info_url = pokemon.species.url;
    const species_response = await fetch(species_info_url);
    const species = await species_response.json();

    // get evolving - chain
    const evolvingChainNames = await getEvolvingChainNames(species);
    console.log(evolvingChainNames);

    return {
      props: {
        pokemon,
        evolvingChainNames,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

async function getEvolvingChainNames(species: {
  evolution_chain: { url: any };
}) {
  const evolutionChainUrl = species.evolution_chain.url;
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
  return names;
}
