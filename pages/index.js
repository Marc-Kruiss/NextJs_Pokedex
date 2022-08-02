import Head from "next/head";
import Image from "next/image";
import Layout from "../components/Layout";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Pokemon from "../components/Pokemon";

export default function Home({ initialPokemon }) {
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [offset, setOffset] = useState(0);

  const fetchPokemon = async (url, isNext) => {
    const response = await fetch(url);
    const nextPokemon = await response.json();

    setOffset(next ? offset + 20 : offset - 10);
    setPokemon(nextPokemon);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 ">
        {pokemon.results.map((monster, index) => (
          <Pokemon key={index} pokemon={monster} index={index + offset} />
        ))}
      </div>

      <div className="mt-10 flex justify-center gap-5">
        <button
          disabled={!pokemon.previous}
          className="px-3 py-1 bg-slate-900 rounded-lg disabled:bg-gray-600"
          onClick={() => fetchPokemon(pokemon.previous, false)}
        >
          prev
        </button>
        <button
          disabled={!pokemon.next}
          className="px-3 py-1 bg-slate-900 rounded-lg disabled:bg-gray-600"
          onClick={() => fetchPokemon(pokemon.next, true)}
        >
          next
        </button>
      </div>
    </Layout>
  );
}

export async function getStaticProps(context) {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon");
  const initialPokemon = await response.json();

  return {
    props: {
      initialPokemon,
    },
  };
}
