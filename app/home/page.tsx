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
import Image from "next/image";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center p-3 lg:p-10 md:p-16 sm:p-6 bg-slate-600">
      <div className="w-full">
        <h3 className="text-white font-black text-6xl lg:text-9xl md:text-8xl sm:text-7xl tracking-tighter">
          Découvrez
        </h3>
        <p className="text-white font-normal">
          les locations les plus récentes qui ont été publiés et faites votre
          choix.
        </p>
      </div>
      <hr className="bg-green-500 border border-green-500 w-full mt-4 mb-8" />
      <div className="w-full h-auto p-4 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-4 items-center justify-center p-auto">
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-800 mx-auto">
          <Image
            className="w-full"
            src="/images/house1.jpg"
            height={500}
            width={500}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Maison à louer </div>
            <var>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                publié le : 09/01/2025
              </span>
            </var>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
            <Link
              href=""
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-800 mx-auto">
          <Image
            className="w-full"
            src="/images/house2.jpg"
            height={500}
            width={500}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Appartement </div>
            <var>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                publié le : 09/01/2025
              </span>
            </var>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
            <Link
              href=""
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-800 mx-auto">
          <Image
            className="w-full"
            src="/images/house3.jpg"
            height={500}
            width={500}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Auberge </div>
            <var>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                publié le : 09/01/2025
              </span>
            </var>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
            <Link
              href=""
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-800 mx-auto">
          <Image
            className="w-full"
            src="/images/house4.jpg"
            height={500}
            width={500}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Maison à louer </div>
            <var>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                publié le : 09/01/2025
              </span>
            </var>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
            <Link
              href=""
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-800 mx-auto">
          <Image
            className="w-full"
            src="/images/house5.jpg"
            height={500}
            width={500}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Appartement </div>
            <var>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                publié le : 09/01/2025
              </span>
            </var>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
            <Link
              href=""
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md"
            >
              Détails
            </Link>
          </div>
        </div>{" "}
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-800 mx-auto">
          <Image
            className="w-full"
            src="/images/house6.jpg"
            height={500}
            width={500}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Maison à louer </div>
            <var>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                publié le : 09/01/2025
              </span>
            </var>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
            <Link
              href=""
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-800 mx-auto">
          <Image
            className="w-full"
            src="/images/house7.jpg"
            height={500}
            width={500}
            alt="Sunset in the mountains"
          />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Auberge</div>
            <var>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                publié le : 09/01/2025
              </span>
            </var>
            <p className="text-gray-700 text-base">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Voluptatibus quia, nulla! Maiores et perferendis eaque,
              exercitationem praesentium nihil.
            </p>
            <Link
              href=""
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md"
            >
              Détails
            </Link>
          </div>
        </div>
      </div>

      {/* Conteneur principal des icônes avec fond moderne */}
      <div className="bg-white/30 w-11/12 lg:w-1/6 md:w-1/4 sm:w-1/4  fixed bottom-4 mx-auto rounded-lg flex justify-around p-4 backdrop-blur-md brightness-75">
        {/* Icône pour l'accueil */}
        <Link
          href=""
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
