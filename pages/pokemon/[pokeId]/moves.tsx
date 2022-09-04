import React, { ReactElement } from "react";
import PokemonLayout from "../../../components/layouts/PokemonLayout";

function Moves() {
  return <div>Moves</div>;
}

Moves.getLayout = function getLayout(page: ReactElement) {
  return <PokemonLayout menuName="moves">{page}</PokemonLayout>;
};
export default Moves;
