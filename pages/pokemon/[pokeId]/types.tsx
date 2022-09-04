import React, { ReactElement } from "react";
import PokemonLayout from "../../../components/layouts/PokemonLayout";

function Types() {
  return <div>Types</div>;
}

Types.getLayout = function getLayout(page: ReactElement) {
  return <PokemonLayout menuName="types">{page}</PokemonLayout>;
};
export default Types;
