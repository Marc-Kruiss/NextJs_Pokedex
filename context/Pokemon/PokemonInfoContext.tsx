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
  pokemonData:null,
  initPokemonInfo: async () => {},
};

const PokemonContext = createContext<pokemonContextType>(
  pokemonContextDefaultValues
);
export function usePokemonInfo() {
  return useContext(PokemonContext);
}

//#endregion

//#region provider
type Props = {
  children: ReactNode;
};

export function PokemonProvider({ children }: Props) {
  const [currentPokemonInfo, setCurrentPokemonInfo] = useState<PokemonType|null>(null)

  const initAllPokemons = async (setter:Function,pokeIndex:number) => {
    await getPokemonData(setter, pokeIndex);
  };

  const value:pokemonContextType = {
    pokemonData:currentPokemonInfo,
    initPokemonInfo:(id)=> initAllPokemons(setCurrentPokemonInfo,id),
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
