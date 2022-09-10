import { Dropdown } from "flowbite-react";
import { GetServerSideProps } from "next";
import Image from "next/image";
import React, { ReactElement, useEffect, useState } from "react";
import { AiOutlineIssuesClose } from "react-icons/ai";
import { RiCloseCircleFill } from "react-icons/ri";
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

  enum filterTypes {
    Name,
    Type,
    PowerPoints,
  }
  const [selectedFilter, setSelectedFilter] = useState<number | null>(null);
  const [isAsc, setIsAsc] = useState(true);

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

  const RenderFilterTypes = () => {
    console.log(Object.keys(filterTypes));
    return (
      <Dropdown
        label={selectedFilter != null ? filterTypes[selectedFilter] : "Filter"}
      >
        {Object.keys(filterTypes)
          .filter((v) => isNaN(Number(v)))
          .map((key, index) => (
            <Dropdown.Item onClick={() => setSelectedFilter(index)} key={index}>
              {key}
            </Dropdown.Item>
          ))}
      </Dropdown>
    );
  };

  const compare = (a: string | number, b: string | number) => {
    const factor = isAsc ? 1 : -1;
    if (!a) {
      return -factor;
    }
    if (!b) {
      return -factor;
    }

    if (a < b) {
      return -factor;
    }
    if (a > b) {
      return factor;
    }
    return 0;
  };

  const compareMoves = (a: IMove, b: IMove) => {
    switch (selectedFilter) {
      case filterTypes.Name:
        try {
          return compare(a.move.name, b.move.name);
        } catch (error) {
          return -1;
        }

      case filterTypes.PowerPoints:
        try {
          return compare(a.info.pp, b.info.pp);
        } catch (error) {
          return -1;
        }

      case filterTypes.Type:
        try {
          return compare(a.info.type.name, b.info.type.name);
        } catch (error) {
          return -1;
        }

      default:
        return 1;
    }
  };

  return pokemonData ? (
    <div className="w-full">
      <Layout title={GetPokemonLanguageName()}>
        <div className="flex flex-row mb-5 mx-5 items-center">
          <div className="flex flex-row items-center w-2/3">
            <div className="mr-3">{RenderFilterTypes()}</div>
            <div>
              {selectedFilter != null ? (
                <button onClick={() => setSelectedFilter(null)}>
                  <RiCloseCircleFill />
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="w-1/3 relative ">
            <button
              className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => setIsAsc(isAsc ? false : true)}
              disabled={selectedFilter == null}
            >
              {isAsc ? "Asc" : "Desc"}
            </button>
          </div>
        </div>
        <div>
          {pokemonData?.pokemonInfo?.moves
            .sort(compareMoves)
            .map((move, index) => {
              const color = getTypeColor(move.info.type.name);
              return (
                <div
                  className="flex flex-row place-content-between bg-slate-900 my-1 mx-4 rounded-lg"
                  key={index}
                  style={{ backgroundColor: `${color}` }}
                >
                  <div className="self-center ml-5">
                    <div className="first-letter:uppercase text-2xl ">
                      {move.move.name}
                    </div>
                    <p className="first-letter:uppercase font-extralight text-black">
                      {move.info.type.name}
                    </p>
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
