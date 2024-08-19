"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function page() {
  return (
    <main className="flex min-h-screen bg-gradient-to-r from-slate-800 to-slate-950 flex-col items-center justify-center font-sans">
      <h3 className="text-white text-center sm:mx-10 text-xl md:mx-44 lg:px-44 my-10 mx-10">
        Bienvenue sur notre plateforme. Connectez-vous pour accéder à votre
        espace personnel, suivre vos projets, et collaborer avec votre équipe.
        Si vous n'avez pas encore de compte, inscrivez-vous pour commencer à
        utiliser nos services.
      </h3>
      <Link
        href="inscription"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/4 sm:w-2/4 lg:w-1/4 my-2 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Inscription
      </Link>

      <Link
        href="connexion"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-2/4 sm:w-2/4 lg:w-1/4 my-2 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Connexion
      </Link>
    </main>
  );
}
