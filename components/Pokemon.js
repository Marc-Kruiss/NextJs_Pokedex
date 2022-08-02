import React from "react";
import Image from "next/image";

function Pokemon({ pokemon, index }) {
  const pokeIndex = ("000" + (index + 1)).slice(-3);

  return (
    <div className="bg-slate-900 rounded p-5 flex flex-col justify-center items-center relative">
      <span className="absolute text-5xl text-slate-500 top-0 right-3 font-bold">
        #{pokeIndex}
      </span>

      <Image
        src={`https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pokeIndex}.png`}
        height={150}
        width={150}
        alt={pokemon.name}
      />
      <span className="uppercase font-semibold tracking-wider text-amber-400">
        {pokemon.name}
      </span>
      
    </div>
  );
}

export default Pokemon;
