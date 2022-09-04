import React, { ReactElement } from "react";
import PokemonLayout from "../../../components/layouts/PokemonLayout";

function Evolutions() {
  return <div>Evolutions</div>;
}

Evolutions.getLayout = function getLayout(page: ReactElement) {
  return <PokemonLayout menuName="evolutions">{page}</PokemonLayout>;
};
export default Evolutions;
