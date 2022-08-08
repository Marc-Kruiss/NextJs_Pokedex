import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  name: string;
}

function Pokemon({name}: Props) {
  //const pokeIndex = ("000" + (index + 1)).slice(-3);
  const [pokemonName, setPokemonName] = useState(name)
  const [pokeIndex, setPokeIndex] = useState("");

  const getPokeIndex = async () => {
    const poke_response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const pokemon = await poke_response.json();
    const indexValue = ("000" + pokemon.id).slice(-3);
    setPokeIndex(indexValue);
  };

  useEffect(() => {
    getPokeIndex();
  }, []);

  return (
    <Link href={`/pokemon/${pokemonName}`}>
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
          alt={pokemonName}
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
