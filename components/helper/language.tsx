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
  } = await response.json().then((value) => value);

  const languageName = names.names
    .filter((n) => n.language.name === currentLanguageShortTerm)
    .at(0);

  const pokemonLanguageName = languageName
    ? languageName.name
    : names.defaultName;
  setValueMethod(pokemonLanguageName);
};
