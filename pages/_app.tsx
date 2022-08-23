import React, { useState } from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";
import { GetStaticProps } from "next";
import { PokemonListResponse } from "../components/types/PokemonInterfaces";
import { mapPokemonListResponse } from "../components/helper/mapper";
import { LanguageProvider } from "../context/Language/LanguageContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </>
  );
}

export default MyApp;
