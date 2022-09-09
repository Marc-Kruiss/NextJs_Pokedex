import { useLanguage } from "../../context/Language/LanguageContext";
import { usePokemonInfo } from "../../context/Pokemon/PokemonInfoContext";

export const getCorrectLanguageName = async (
  currentLanguageShortTerm: string,
  defaultPokemonName: string,
  setValueMethod: Function
) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${defaultPokemonName}`
  );

  const names: {
    defaultName: string;
    names: { language: { name: string }; name: string }[];
  } = await response
    .json()
    .then((value) => value)
    .catch(() => console.log("Invalid Request"));

  const languageName = names.names
    .filter((n) => n.language.name === currentLanguageShortTerm)
    .at(0);

  const pokemonLanguageName = languageName
    ? languageName.name
    : names.defaultName;
  setValueMethod(pokemonLanguageName);
};

export const GetPokemonLanguageName = () => {
  const { pokemonData } = usePokemonInfo();
  const { selectedLanguage } = useLanguage();
  if (pokemonData !== null) {
    const languageName = pokemonData.pokemonSpeciesInfo?.names
      .filter(
        (languageName) =>
          languageName.language.name.toLowerCase() ===
          selectedLanguage.shortTerm.toLowerCase()
      )
      .at(0);
    if (languageName !== undefined) {
      return languageName.name;
    } else {
      return pokemonData.pokemonSpeciesInfo!.name;
    }
  } else {
    return "";
  }
};
