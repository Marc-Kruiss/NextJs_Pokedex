import Layout from "../components/Layout";
import React, { useState } from "react";
import Pokemon from "../components/Pokemon";
import { GetStaticProps } from "next";
import { PokemonListResponse } from "../components/types/PokemonInterfaces";
import { mapPokemonListResponse } from "../components/helper/mapper";
import { AiOutlineSearch } from "react-icons/ai";

export default function Home({
  initialPokemon,
}: {
  initialPokemon: PokemonListResponse;
}) {
  const [pokemon, setPokemon] = useState<PokemonListResponse>(initialPokemon);
  const [offset, setOffset] = useState(0);

  const fetchPokemon = async (url: string, isNext: boolean) => {
    const response = await fetch(url);
    const nextPokemon: PokemonListResponse = await response
      .json()
      .then((value) => mapPokemonListResponse(value));

    setOffset(isNext ? offset + 20 : offset - 20);
    setPokemon(nextPokemon);
  };

  return (
    <Layout title={"PokeDex"}>
      <div className="flex flex-col justify-center">
        <AiOutlineSearch className="absolute left-7 lg:left-14 text-black size text-xl"/>
        <input type="text" value={"sef"} className="text-gray-700 rounded-md px-16 py-2 mx-5 bg-slate-300" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 p-5">
        {pokemon.pokemonList.map((info, index) => (
          <Pokemon name={info.name} key={index} index={offset + index} />
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-5">
        <button
          disabled={!pokemon.previousUrl}
          className="px-3 py-1 bg-slate-900 rounded-lg disabled:bg-gray-600"
          onClick={() => fetchPokemon(pokemon.previousUrl, false)}
        >
          prev
        </button>
        <button
          disabled={!pokemon.nextUrl}
          className="px-3 py-1 bg-slate-900 rounded-lg disabled:bg-gray-600"
          onClick={() => fetchPokemon(pokemon.nextUrl, true)}
        >
          next
        </button>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

  const initialPokemon: PokemonListResponse = await response
    .json()
    .then((value) => mapPokemonListResponse(value));

  return {
    props: {
      initialPokemon: initialPokemon,
    },
  };
};
