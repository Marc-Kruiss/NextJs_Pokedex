import Head from "next/head";
import React, { FC, useContext } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { useLanguage } from "../context/Language/LanguageContext";
import { Dropdown } from "flowbite-react";

interface Props {
  children: React.ReactNode;
  title: string;
}

const Layout: FC<Props> = ({ children, title }) => {
  const { selectedLanguage, allLanguages, changeLanguage } = useLanguage();

  const renderLanguageDropdown = () => {
    return (
      <Dropdown
        label={(selectedLanguage?.shortTerm
          ? selectedLanguage.shortTerm
          : "none"
        ).toUpperCase()}
      >
        <Dropdown.Header>Select Language</Dropdown.Header>
        {Object.keys(allLanguages).map((key, index) => (
          <Dropdown.Item onClick={() => changeLanguage(key)} key={index}>
            <Image
              src={allLanguages[key].imageUrl}
              height={50}
              width={50}
              alt={allLanguages[key].language}
            ></Image>
          </Dropdown.Item>
        ))}
      </Dropdown>
    );
  };

  return (
    <div className="">
      <Head>
        <title>{title}</title>
        <meta name="description" content="This pokedex is powered by next.js" />
        <link rel="icon" href="/pokedex.png" />
      </Head>

      <header className="bg-slate-900 pb-10 mb-10 pt-5">
        <a>
          <div className="flex justify-center text-6xl text-center text-amber-400">
            <div className="flex flex-col justify-center">
              <Link href={"/"}>
                <AiFillHome className="place-self-center mr-10" size={50} />
              </Link>
              <div className="relative  mt-1">{renderLanguageDropdown()}</div>
            </div>

            <h1 className="align-bottom">{title}</h1>
          </div>
        </a>
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
