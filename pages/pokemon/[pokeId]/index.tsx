import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { useState, useEffect, ReactElement } from "react";
import useSWR from "swr";
import { mapPokemonInfo } from "../../../components/helper/mapper";
import {
  getEvolvingChainNamesByUrl,
  getFilteredSprites,
  numberToThreeBasedString,
} from "../../../components/helper/utilities";
import Layout from "../../../components/Layout";
import Pokemon from "../../../components/Pokemon";
import { getTypeColor } from "../../../components/TypeColor";
import {
  IChainEntry,
  IPokemonBase,
  IPokemonInfo,
} from "../../../components/types/PokemonInterfaces";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Link from "next/link";
import PokemonLayout from "../../../components/layouts/PokemonLayout";
import { NextRouter, useRouter } from "next/router";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { getCorrectLanguageName } from "../../../components/helper/language";
import { usePokemonInfo } from "../../../context/Pokemon/PokemonInfoContext";

interface PokeId {
  id: number;
}

function PokemonDetail({ id }: PokeId) {
  //#region Variables
  const { selectedLanguage } = useLanguage();

  const { initPokemonInfo, pokemonData } = usePokemonInfo();

  let pokeIndex = ("000" + id).slice(-3).toString();

  const [pokemonName, setPokemonName] = useState("");

  let thumbnailUrls: string[] = [];
  const [selectedImageUrlIndex, setSelectedImageUrlIndex] = useState<number>(0);

  const displayName = () => {
    if (pokemonData !== null) {
      const languageName = pokemonData.pokemonSpeciesInfo?.names.filter(
        (languageName) => (
          languageName.language.name.toLowerCase() ===
            selectedLanguage.shortTerm.toLowerCase()
        )
      ).at(0)
      if (languageName !== undefined) {
        return languageName.name;
      } else {
        return pokemonData.pokemonSpeciesInfo!.name;
      }
    } else {
      return "";
    }
  };

  //const [selectedImageUrlIndex, setSelectedImageUrlIndex] = useState(0);
  //#endregion

  useEffect(() => {
    const initComponents = async () => {
      if (pokemonData === null) {
        await initPokemonInfo(id);
      }

      if (pokemonData !== null && pokemonData.pokemonInfo?.id !== id) {
        await initPokemonInfo(id);
        getCorrectLanguageName(
          selectedLanguage.shortTerm,
          pokemonData.pokemonSpeciesInfo!.name,
          setPokemonName
        );
        thumbnailUrls = pokemonData.pokemonInfo!.sprites;
      } else {
      }
    };
    initComponents();
  }, [id]);

  useEffect(() => {
    if (pokemonData !== null) {
      getCorrectLanguageName(
        selectedLanguage.shortTerm,
        pokemonData.pokemonSpeciesInfo!.name,
        setPokemonName
      );
    }
  }, [selectedLanguage]);

  //#region Functions
  const renderTypes = () =>
    pokemonData?.pokemonInfo?.types.map((type, index) => {
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

  const renderStats = () => {
    const values: number[] = pokemonData!.pokemonInfo!.stats.map(
      (s) => s.base_stat
    );
    const maxValue = Math.max(...values);
    return pokemonData!.pokemonInfo!.stats.map((stat, index) => (
      <div key={index} className="my-2 rounded p-1 bg-slate-700">
        <div
          className="bg-slate-900 rounded px-2"
          style={{ width: `${(stat.base_stat / maxValue) * 100}%` }}
        >
          <p className="w-max ">
            {stat.stat.name.toUpperCase()} : {stat.base_stat}
          </p>
        </div>
      </div>
    ));
  };

  const renderEvolutionChain = () =>
    pokemonData?.evolvingChain
      ? pokemonData.evolvingChain.map((chainEntry, index) => (
          <div key={index} className="m-5">
            <Pokemon
              name={chainEntry.name}
              index={pokemonData!.pokemonInfo!.id + chainEntry.indexOffset}
            />
          </div>
        ))
      : null;

  const renderImages = () => {
    return (
      <div>
        <Carousel
          animationHandler={"slide"}
          showThumbs={false}
          emulateTouch={true}
          showStatus={false}
          autoPlay={true}
          interval={2000}
          infiniteLoop={true}
          autoFocus={false}
          className="m-5"
        >
          {pokemonData?.pokemonInfo?.sprites.map((url, index) => (
            <div
              key={index}
              className="bg-slate-400 bg-opacity-10 rounded-sm my-8 hover:bg-opacity-50
                      transition ease-in-out delay-100 hover:-translate-y-1 hover:scale-110 hover:bg-slate-800 duration-300"
            >
              <button onClick={() => setSelectedImageUrlIndex(index)}>
                <Image
                  loading="eager"
                  src={`${url}`}
                  height={200}
                  width={200}
                  alt={pokemonData!.pokemonSpeciesInfo!.name}
                  placeholder={"blur"}
                  blurDataURL="/blackedPokemon.png"
                />
              </button>
            </div>
          ))}
        </Carousel>
      </div>
    );
  };

  //#endregion

  return pokemonData ? (
    <div className="w-full">
      <Layout title={displayName()}>
        <div
          className="flex flex-wrap
      flex-col 
      lg:flex-row"
        >
          <div
            className="flex flex-col justify-center items-center  
        lg:w-1/2"
          >
            <span className="absolute lg:text-[300px] text-[150px] top-[8rem] font-bold text-slate-500">
              #{pokeIndex}
            </span>
            <Image
              src={
                pokemonData.pokemonInfo?.sprites[selectedImageUrlIndex]
                  ? pokemonData.pokemonInfo?.sprites[selectedImageUrlIndex]
                  : ""
              }
              height={400}
              width={400}
              quality={100}
              alt={pokemonData!.pokemonSpeciesInfo!.name}
              placeholder={"blur"}
              blurDataURL="/blackedPokemon.png"
            />
            <div>{renderImages()}</div>
          </div>

          <div
            className="bg-slate-800 rounded p-5
        flex flex-col 
        lg:w-1/2"
          >
            <ul className="flex gap-5">{renderTypes()}</ul>

            <div>{renderStats()}</div>
            <div>{renderEvolutionChain()}</div>
          </div>
        </div>
      </Layout>
    </div>
  ) : (
    <div>
      <h1>Loading Data..</h1>
    </div>
  );
}

PokemonDetail.getLayout = function getLayout(
  page: ReactElement,
  router: NextRouter
) {
  const { pokeId } = router.query;

  return pokeId && !Array.isArray(pokeId) ? (
    <PokemonLayout index={Number(pokeId)}>{page}</PokemonLayout>
  ) : (
    <div>Something went wrong</div>
  );
};
export default PokemonDetail;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.query.pokeId;
    /*const poke_response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${context.query.name}`
    );
    const pokemon_json = await poke_response.json();

    // get species info
    const species_info_url = pokemon_json.species.url;
    const species_response = await fetch(species_info_url);
    const pokemonInfo: IPokemonInfo = await species_response
      .json()
      .then((species_json) => mapPokemonInfo(species_json, pokemon_json));

    // get evolving - chain
    const evolvingChainPokemons = await getEvolvingChainNamesByUrl(
      pokemonInfo.evolution_chain_url,
      pokemon_json.name
    );
    console.log(evolvingChainPokemons);*/

    return {
      props: {
        id,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
