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
    <div className="h-screen w-screen flex justify-center items-center fixed top-0 left-0 bg-slate-600 z-10">
      <div className="absolute left-1/2 top-1/2 h-24 w-24 m-auto animate-pulse">
        <Image src={"/spinning_ball.gif"} alt="my gif" height={500} width={500} />
      </div>
    </div>
  ) : (
    <></>
  );
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Loading />
      <PokemonProvider>
        <LanguageProvider>
          {getLayout(<Component {...pageProps} />, useRouter())}
        </LanguageProvider>
      </PokemonProvider>
    </>
  );
}

export default MyApp;
