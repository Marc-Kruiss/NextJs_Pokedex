import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { AppProps } from "next/app";
import "../styles/globals.css";
import { GetStaticProps } from "next";
import { PokemonListResponse } from "../components/types/PokemonInterfaces";
import { mapPokemonListResponse } from "../components/helper/mapper";
import { LanguageProvider } from "../context/Language/LanguageContext";
import type { NextPage } from "next";
import { PokemonProvider } from "../context/Pokemon/PokemonInfoContext";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
import LoadingScreen from "../components/layouts/LoadingScreen";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, router: NextRouter) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function Loading() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setLoading(true);

    const handleComplete = (url: string) =>
      url !== router.asPath && setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  return loading ? (
   <LoadingScreen/>
  ) : (
    <></>
  );
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      
      <PokemonProvider>
        <LanguageProvider>
        <Loading />
          {getLayout(<Component {...pageProps} />, useRouter())}
        </LanguageProvider>
      </PokemonProvider>
    </>
  );
}

export default MyApp;
