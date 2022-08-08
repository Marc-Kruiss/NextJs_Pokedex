import { IPokemonUrl } from "./IPokemonUrl"

export interface IPokemonBase{
    pokemon:{
        id:number,
        name:string,
        sprites:Record<string,string>,
        types:{name:string}[],
        stats:{base_stat:number}[]
    },
    evolvingChainPokemons:IPokemonUrl[]
}