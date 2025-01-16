"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function page() {
  // Variants pour les animations
  const titleVariant = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, delay: 0.2 } }
  };

  const textVariant = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.4 } }
  };

  const buttonVariant = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.6 } }
  };

  const notify = () => toast("Cette Page n'est pas encore disponible!");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5 lg:p-24 md:p-16 sm:p-8 bg-slate-600">
      {/* Animation du titre */}
      <motion.h1
        className="font-black tracking-tighter text-6xl lg:text-9xl md:text-8xl sm:text-7xl"
        variants={titleVariant}
        initial="hidden"
        animate="visible"
      >
        <span className="text-green-200">L</span>
        <span className="text-green-300">o</span>
        <span className="text-green-400">c</span>
        <span className="text-green-500">a</span>
        <span className="text-green-600">g</span>
        <span className="text-green-700">r</span>
        <span className="text-green-800">a</span>
        <span className="text-green-900">m</span>
        <span className="text-green-900">.</span>
      </motion.h1>

      {/* Animation du texte descriptif */}
      <motion.div
        className="flex flex-col mt-4 w-11/12 lg:w-2/3 md:w-2/3 items-center justify-center"
        variants={textVariant}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="text-center font-normal text-white"
          variants={textVariant}
        >
          Bienvenue sur Locagram, votre plateforme pour trouver des locations
          rapidement et simplement. Comparez, explorez, et réservez
          l’hébergement qui vous convient en un clic.
        </motion.p>

        {/* Animation du bouton */}
        <motion.div
          variants={buttonVariant}
          className="w-full flex items-center justify-center"
        >
          <Link
            href="/categories"
            // onClick={notify}
            className="w-full lg:w-1/2 md:w-1/3 sm:w-2/3 mx-auto rounded-md bg-sky-500 mt-8 py-3 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-sky-600 focus:shadow-none active:bg-sky-600 hover:bg-sky-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Parcourir
          </Link>
        </motion.div>
      </motion.div>
      <ToastContainer />
    </main>
  );
}
