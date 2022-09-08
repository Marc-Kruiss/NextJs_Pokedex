import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { ReactElement, useEffect, useState } from "react";
import { GetPokemonLanguageName } from "../../../components/helper/language";
import { IMove, MoveInfo } from "../../../components/helper/pokemonContext";
import Layout from "../../../components/Layout";
import PokemonLayout from "../../../components/layouts/PokemonLayout";
import { getTypeColor } from "../../../components/TypeColor";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { usePokemonInfo } from "../../../context/Pokemon/PokemonInfoContext";
interface PokeId {
  id: number;
}

function Moves({ id }: PokeId) {
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

  const RenderMoveInfo = (move: MoveInfo): React.ReactNode => {
    return (
      <div className="">
        <div className="flex flex-col m-2">
          <p>Power Points {move.pp}</p>
          <p>Accuracy {move.accuracy}</p>
          <p>Power {move.power}</p>
        </div>
      </div>
    );
  };

  return pokemonData ? (
    <div className="w-full">
      <Layout title={GetPokemonLanguageName()}>
        <div>
          {pokemonData?.pokemonInfo?.moves.map((move, index) => {
            const color = getTypeColor(move.info.type.name);
            return (
              <div
                className="flex flex-row place-content-between bg-slate-900 my-1 mx-4"
                key={index}
                style={{ backgroundColor: `${color}` }}
              >
                <div className="self-center ml-5">
                <div className="first-letter:uppercase text-2xl ">{move.move.name}</div>
                <p className="first-letter:uppercase font-extralight text-black">{move.info.type.name}</p>
                </div>
                

                <div>{move.info ? RenderMoveInfo(move.info) : "No Info"}</div>
              </div>
            );
          })}
        </div>
      </Layout>
    </div>
  ) : (
    <div>Loading</div>
  );
}
Moves.getLayout = function getLayout(page: ReactElement) {
  return <PokemonLayout menuName="moves">{page}</PokemonLayout>;
};
export default Moves;

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
