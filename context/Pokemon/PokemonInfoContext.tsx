import { useEffect, useMemo } from "react";
import { ReactNode, useContext, useState } from "react";
import { createContext } from "react";
import {
  getPokemonData,
  pokemonContextType,
  PokemonType,
} from "../../components/helper/pokemonContext";

//#endregion

//#region use effect

//#region context

const pokemonContextDefaultValues: pokemonContextType = {
  allPokemons: [],
  initAllPokemons: async () => {},
};

const PokemonContext = createContext<pokemonContextType>(
  pokemonContextDefaultValues
);
export function usePokemons() {
  return useContext(PokemonContext);
}

//#endregion

//#region provider
type Props = {
  children: ReactNode;
};

export function PokemonProvider({ children }: Props) {
  const [allPokemons, setAllPokemons] = useState<PokemonType[]>([]);

  const initAllPokemons = async () => {
    await getPokemonData(setAllPokemons, allPokemons);
  };

  const value = {
    allPokemons: allPokemons,
    initAllPokemons,
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
