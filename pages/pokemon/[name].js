import React from 'react'
import Layout from '../../components/Layout'

function PokemonDetail({name}) {
  return (
    <Layout>
        <h1>Hello</h1>
    </Layout>
  )
}

export default PokemonDetail

export async function getServerSideProps(context){
    
    return{
        props:{

        }
    }
}