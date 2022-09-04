import { GetServerSideProps } from "next";
import React, { ReactElement, useEffect, useState } from "react";
import { GetPokemonLanguageName } from "../../../components/helper/language";
import { capitalize } from "../../../components/helper/utilities";
import Layout from "../../../components/Layout";
import PokemonLayout from "../../../components/layouts/PokemonLayout";
import Pokemon from "../../../components/Pokemon";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { usePokemonInfo } from "../../../context/Pokemon/PokemonInfoContext";

interface PokeId {
  id: number;
}

function Evolutions({ id }: PokeId) {
  const { initPokemonInfo, pokemonData } = usePokemonInfo();
  const { selectedLanguage } = useLanguage();
  const [pokemonName, setPokemonName] = useState("");

  useEffect(() => {
    const initComponents = async () => {
      if (pokemonData === null) {
        await initPokemonInfo(id);
      }

      if (pokemonData !== null && pokemonData.pokemonInfo?.id !== id) {
        await initPokemonInfo(id);
      } else {
      }
    };
    initComponents();
  }, [id]);

  const renderEvolutionChain = () =>
    pokemonData?.evolvingChain
      ? pokemonData.evolvingChain.map((chainEntry, index) => {
          if (index < pokemonData.evolvingChain.length - 1) {
            return (
              <div>
                <div
                  key={index}
                  className="m-5 flex flex-row place-content-evenly"
                >
                  <div className="">
                    <Pokemon
                      name={chainEntry.name}
                      index={
                        pokemonData!.pokemonInfo!.id + chainEntry.indexOffset
                      }
                    />
                  </div>
                  <p className="place-self-center">Level xy</p>
                  <div>
                    <Pokemon
                      name={chainEntry.name}
                      index={
                        pokemonData!.pokemonInfo!.id +
                        chainEntry.indexOffset +
                        1
                      }
                    />
                  </div>
                </div>
                <p className="text-center mb-5">
                  {capitalize(chainEntry.name)} evolves to{" "}
                  {capitalize(pokemonData.evolvingChain[index + 1].name)}
                </p>
                <hr />
                <br />
              </div>
            );
          } else {
            return;
          }
        })
      : null;

  return (
    <Layout title={GetPokemonLanguageName()}>
      <div className="text-5xl mb-16 text-center text-stone-300">
        Evolutions for {GetPokemonLanguageName()}
      </div>

      <div>{renderEvolutionChain()}</div>
    </Layout>
  );
}

Evolutions.getLayout = function getLayout(page: ReactElement) {
  return <PokemonLayout menuName="evolutions">{page}</PokemonLayout>;
};
export default Evolutions;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.query.pokeId;
    return {
      props: {
        id,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
