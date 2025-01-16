"use client";

import { SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlineMap,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineHome
} from "react-icons/hi";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log(`Rechercher : ${searchQuery}`);
      toast.success(`Recherche pour : ${searchQuery}`);
    } else {
      toast.error("Veuillez entrer un terme de recherche.");
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center p-3 lg:p-10 md:p-16 sm:p-6 bg-slate-600">
      {/* Titre de la page */}
      <div className="w-full rounded-t-xl bg-gradient-to-r from-slate-700 to-slate-900 h-auto p-3">
        <h3 className="text-white font-black text-6xl lg:text-9xl md:text-8xl sm:text-7xl tracking-tighter">
          Recherchez
        </h3>
        <p className="text-white font-normal text-lg lg:text-xl mt-4">
          Trouvez rapidement ce que vous cherchez grâce à notre outil de
          recherche avancé. Parcourez une large gamme d'options pour répondre à
          vos besoins.
        </p>
      </div>
      <hr className="bg-green-500 border border-green-500 w-full mt-4 mb-8" />

      {/* Barre de recherche personnalisée */}
      <div className="flex justify-center items-center w-full mt-4">
        <div
          className={`flex items-center w-full max-w-2xl border ${
            isFocused ? "border-green-500" : "border-slate-600"
          } rounded-lg overflow-hidden transition-colors duration-300`}
        >
          <input
            type="text"
            placeholder="Recherchez ici..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-4 py-2 text-white bg-transparent outline-none placeholder-slate-400 border border-green-500 rounded-l-lg"
          />
          <button
            onClick={handleSearch}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 transition-colors duration-300"
          >
            Rechercher
          </button>
        </div>
      </div>

      {/* Conteneur principal des icônes avec fond moderne */}
      <div className="bg-white/30 w-11/12 lg:w-1/6 md:w-1/4 sm:w-1/4 fixed bottom-4 mx-auto rounded-lg flex justify-around p-4 backdrop-blur-md brightness-75">
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
          href="/categories"
          className="flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform duration-300"
        >
          <HiOutlineMenu
            size={24}
            className="text-white hover:text-green-300 transition-all"
          />
        </Link>
        {/* Icône pour la recherche */}
        <Link
          href=""
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
