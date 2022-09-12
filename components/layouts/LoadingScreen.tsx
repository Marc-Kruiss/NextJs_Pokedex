import React from "react";
import Image from "next/image";

function LoadingScreen() {
  console.log("Loading Screen...");
  return (
    <div
      className="h-screen w-screen flex justify-center items-center fixed top-0 left-0 bg-slate-600 z-10 
    opacity-50"
    >
      <div className="absolute left-1/2 top-1/2 h-24 w-24 m-auto">
        <Image
          src={"/spinning_ball.gif"}
          alt="my gif"
          height={500}
          width={500}
        />
      </div>
    </div>
  );
}

export default LoadingScreen;
