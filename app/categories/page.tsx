"use client";

import Link from "next/link";
import { ToastContainer, ToastContentProps, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlineMap,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineHome
} from "react-icons/hi";
import { JSXElementConstructor } from "react";
import { HiOutlineMapPin } from "react-icons/hi2";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center p-3 lg:p-10 md:p-16 sm:p-6 bg-slate-600">
      <div className="w-full">
        <h3 className="text-white font-black text-6xl lg:text-9xl md:text-8xl sm:text-7xl tracking-tighter">
          Sélectionnez
        </h3>
        <p className="text-white font-normal">
          pour parcourire les types de location disponoble dans chaque catégorie
          qui ont été publiés et faites votre choix.
        </p>
      </div>
      <hr className="bg-white w-full mt-4 mb-8" />
      {/* Conteneur principal des icônes avec fond moderne */}
      <div className="bg-white/30 w-11/12 lg:w-1/6 md:w-1/4 sm:w-1/4  fixed bottom-4 mx-auto rounded-lg flex justify-around p-4 backdrop-blur-md brightness-75">
        {/* Icône pour l'accueil */}
        <Link
          href="/home"
          className="flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform duration-300"
        >
          <HiOutlineHome
            size={24}
            className="text-white hover:text-green-300 transition-all"
          />
        </Link>
        {/* Icône pour les catégories */}
        <Link
          href=""
          className="flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform duration-300"
        >
          <HiOutlineMenu
            size={24}
            className="text-white hover:text-green-300 transition-all"
          />
        </Link>
        {/* Icône pour la recherche */}
        <Link
          href="/search"
          className="flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform duration-300"
        >
          <HiOutlineSearch
            size={24}
            className="text-white hover:text-green-300 transition-all"
          />
        </Link>
      </div>

      {/* Toast container */}
      <ToastContainer />
    </main>
  );
}
