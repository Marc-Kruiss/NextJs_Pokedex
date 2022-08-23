import Head from "next/head";
import React, { FC, useContext } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { useLanguage } from "../context/Language/LanguageContext";

interface Props {
  children: React.ReactNode;
  title: string;
}

const Layout: FC<Props> = ({ children, title }) => {
  const { selectedLanguage, allLanguages } = useLanguage();

  const renderLanguageDropdown = () => {
    return (
      <>
        <div className="flex flex-row justify-center items-center relative mx-5 mt-5">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-center">
            Select language
          </label>

          <select
            id="countries"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            {Object.keys(allLanguages).map((key, index) => (
              <option key={index}>
                {key}: {allLanguages[key].name}
              </option>
            ))}
          </select>
        </div>
      </>
    );
  };

  return (
    <div className="">
      <Head>
        <title>{title}</title>
        <meta name="description" content="This pokedex is powered by next.js" />
        <link rel="icon" href="/pokedex.png" />
      </Head>

      <header className="bg-slate-900 py-10 mb-10">
        <a>
          <div className="flex justify-center text-6xl text-center text-amber-400">
            <Link href={"/"}>
              <AiFillHome className="place-self-center mr-10" size={50} />
            </Link>
            <h1 className="align-bottom">{title}</h1>
          </div>
        </a>
        <div>{renderLanguageDropdown()}</div>
      </header>

      <main className="container mx-auto">{children}</main>

      <footer className="flex justify-center items-center mt-10 ">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Layout;
