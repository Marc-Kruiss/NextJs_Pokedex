import Styles from "../../styles/BottomNav.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  RiHomeSmile2Line,
  RiHomeSmile2Fill,
  RiSearchEyeFill,
  RiInformationFill,
  RiInformationLine,
  RiArrowUpCircleFill,
  RiArrowUpCircleLine,
  RiSwordFill,
  RiSwordLine,
} from "react-icons/ri";
import { BiCategory, BiCategoryAlt, BiSearchAlt } from "react-icons/bi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiUser5Line, RiUser5Fill } from "react-icons/ri";

export default function PokemonLayout({
  children,
  menuName,
}: {
  children: React.ReactNode;
  menuName: string;
}) {
  return (
    <>
      {children}
      <BottomNav tabName={menuName} />
    </>
  );
}

const BottomNav = ({ tabName }: { tabName: string }) => {
  const router = useRouter();
  const [activeTabs, setActiveTabs] = useState(tabName);
  useEffect(() => {
    const pokeId = router.query.pokeId;
    switch (activeTabs) {
      case "index":
        router.push(`/pokemon/${pokeId}`);
        break;
      case "evolutions":
        router.push(`/pokemon/${pokeId}/evolutions`);
        break;
      case "types":
        router.push(`/pokemon/${pokeId}/types`);
        break;
      case "moves":
        router.push(`/pokemon/${pokeId}/moves`);
        break;
      default:
        router.push(`/pokemon/${pokeId}`);
        break;
    }
  }, [activeTabs]);

  return (
    <div className={`${Styles.bottomNav}`}>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === "index" ? (
          <RiInformationFill
            size="35"
            color="#000"
            onClick={() => setActiveTabs("index")}
          />
        ) : (
          <RiInformationLine
            size="35"
            color="#000"
            onClick={() => setActiveTabs("index")}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === "evolutions" ? (
          <RiArrowUpCircleFill
            size="35"
            color="#000"
            onClick={() => setActiveTabs("evolutions")}
          />
        ) : (
          <RiArrowUpCircleLine
            size="35"
            color="#000"
            onClick={() => setActiveTabs("evolutions")}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === "types" ? (
          <BiCategory
            size="35"
            color="#000"
            onClick={() => setActiveTabs("types")}
          />
        ) : (
          <BiCategoryAlt
            size="35"
            color="#000"
            onClick={() => setActiveTabs("types")}
          />
        )}
      </div>
      <div className={`${Styles.bnTab}`}>
        {activeTabs === "moves" ? (
          <RiSwordFill
            size="35"
            color="#000"
            onClick={() => setActiveTabs("moves")}
          />
        ) : (
          <RiSwordLine
            size="35"
            color="#000"
            onClick={() => setActiveTabs("moves")}
          />
        )}
      </div>
    </div>
  );
};
