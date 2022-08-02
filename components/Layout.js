import Head from 'next/head'
import React from 'react'
import styles from '../styles/Home.module.css'
import Image from 'next/image'


function Layout({children}) {
  return (
    <div>
        <Head>
            <title>Next-Js Pokedex</title>
            <meta name='description' content='This pokedex is powered by next.js' />
            <link rel="icon" href="/pokedex.png" />
        </Head>

        <header className='bg-slate-900 py-10 mb-10'>
            <h1 className='text-6xl text-center text-amber-400'>PokeDex</h1>
        </header>
        
        <main className='container mx-auto'>
            {children}
        </main>

        <footer className="flex justify-center items-center mt-10">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Layout