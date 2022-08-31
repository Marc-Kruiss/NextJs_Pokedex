import Layout from "../components/Layout";
import React, { useEffect, useMemo, useState } from "react";
import Pokemon from "../components/Pokemon";
import { GetStaticProps } from "next";
import { PokemonListResponse } from "../components/types/PokemonInterfaces";
import { mapPokemonListResponse } from "../components/helper/mapper";
import { AiOutlineSearch } from "react-icons/ai";
import { stringify } from "querystring";
import { usePokemons } from "../context/Pokemon/PokemonInfoContext";
import { PokemonType } from "../components/helper/pokemonContext";

interface HomeData {
  initialPokemon: PokemonListResponse;
}

export default function Home({ initialPokemon }: HomeData) {
  const [searchInput, setSearchInput] = useState("");
  const [pokemon, setPokemon] = useState<PokemonListResponse>(initialPokemon);

  const [pagePokemonAmount, setPagePokemonAmount] = useState(50)
  const [offset, setOffset] = useState(0);

  const { initAllPokemons, allPokemons } = usePokemons();


  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      filterPokemons(searchInput);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    if (allPokemons === undefined) {
      initAllPokemons().then(()=>console.log("Initialized Pokemons..."))
    } else {
      console.log("Already initialized Pokemons...")
    }
  }, []);

  const fetchPokemon = async (isNext: boolean) => {
    /*const response = await fetch(url);
    const nextPokemon: PokemonListResponse = await response
      .json()
      .then((value) => mapPokemonListResponse(value));*/

    setOffset(isNext ? offset + pagePokemonAmount : offset - pagePokemonAmount);
    //setPokemon(nextPokemon);
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

      <div>
        <p>{allPokemons === undefined ? "Not Loaded" : "Loaded"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 p-5">
        {/*pokemon.pokemonList.map((info, index) => (
          <Pokemon
            name={info.name}
            key={index}
            index={info.id ? info.id : offset + index}
          />
        ))*/}
        {allPokemons !== undefined ? (
          allPokemons.sort(x=>x.pokemonInfo!.id).slice(offset,pagePokemonAmount+offset).map((pokemon, index) => (
            <Pokemon
              name={pokemon.pokemonSearchInfo.name}
              index={pokemon.pokemonInfo ? pokemon.pokemonInfo.id : 1}
              key={index}
            />
          ))
        ) : (
          <p>NotFound</p>
        )}
      </div>

      <div className="mt-10 flex justify-center gap-5">
        <button
          disabled={offset-pagePokemonAmount<0}
          className="px-3 py-1 bg-slate-900 rounded-lg disabled:bg-gray-600"
          onClick={() => fetchPokemon(false)}
        >
          prev
        </button>
        <button
          disabled={false}
          className="px-3 py-1 bg-slate-900 rounded-lg disabled:bg-gray-600"
          onClick={() => fetchPokemon(true)}
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
