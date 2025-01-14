"use client";

import { motion } from "framer-motion";
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
  const notify = (
    message:
      | string
      | number
      | bigint
      | boolean
      | React.ReactElement<any, string | JSXElementConstructor<any>>
      | Iterable<React.ReactNode>
      | Promise<React.AwaitedReactNode>
      | ((props: ToastContentProps<unknown>) => React.ReactNode)
      | null
      | undefined
  ) => toast(message);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-5 lg:p-24 md:p-16 sm:p-8 bg-slate-600">
      {/* Conteneur principal des icônes avec fond moderne */}
      <div className="bg-white/30 w-11/12 lg:w-1/6 md:w-1/4 sm:w-1/4  fixed bottom-4 mx-auto rounded-lg flex justify-around p-4 backdrop-blur-md brightness-50">
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
