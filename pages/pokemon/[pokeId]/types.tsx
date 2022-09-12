import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { ReactElement, useEffect, useState } from "react";
import { GetPokemonLanguageName } from "../../../components/helper/language";
import { TypeInfo } from "../../../components/helper/pokemonContext";
import Layout from "../../../components/Layout";
import PokemonLayout from "../../../components/layouts/PokemonLayout";
import { getTypeColor } from "../../../components/TypeColor";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { usePokemonInfo } from "../../../context/Pokemon/PokemonInfoContext";

function Types() {
  const router = useRouter();
  const id = parseInt(router.query.pokeId!.toString());

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

  const renderType = (entry: { name: string; url: string }) => {
    const color = getTypeColor(entry.name);
    return (
      <>
        <div
          className={`px-2 py-1 rounded text-white`}
          style={{ backgroundColor: `${color}` }}
        >
          {entry.name}
        </div>
      </>
    );
  };

  const RenderTypeInfo = (info: TypeInfo): React.ReactNode => {
    return (
      <div className="m-1 my-4 mb-12">
        <p className="uppercase text-xl mb-5">2x Damage to</p>
        <div className="flex flex-row mb-5">
          {info.damage_relations.double_damage_to.map((entry, index) => {
            return (
              <div key={index} className="mx-2">
                {renderType(entry)}
              </div>
            );
          })}
        </div>

        <p className="uppercase text-xl mb-5">2x Damage from</p>
        <div className="flex flex-row">
          {info.damage_relations.double_damage_from.map((entry, index) => {
            return (
              <div key={index} className="mx-2">
                {renderType(entry)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Layout title={GetPokemonLanguageName()}>
        <div>
          <div className="flex flex-row mb-5 justify-center">
            <Image
              src={
                pokemonData?.pokemonInfo?.sprites[0]
                  ? pokemonData.pokemonInfo?.sprites[0]
                  : ""
              }
              height={200}
              width={200}
              quality={100}
              alt={pokemonData!.pokemonSpeciesInfo!.name}
              placeholder={"blur"}
              blurDataURL="/blackedPokemon.png"
            />
            <div className="flex flex-col place-content-evenly items-center w-2/5">
              {pokemonData?.pokemonInfo?.types.map((type, index) => {
                const color = getTypeColor(type.type.name);
                return (
                  <div
                    key={type.slot}
                    className={`px-2 py-1 rounded text-white`}
                    style={{ backgroundColor: `${color}` }}
                  >
                    {type.type.name}
                  </div>
                );
              })}
            </div>
          </div>

          {pokemonData?.pokemonInfo?.types.map((type, index) => {
            const color = getTypeColor(type.type.name);

            return (
              <>
                <div
                  key={type.slot}
                  className={`px-2 py-1 rounded text-white text-center uppercase text-2xl mx-5`}
                  style={{ backgroundColor: `${color}` }}
                >
                  {type.type.name}
                </div>

                <div>{type.info ? RenderTypeInfo(type.info) : "No Info"}</div>
              </>
            );
          })}
        </div>
      </Layout>
    </div>
  );
}

Types.getLayout = function getLayout(page: ReactElement) {
  return <PokemonLayout menuName="types">{page}</PokemonLayout>;
};
export default Types;
