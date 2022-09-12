import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { GetPokemonLanguageName } from "../../../components/helper/language";
import { capitalize } from "../../../components/helper/utilities";
import Layout from "../../../components/Layout";
import PokemonLayout from "../../../components/layouts/PokemonLayout";
import Pokemon from "../../../components/Pokemon";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { usePokemonInfo } from "../../../context/Pokemon/PokemonInfoContext";

function Evolutions() {
  const router = useRouter();
  const id = parseInt((router.query.pokeId||"1").toString());

  const { initPokemonInfo, pokemonData } = usePokemonInfo();
  const { selectedLanguage } = useLanguage();
  const [pokemonName, setPokemonName] = useState("");

  useEffect(() => {
    const initComponents = async () => {
      if (pokemonData === null) {
        console.log("Load pokemon");
        await initPokemonInfo(id);
      } else if (pokemonData.pokemonInfo?.id != id) {
        console.log("Reload pokemon");
        await initPokemonInfo(id);
      } else {
        console.log("Already loaded");
      }
    };
    initComponents();
  }, [id]);

  const renderEvolutionChain = () =>{
    if (!pokemonData) return <div>Loading...</div>

    return pokemonData.evolvingChain.map((chainEntry, index) => {
          if (index < pokemonData.evolvingChain.length - 1) {
            return (
              <div key={index}>
                <div className="m-5 flex flex-row place-content-evenly">
                  <div className="">
                    <Pokemon name={chainEntry.name} index={chainEntry.index} />
                  </div>
                  <p className="place-self-center">Level xy</p>
                  <div>
                    <Pokemon
                      name={chainEntry.name}
                      index={pokemonData.evolvingChain[index + 1].index}
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
      }

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
