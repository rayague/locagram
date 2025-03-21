"use client";

import Link from "next/link";
import { ToastContainer, ToastContentProps, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  HiOutlineMap,
  HiOutlineSearch,
  HiOutlineMenu,
  HiOutlineHome,
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
  FaBuilding,
  FaBars,
  FaEnvelope,
  FaSearch,
  FaTag,
  FaTimes,
  FaLink,
  FaListAlt,
} from "react-icons/fa"; // Icônes pour chaque type de maison

import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useState, useRef } from "react";
import gsap from "gsap";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Etat pour contrôler l'ouverture de la modale
  const modalRef = useRef(null); // Référence pour la modale
  const modalBackgroundRef = useRef(null); // Référence pour le fond de la modale

  // Fonction pour ouvrir la modale et animer son apparition
  const openModal = () => {
    setIsModalOpen(true);
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, scale: 0.5 }, // Départ de l'animation (invisible et réduit)
      { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" } // Fin de l'animation (visible et taille normale)
    );
  };

  // Fonction pour fermer la modale avec animation
  const closeModal = () => {
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.5,
      duration: 0.3,
      ease: "power3.in",
      onComplete: () => setIsModalOpen(false), // Ferme la modale une fois l'animation terminée
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-5 lg:p-24 md:p-16 sm:p-8 bg-slate-950 relative">
      <div className="fixed top-4 flex flex-row items-center justify-between w-[95%]  rounded-xl p-4 backdrop-blur-lg backdrop-brightness-200">
        <strong className="text-white text-5xl tracking-tighter font-black">
          Loca<span className="text-green-500">gram</span>
        </strong>
        <div className="flex flex-row gap-6">
          <button>
            <FaSearch size={38} color="white" />
          </button>

          <button onClick={openModal} className="p-4 bg-green-500 rounded-full">
            <FaBars size={24} color="white" />
          </button>
        </div>{" "}
      </div>

      <div>
        {isModalOpen && (
          <div
            ref={modalBackgroundRef}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
            onClick={closeModal} // Fermer la modale si on clique à l'extérieur
          >
            <div
              ref={modalRef}
              className="bg-slate-900 text-white flex flex-col items-start justify-center rounded-xl px-6 py-16 max-w-4xl w-11/12"
              onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l'intérieur de la modale
            >
              <h2 className="text-3xl font-bold text-center flex w-full items-center justify-between">
                Menu
                <button
                  onClick={closeModal}
                  className="text-2xl text-white bg-green-500 p-4 rounded-full hover:text-green-700 transition duration-200"
                >
                  <FaTimes /> {/* Icône de fermeture */}
                </button>
              </h2>
              <ul className="mt-4 text-center flex flex-col gap-4 w-full font-bold  ">
                <Link href="/">
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-2">
                    <FaHome size={20} className="text-green-500" /> Acceuil
                  </li>
                </Link>
                <Link href="/categories">
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-2">
                    <FaTag size={20} className="text-green-500" /> Catégories
                  </li>
                </Link>
                <Link href="/postes">
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-2">
                    <FaSearch size={20} className="text-green-500" /> Rechercher
                  </li>
                </Link>
                <Link href="/contacts">
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-2">
                    <FaEnvelope size={20} className="text-green-500" /> Contacts
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* <div className="my-10"></div> */}
      <div className=" flex flex-col justify-center lg:w-11/12 w-full md:w-11/12 lg:p-4 md:p-4 p-0 mt-32">
        <h3 className="text-6xl lg:text-8xl text-green-500 font-black tracking-tighter mb-8">
          Découvrez,
        </h3>
        <p className="text-white text-lg font-normal">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Error sed
          cumque dolorem assumenda ut hic rem magni accusamus placeat libero
          tenetur fuga quae delectus, enim beatae. Optio suscipit fugiat
          consectetur. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Est, blanditiis nesciunt adipisci alias eligendi beatae et, libero
          corrupti cumque, inventore error mollitia amet veniam.
        </p>
        <div className="w-full rounded-xl my-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 gap-4">
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaBed size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Auberge</span>
            <p className="text-white text-sm mt-2">
              Un hébergement collectif, souvent utilisé pour des séjours courts.
              Les auberges sont idéales pour les voyageurs dans des zones
              touristiques.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaHouseUser size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">
              Maison à louer
            </span>
            <p className="text-white text-sm mt-2">
              Un logement indépendant, souvent avec un jardin ou une cour,
              destiné à être loué à long ou court terme.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaPaste size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Manoir</span>
            <p className="text-white text-sm mt-2">
              Une grande maison historique ou luxueuse, souvent avec un grand
              terrain, idéale pour des événements ou des séjours de luxe.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaHammer size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Atelier</span>
            <p className="text-white text-sm mt-2">
              Un espace destiné à la création ou à l'artisanat, souvent loué
              pour des événements ou des sessions de travail.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaSwimmer size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Villa</span>
            <p className="text-white text-sm mt-2">
              Une maison luxueuse avec des équipements haut de gamme comme une
              piscine, un jardin ou une vue imprenable.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaMountain size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Chalet</span>
            <p className="text-white text-sm mt-2">
              Un logement généralement situé dans les montagnes ou à la
              campagne, parfait pour des vacances, souvent en région skiable.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaWarehouse size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Loft</span>
            <p className="text-white text-sm mt-2">
              Un grand espace ouvert, souvent dans un bâtiment réaménagé, avec
              une ambiance industrielle et moderne.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaBoxOpen size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Studio</span>
            <p className="text-white text-sm mt-2">
              Un petit appartement d'une seule pièce, souvent idéal pour les
              étudiants ou les personnes seules.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaHome size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Pavillon</span>
            <p className="text-white text-sm mt-2">
              Une petite maison souvent située dans un quartier résidentiel ou
              semi-urbain, idéale pour des séjours de courte ou longue durée.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaMobileAlt size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Mobil-home</span>
            <p className="text-white text-sm mt-2">
              Un logement mobile, souvent utilisé pour des vacances dans des
              campings ou des résidences de loisirs.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaMapMarkedAlt size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">
              Appartement meublé
            </span>
            <p className="text-white text-sm mt-2">
              Un appartement entièrement meublé, prêt à être habité, pour des
              séjours temporaires ou flexibles.
            </p>
          </Link>

          {/* Nouveaux types de logements */}
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaBuilding size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Duplex</span>
            <p className="text-white text-sm mt-2">
              Un appartement à deux niveaux reliés par un escalier interne,
              offrant plus d'espace et d'intimité.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaCity size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Penthouse</span>
            <p className="text-white text-sm mt-2">
              Un appartement de luxe situé au dernier étage d'un immeuble,
              souvent avec une vue panoramique et des équipements haut de gamme.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaBed size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">
              Chambre d'hôtel
            </span>
            <p className="text-white text-sm mt-2">
              Un espace privatif dans un hôtel, généralement avec des services
              de nettoyage et de restauration.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaWarehouse size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">
              Loft industriel
            </span>
            <p className="text-white text-sm mt-2">
              Un espace moderne avec de hauts plafonds et une ambiance
              industrielle, souvent situé dans des anciens bâtiments.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaCaravan size={30} className="text-green-500 mb-2" />
            <span className="font-bold text-white text-center">Caravane</span>
            <p className="text-white text-sm mt-2">
              Un véhicule conçu pour être un logement mobile, idéal pour les
              voyages ou le camping.
            </p>
          </Link>
        </div>
        <div className="my-4"></div>
        <Link
          href=""
          className="my-4 text-white flex flex-row border border-slate-600 items-center justify-between p-8 rounded-lg bg-slate-900 backdrop-blur-md backdrop-brightness-75"
        >
          <span className="tracking-tighter md:text-6xl lg:text-8xl sm:text-6xl text-4xl font-black">
            DÉMARCHEURS
          </span>
          <FaLink
            // size={60}
            className="text-white mb-2 md:text-6xl lg:text-8xl sm:text-6xl text-4xl"
          />
        </Link>
      </div>

      <div className="my-16"></div>

      <footer className="bg-slate-900 absolute bottom-0 shadow-sm w-full border-t border-slate-600">
        <div className="w-full mx-auto max-w-screen-xl p-6 md:flex md:items-center md:justify-between">
          <span className="text-sm text-white sm:text-center font-bold">
            © 2025{" "}
            <a
              href="https://portfolio-cnkp.vercel.app/"
              className="hover:underline"
              target="_blank"
            >
              Ray Ague
            </a>
            . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-bold text-white sm:mt-0">
            <li>
              <Link href="/" className="hover:underline me-4 md:me-6">
                <FaHome className="inline mr-2" /> Acceuil
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:underline me-4 md:me-6">
                <FaListAlt className="inline mr-2" /> Catégories
              </Link>
            </li>
            <li>
              <Link href="postes" className="hover:underline me-4 md:me-6">
                <FaSearch className="inline mr-2" /> Rechercher
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:underline">
                <FaEnvelope className="inline mr-2" /> Contacts
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
