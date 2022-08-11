import Head from "next/head";
import React, { FC } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";

interface Props {
  children: React.ReactNode;
  title: string;
}

const Layout: FC<Props> = ({ children, title }) => {
  return (
    <div>
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
      </header>

      <main className="container mx-auto">{children}</main>

      <footer className="flex justify-center items-center mt-10">
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
