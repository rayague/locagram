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
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn
} from "react-icons/fa";

export default function Page() {
  return (
    <main className="relative flex min-h-screen flex-col items-center p-3 lg:p-10 md:p-16 sm:p-6 bg-slate-600">
      <div className="w-full rounded-t-xl bg-gradient-to-r from-slate-700 to-slate-900 h-auto p-3">
        <h3 className="text-white font-black text-6xl lg:text-9xl md:text-8xl sm:text-7xl tracking-tighter">
          Découvrez
        </h3>
        <p className="text-white font-normal">
          Explorez les locations les plus récentes, découvrez des offres
          uniques, et trouvez l&apos;endroit parfait qui répond à toutes vos
          attentes et envies de confort.
        </p>
      </div>
      <hr className="bg-green-500 border border-green-500 w-full mt-4 mb-8" />
      <div className="w-full h-auto p-4 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-4 items-center justify-center p-auto">
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl">
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
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md hover:bg-green-600 transition-all active:outline-1 outline-offset-2 outline-green-600 "
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl">
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
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md hover:bg-green-600 transition-all active:outline-1 outline-offset-2 outline-green-600"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl">
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
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md hover:bg-green-600 transition-all active:outline-1 outline-offset-2 outline-green-600"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl">
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
            </p>
            <Link
              href=""
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md hover:bg-green-600 transition-all active:outline-1 outline-offset-2 outline-green-600"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl">
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
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md hover:bg-green-600 transition-all active:outline-1 outline-offset-2 outline-green-600"
            >
              Détails
            </Link>
          </div>
        </div>{" "}
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl">
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
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md hover:bg-green-600 transition-all active:outline-1 outline-offset-2 outline-green-600"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className=" bg-white max-w-sm rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl">
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
              className="bg-green-500 flex w-full text-center items-center justify-center p-2 my-4 text-white font-bold rounded-md hover:bg-green-600 transition-all active:outline-1 outline-offset-2 outline-green-600"
            >
              Détails
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full bg-gradient-to-r from-slate-700 to-slate-900 h-auto py-8 rounded-b-xl mt-8 mb-20">
        <div className="container mx-auto text-center text-white">
          <div className="flex flex-col justify-center items-center space-y-4 lg:space-y-0 lg:space-x-8">
            <div className="text-5xl font-bold mb-4">
              <span className="text-green-500 tracking-tighter font-black">
                Locagram
              </span>
            </div>

            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook">
                <FaFacebookF className="text-2xl hover:text-green-500 transition-colors" />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter className="text-2xl hover:text-green-500 transition-colors" />
              </a>
              <a href="#" aria-label="Instagram">
                <FaInstagram className="text-2xl hover:text-green-500 transition-colors" />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedinIn className="text-2xl hover:text-green-500 transition-colors" />
              </a>
            </div>
          </div>

          <div className="text-sm mt-6">
            © 2025 locagram. Tous droits réservés.
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
