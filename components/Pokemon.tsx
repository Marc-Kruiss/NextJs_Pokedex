import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/Language/LanguageContext";
import { getCorrectLanguageName } from "./helper/language";

interface Props {
  name: string;
  index: number;
}

function Pokemon({ name, index }: Props) {
  const pokeIndex = ("000" + index).slice(-3);
  const { selectedLanguage } = useLanguage();
  const [pokemonName, setPokemonName] = useState("");

  useEffect(() => {
    getCorrectLanguageName(
      selectedLanguage.shortTerm,
      name,
      setPokemonName
    ).catch(console.error);
  }, [name, selectedLanguage]);

  return (
    <Link href={`/pokemon/${index}`}>
      <div
        className="bg-slate-900 rounded p-5 flex flex-col justify-center items-center relative shadow-md
      transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-slate-800 duration-300"
      >
        <span className="absolute text-5xl text-slate-500 top-0 right-3 font-bold">
          #{pokeIndex}
        </span>

        <Image
          src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`}
          height={150}
          width={150}
          alt={name}
          loading="lazy"
          placeholder={"blur"}
          blurDataURL="/blackedPokemon.png"
        />
        <span className="uppercase font-semibold tracking-wider text-amber-400">
          {pokemonName}
        </span>
      </div>
    </Link>
  );
}

export default Pokemon;
