"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-r from-slate-800 to-slate-950 justify-center font-sans">
      <Image
        src="/images/locagram.png"
        height={500}
        className="lg:w-3/4 w-11/12 mx-4 mb-5"
        objectFit="cover"
        width={500}
        alt="locagram"
      />

      <Link
        href="acceuil"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-normal rounded-lg text-xl w-3/4 lg:w-3/4 sm:w-3/4 px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Suivant
      </Link>
    </main>
  );
}
