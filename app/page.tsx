"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-r from-slate-800 to-slate-950 justify-center font-sans">
      <h3 className="text-7xl font-extrabold text-center text-white my-8  shadow-gray-300">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 3,
              opacity: 0
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.8
              }
            }
          }}
        >
          <span className="text-white  duration-1000 cursor-default text-edge-outline animate-title font-display md:text-9xl font-black tracking-tighter">
            Bienvenue
          </span>
        </motion.div>
      </h3>
      <motion.span
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {
            scale: 3,
            opacity: 0
          },
          visible: {
            scale: 1,
            opacity: 1,
            transition: {
              delay: 1.2
            }
          }
        }}
      >
        <Link
          href="acceuil"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-1/4 lg:w-auto sm:w-1/4 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Suivant
        </Link>
      </motion.span>
    </main>
  );
}
