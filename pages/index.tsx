import Layout from "../components/Layout";
import { useState } from "react";
import Pokemon from "../components/Pokemon";
import React from "react";
import { GetStaticProps } from "next";
import { IPokemonUrl } from "../components/types/IPokemonUrl";

interface PokemonListResponse {
  pokemonList: { name: string; url: string }[]; // replace with IPokemonBase interface
  previousUrl: string;
  nextUrl: string;
}
export default function Home(initialPokemon: PokemonListResponse) {
  const [pokemon, setPokemon] = useState<PokemonListResponse>(initialPokemon);
  const [offset, setOffset] = useState(0);

  const fetchPokemon = async (url: string, isNext: boolean) => {
    const response = await fetch(url);
    const nextPokemon = await response.json();

    setOffset(isNext ? offset + 20 : offset - 20);
    setPokemon(nextPokemon);
  };

  return (
    <Layout title="PokeDex">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {pokemon.pokemonList?.map((info, index) => (
          <div key={index}>
            <Pokemon name={info.name} />
          </div>
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

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

  const initialPokemon: PokemonListResponse = await response
    .json()
    .then((value) => {
      return {
        nextUrl: value.next,
        previousUrl: value.previous,
        pokemonList: value.results,
      };
    });
  console.log(initialPokemon);
  return {
    props: {
      initialPokemon,
    },
  };
};