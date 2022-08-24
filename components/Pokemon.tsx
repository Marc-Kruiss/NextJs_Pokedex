import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "../context/Language/LanguageContext";

interface Props {
  name: string;
  index: number;
}

function Pokemon({ name, index }: Props) {
  const pokeIndex = ("000" + (index + 1)).slice(-3);
  const { selectedLanguage } = useLanguage();
  const [pokemonName, setPokemonName] = useState("");

  useEffect(() => {
    const getCorrectLanguageName = async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${name}`
      );

      const names: {
        defaultName: string;
        names: { language: { name: string }; name: string }[];
      } = await response.json().then((value) => value);

      const languageName = names.names
        .filter((n) => n.language.name === selectedLanguage.shortTerm)
        .at(0);

      const pokemonLanguageName = languageName
        ? languageName.name
        : names.defaultName;
      setPokemonName(pokemonLanguageName);
    };

    getCorrectLanguageName().catch(console.error);
  }, [name, selectedLanguage]);

  return (
    <Link href={`/pokemon/${name}`}>
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
