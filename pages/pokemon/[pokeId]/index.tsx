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
import { usePokemonInfo } from "../../../context/Pokemon/PokemonInfoContext";
import { GetPokemonLanguageName } from "../../../components/helper/language";

function PokemonDetail() {
  const router = useRouter();
  const id = parseInt((router.query.pokeId || "1").toString());

  //#region Variables
  const { selectedLanguage } = useLanguage();

  const { initPokemonInfo, pokemonData } = usePokemonInfo();

  let pokeIndex = ("000" + id).slice(-3).toString();

  let thumbnailUrls: string[] = [];
  const [selectedImageUrlIndex, setSelectedImageUrlIndex] = useState<number>(0);

  useEffect(() => {
    const initComponents = async () => {
      if (pokemonData === null) {
        console.log("Load pokemon");
        await initPokemonInfo(id);
      } else if (pokemonData.pokemonInfo?.id != id) {
        console.log("Reload pokemon");
        await initPokemonInfo(id);
      } else {
        console.log("Already loaded");
      }
    };
    initComponents();
  }, [id]);

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
            <Pokemon name={chainEntry.name} index={chainEntry.index} />
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

  if (!pokemonData) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <Layout title={GetPokemonLanguageName()}>
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
  );
}

PokemonDetail.getLayout = function getLayout(page: ReactElement) {
  return <PokemonLayout menuName="index">{page}</PokemonLayout>;
};
export default PokemonDetail;
