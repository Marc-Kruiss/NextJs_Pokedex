import React from "react";
import Image from "next/image";

function NotFound() {
  return (
    <div className='grid place-items-center h-screen items-center"'>
      <Image src={"/blackedPokemon.png"} height={500} width={500} />
      <h1 className="absolute text-center translate-y-52 text-9xl font-mono">
        Page Not Found
      </h1>
      <button className="bg-gray-800 hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300 rounded-3xl p-3">
        <a href={"/"} className="text-4xl">
          Home
        </a>
      </button>
    </div>
  );
}

export default NotFound;
