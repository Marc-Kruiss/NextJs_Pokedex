import React, { ReactElement, ReactNode, useState } from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";
import { GetStaticProps } from "next";
import { PokemonListResponse } from "../components/types/PokemonInterfaces";
import { mapPokemonListResponse } from "../components/helper/mapper";
import { LanguageProvider } from "../context/Language/LanguageContext";
import type { NextPage } from "next";
import { PokemonProvider } from "../context/Pokemon/PokemonInfoContext";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <PokemonProvider>
        <LanguageProvider>
          {getLayout(<Component {...pageProps} />)}
        </LanguageProvider>
      </PokemonProvider>
    </>
  );
}

export default MyApp;
