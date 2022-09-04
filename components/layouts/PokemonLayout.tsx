import Styles from "../../styles/BottomNav.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  RiHomeSmile2Line,
  RiHomeSmile2Fill,
  RiSearchEyeFill,
} from "react-icons/ri";
import { BiSearchAlt } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiUser5Line, RiUser5Fill } from "react-icons/ri";

export default function PokemonLayout({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <>
      {children}
      <BottomNav index={index} />
    </>
  );
}

const BottomNav = ({ index }: { index: number }) => {
  const router = useRouter();
  console.log("Current Route")
  console.log(router.asPath)
  const [activeTabs, setActiveTabs] = useState("home");
  useEffect(() => {
    switch (activeTabs) {
      case "home":
        router.push(`./${index}`);
        break;
      case "search":
        router.push(`./${index}/evolutions`);
        break;
      case "saved":
        router.push(`./${index}/types`);
        break;
      case "account":
        router.push(`./${index}/moves`);
        break;
      default:
        router.push(`./${index}`);
        break;
    }
  }, [activeTabs]);

  return (
    <div className={`${Styles.bottomNav}`}>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === "home" ? (
          <RiHomeSmile2Fill
            size="35"
            color="#000"
            onClick={() => setActiveTabs("home")}
          />
        ) : (
          <RiHomeSmile2Line
            size="35"
            color="#000"
            onClick={() => setActiveTabs("home")}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === "search" ? (
          <RiSearchEyeFill
            size="35"
            color="#000"
            onClick={() => setActiveTabs("search")}
          />
        ) : (
          <BiSearchAlt
            size="35"
            color="#000"
            onClick={() => setActiveTabs("search")}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === "saved" ? (
          <AiFillHeart
            size="35"
            color="#000"
            onClick={() => setActiveTabs("saved")}
          />
        ) : (
          <AiOutlineHeart
            size="35"
            color="#000"
            onClick={() => setActiveTabs("saved")}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === "account" ? (
          <RiUser5Fill
            size="35"
            color="#000"
            onClick={() => setActiveTabs("account")}
          />
        ) : (
          <RiUser5Line
            size="35"
            color="#000"
            onClick={() => setActiveTabs("account")}
          />
        )}
      </div>
    </div>
  );
};
