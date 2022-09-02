import Layout from "../components/Layout";
import React, { useEffect, useMemo, useState } from "react";
import Pokemon from "../components/Pokemon";
import { GetStaticProps } from "next";
import { PokemonListResponse } from "../components/types/PokemonInterfaces";
import { mapPokemonListResponse } from "../components/helper/mapper";
import { AiOutlineSearch } from "react-icons/ai";
import { stringify } from "querystring";
import { usePokemonInfo } from "../context/Pokemon/PokemonInfoContext";
import { PokemonType } from "../components/helper/pokemonContext";

interface HomeData {
  initialPokemon: PokemonListResponse;
}

export default function Home({ initialPokemon }: HomeData) {
  const [searchInput, setSearchInput] = useState("");
  const [pokemon, setPokemon] = useState<PokemonListResponse>(initialPokemon);

  //const [pagePokemonAmount, setPagePokemonAmount] = useState(20);
  const [offset, setOffset] = useState(0);

  //const { initAllPokemons, allPokemons } = usePokemons();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      filterPokemons(searchInput);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  /*useEffect(() => {
    if (allPokemons.length === 0) {
      initAllPokemons().then(() => console.log(allPokemons));
    } else {
      console.log(allPokemons);
    }
  }, []);*/

  const fetchPokemon = async (url:string,isNext: boolean) => {
    const response = await fetch(url);
    const nextPokemon: PokemonListResponse = await response
      .json()
      .then((value) => mapPokemonListResponse(value));

    setOffset(isNext ? offset + 20 : offset - 20);
    setPokemon(nextPokemon);
  };

  const filterPokemons = async (searchTerm: string) => {
    if (searchTerm == null || searchTerm.trim() === "") {
      return;
    }

    const response = await fetch(`/api/${searchTerm}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const filteredPokemons = await response.json().then((data) => {
      return data.filteredPokemons;
    });

    const data: PokemonListResponse = {
      nextUrl: "",
      previousUrl: "",
      pokemonList: filteredPokemons,
    };
    setPokemon(data);
  };

  return (
    <Layout title={"PokeDex"}>
      <div className="flex flex-col justify-center">
        <AiOutlineSearch className="absolute left-7 lg:ml-[11rem] text-black size text-xl" />
        <input
          type="text"
          className="text-gray-700 rounded-md px-16 py-2 mx-5 bg-slate-300
          focus:ring-2 focus:ring-blue-500 focus:outline-none  placeholder-slate-400 ring-1 ring-slate-200 shadow-sm"
          placeholder="Search here..."
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 p-5">
        
        {pokemon.pokemonList.map((info, index) => (
          <div>
            <Pokemon
            name={info.name}
            key={index}
            index={index+1+offset}
          />
            </div>
        ))}
        
      </div>

      <div className="mt-10 flex justify-center gap-5">
        <button
          disabled={pokemon.previousUrl===null}
          className="px-3 py-1 bg-slate-900 rounded-lg disabled:bg-gray-600"
          onClick={() => fetchPokemon(pokemon.previousUrl,false)}
        >
          prev
        </button>
        <button
          disabled={pokemon.nextUrl===null}
          className="px-3 py-1 bg-slate-900 rounded-lg disabled:bg-gray-600"
          onClick={() => fetchPokemon(pokemon.nextUrl,true)}
        >
          next
        </button>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");

  //const allPokemons = await getAllPokemons()
  const initialPokemon: PokemonListResponse = await response
    .json()
    .then((value) => mapPokemonListResponse(value));

  return {
    props: {
      initialPokemon: initialPokemon,
    },
  };
};
