import { IPokemonInfo, PokemonListResponse } from "../types/PokemonInterfaces";
import { MoveInfo, TypeInfo } from "./pokemonContext";

export function mapPokemonListResponse(respond: any): PokemonListResponse {
  try {
    return {
      nextUrl: respond.next,
      previousUrl: respond.previous,
      pokemonList: respond.results,
    };
  } catch (error) {
    throw new Error("The mapping of PokemonListResponse went wrong");
  }
}

export function mapPokemonInfo(
  species_respond: any,
  pokemon_respond: any
): IPokemonInfo {
  try {
    return {
      id: species_respond.id,
      name: species_respond.name,
      stats: pokemon_respond.stats,
      types: pokemon_respond.types,
      sprites: pokemon_respond.sprites,
      evolution_chain_url: species_respond.evolution_chain.url,
    };
  } catch (error) {
    throw new Error("The mapping of PokemonInfo went wrong");
  }
}

export function mapTypeInfo(
  type_respond:any
):TypeInfo{
  try {
    return {
      damage_relations: type_respond.damage_relations
    };
  } catch (error) {
    throw new Error("The mapping of TypeInfo went wrong");
  }
}

export function mapMoveInfo(
  move_respond:any
):MoveInfo{
  try {
    
    return{
      accuracy: move_respond.accuracy,
      contest: move_respond.contest_type?move_respond.contest_type.name:null,
      power: move_respond.power,
      pp:move_respond.pp,
      damage_class:move_respond.damage_class,
      type:move_respond.type
    }
  } catch (error) {
    throw error;


  }
}