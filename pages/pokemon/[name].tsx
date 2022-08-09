import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import {
  getEvolvingChainNamesByUrl,
  getFilteredSprites,
  numberToThreeBasedString,
} from "../../components/helper/utilities";
import Layout from "../../components/Layout";
import Pokemon from "../../components/Pokemon";
import { getTypeColor } from "../../components/TypeColor";
import {
  IChainEntry,
  IPokemonBase,
  IPokemonInfo,
} from "../../components/types/PokemonInterfaces";

function PokemonDetail({ pokemonInfo, evolvingChainPokemons }: IPokemonBase) {
  //#region Variables

  let pokeIndex = ("000" + pokemonInfo.id).slice(-3).toString();

  const pokeName: string =
    pokemonInfo.name[0].toUpperCase() + pokemonInfo.name.slice(1);

  let thumbnailUrls: string[] = getFilteredSprites(
    pokeIndex,
    pokemonInfo.sprites
  );
  const [selectedImageUrl, setSelectedImageUrl] = useState(
    thumbnailUrls.slice(-1)[0]
  );
  //#endregion

  useEffect(() => {
    setSelectedImageUrl(thumbnailUrls.slice(-1)[0]);
  }, [pokeIndex]);

  //#region Functions
  const renderTypes = () =>
    pokemonInfo.types.map((type, index) => {
      const color = getTypeColor(type.type.name);
      return (
        <li
          key={type.slot}
          className={`px-2 py-1 rounded text-white`}
          style={{ backgroundColor: `${color}` }}
        >
          {type.type.name}
        </li>
      );
    });

  const renderStats = () =>
    pokemonInfo.stats.map((stat, index) => (
      <div key={index} className="my-2 rounded p-1 bg-slate-700">
        <div
          className="bg-slate-900 rounded px-2"
          style={{ width: `${stat.base_stat}%` }}
        >
          {stat.base_stat}
        </div>
      </div>
    ));

  const renderEvolutionChain = () =>
    evolvingChainPokemons
      ? evolvingChainPokemons.map((chainEntry, index) => (
          <div key={index}>
            <Pokemon
              name={chainEntry.name}
              index={pokemonInfo.id + chainEntry.indexOffset - 1}
            />
          </div>
        ))
      : null;

  const renderImages = () => {
    return thumbnailUrls.map((url, index) => (
      <div
        key={index}
        className="bg-slate-400 bg-opacity-10 rounded-full my-8 hover:bg-opacity-50
        transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 hover:bg-slate-800 duration-300"
      >
        <button onClick={() => setSelectedImageUrl(url)}>
          <Image
            src={`${url}`}
            height={200}
            width={200}
            alt={pokemonInfo.name}
            placeholder={"blur"}
            blurDataURL="/blackedPokemon.png"
          />
        </button>
      </div>
    ));
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
          alt={pokemonInfo.name}
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
        <div>{renderEvolutionChain()}</div>
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
    const pokemonInfo: IPokemonInfo = await species_response
      .json()
      .then((value) => {
        return {
          id: value.id,
          name: value.name,
          stats: pokemon.stats,
          types: pokemon.types,
          sprites: pokemon.sprites,
          evolution_chain_url: value.evolution_chain.url,
        };
      });

    // get evolving - chain
    const evolvingChainPokemons = await getEvolvingChainNamesByUrl(
      pokemonInfo.evolution_chain_url,
      pokemon.name
    );

    return {
      props: {
        pokemonInfo,
        evolvingChainPokemons,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
