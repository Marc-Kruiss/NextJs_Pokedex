import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'
import { useState } from 'react'
import Pokemon from '../components/Pokemon'

export default function Home({initialPokemon}) {
  const [pokemon, setPokemon] = useState(initialPokemon)
  return (
    <Layout>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10'>
        {
          pokemon.results.map((monster,index)=>(
            <Pokemon key={index} pokemon={monster} index={index} />
          ))
        }
      </div>
    </Layout>
  )
}

export async function getStaticProps(context){
  const response = await fetch('https://pokeapi.co/api/v2/pokemon')
  const initialPokemon = await response.json()

  return{
    props:{
      initialPokemon
    }
  }
}