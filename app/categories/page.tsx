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
import {
  FaBed,
  FaHouseUser,
  FaPaste,
  FaHammer,
  FaSwimmer,
  FaMountain,
  FaWarehouse,
  FaBoxOpen,
  FaHome,
  FaMobileAlt,
  FaMapMarkedAlt,
  FaCaravan,
  FaCity,
  FaBuilding
} from "react-icons/fa"; // Icônes pour chaque type de maison

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
          Parcourez
        </h3>
        <p className="text-white font-normal text-lg lg:text-xl mt-4">
          Explorez les différentes catégories de locations disponibles.
          Découvrez des options variées et choisissez celle qui correspond le
          mieux à vos besoins.
        </p>
      </div>

      <hr className="bg-green-500 border border-green-500 w-full mt-4 mb-8" />
      <div className="w-full bg-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-4">
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaBed size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Auberge</span>
          <p className="text-white text-center text-sm mt-2">
            Un hébergement collectif, souvent utilisé pour des séjours courts.
            Les auberges sont idéales pour les voyageurs dans des zones
            touristiques.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaHouseUser size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">
            Maison à louer
          </span>
          <p className="text-white text-center text-sm mt-2">
            Un logement indépendant, souvent avec un jardin ou une cour, destiné
            à être loué à long ou court terme.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaPaste size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Manoir</span>
          <p className="text-white text-center text-sm mt-2">
            Une grande maison historique ou luxueuse, souvent avec un grand
            terrain, idéale pour des événements ou des séjours de luxe.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaHammer size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Atelier</span>
          <p className="text-white text-center text-sm mt-2">
            Un espace destiné à la création ou à l'artisanat, souvent loué pour
            des événements ou des sessions de travail.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaSwimmer size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Villa</span>
          <p className="text-white text-center text-sm mt-2">
            Une maison luxueuse avec des équipements haut de gamme comme une
            piscine, un jardin ou une vue imprenable.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaMountain size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Chalet</span>
          <p className="text-white text-center text-sm mt-2">
            Un logement généralement situé dans les montagnes ou à la campagne,
            parfait pour des vacances, souvent en région skiable.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaWarehouse size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Loft</span>
          <p className="text-white text-center text-sm mt-2">
            Un grand espace ouvert, souvent dans un bâtiment réaménagé, avec une
            ambiance industrielle et moderne.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaBoxOpen size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Studio</span>
          <p className="text-white text-center text-sm mt-2">
            Un petit appartement d'une seule pièce, souvent idéal pour les
            étudiants ou les personnes seules.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaHome size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Pavillon</span>
          <p className="text-white text-center text-sm mt-2">
            Une petite maison souvent située dans un quartier résidentiel ou
            semi-urbain, idéale pour des séjours de courte ou longue durée.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaMobileAlt size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Mobil-home</span>
          <p className="text-white text-center text-sm mt-2">
            Un logement mobile, souvent utilisé pour des vacances dans des
            campings ou des résidences de loisirs.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaMapMarkedAlt size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">
            Appartement meublé
          </span>
          <p className="text-white text-center text-sm mt-2">
            Un appartement entièrement meublé, prêt à être habité, pour des
            séjours temporaires ou flexibles.
          </p>
        </Link>

        {/* Nouveaux types de logements */}
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaBuilding size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Duplex</span>
          <p className="text-white text-center text-sm mt-2">
            Un appartement à deux niveaux reliés par un escalier interne,
            offrant plus d'espace et d'intimité.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaCity size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Penthouse</span>
          <p className="text-white text-center text-sm mt-2">
            Un appartement de luxe situé au dernier étage d'un immeuble, souvent
            avec une vue panoramique et des équipements haut de gamme.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaBed size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">
            Chambre d'hôtel
          </span>
          <p className="text-white text-center text-sm mt-2">
            Un espace privatif dans un hôtel, généralement avec des services de
            nettoyage et de restauration.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaWarehouse size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">
            Loft industriel
          </span>
          <p className="text-white text-center text-sm mt-2">
            Un espace moderne avec de hauts plafonds et une ambiance
            industrielle, souvent situé dans des anciens bâtiments.
          </p>
        </Link>
        <Link
          href=""
          className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-center shadow-lg hover:bg-green-500 bg-white/40 hover:-translate-y-1 transition-all"
        >
          <FaCaravan size={30} className="text-green-500 mb-2" />
          <span className="font-bold text-white text-center">Caravane</span>
          <p className="text-white text-center text-sm mt-2">
            Un véhicule conçu pour être un logement mobile, idéal pour les
            voyages ou le camping.
          </p>
        </Link>
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
            className="text-green-500 hover:text-green-300 transition-all"
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
