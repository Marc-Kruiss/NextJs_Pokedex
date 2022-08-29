import { useEffect, useMemo } from "react";
import { ReactNode, useContext, useState } from "react";
import { createContext } from "react";
import {
  getPokemonData,
  pokemonContextType,
} from "../../components/helper/pokemonContext";

//#endregion

//#region use effect
const allAvailablePokemons = await getPokemonData();

//#region context
const pokemonContextDefaultValues: pokemonContextType = {
  shownPokemon: allAvailablePokemons.slice(0, 20),
  allPokemons: allAvailablePokemons,
  changePokemons: (index: number) => {},
};

const PokemonContext = createContext<pokemonContextType>(
  pokemonContextDefaultValues
);
export async function usePokemons() {
  return useContext(PokemonContext);
}

//#endregion

//#region provider
type Props = {
  children: ReactNode;
};

export function PokemonProvider({ children }: Props) {
  const [shownPokemons, setShownPokemons] = useState(
    allAvailablePokemons.splice(0, 20)
  );

  const changePokemons = (index:number) => {
    setShownPokemons(allAvailablePokemons.splice(0,20));
  };

  const value = {
    shownPokemon: shownPokemons,
    allPokemons: allAvailablePokemons,
    changePokemons,
  };

  return (
    <>
      <PokemonContext.Provider value={value}>
        {children}
      </PokemonContext.Provider>
    </>
  );
}
//#endregion
