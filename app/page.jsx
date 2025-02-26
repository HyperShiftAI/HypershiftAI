"use client"
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import CryptoSwap from "./components/panel.jsx";
import Top from "./components/top.jsx";

export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 14.0; // Set the playback speed to double
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto overflow-hidden">
      <section className="relative sm:pt-32 sm:pb-16 lg:pb-10 z-10">
    
        <div className="relative">
     
        <Top/>

        </div>

        </section>
        <div className="px-4 mx-auto sm:px-6 lg:px-4 text-center">
          <h1 className="racing-sans-one-regular lg:text-[160px] text-6xl">
            HYPERSHIFT AI
          </h1>
        </div>
       
            <CryptoSwap />


   

    </div>


  );
}
