"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React, { Component } from "react";
import Image from "next/image";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaTag,
  FaEnvelope,
  FaUserTie,
  FaUserFriends,
  FaHandshake,
  FaLink,
  FaListAlt,
  FaHome,
  FaPhone,
  FaWhatsapp,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

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
      <div className="fixed top-3 flex flex-row items-center justify-between w-[95%]  rounded-xl p-2 backdrop-blur-lg backdrop-brightness-200 z-10">
        <Link href="/">
          <strong className="text-white text-3xl tracking-tighter font-black">
            Loca<span className="text-green-500">gram</span>
          </strong>
        </Link>
        <div className="flex flex-row gap-6">
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
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-4">
                    <FaHome size={20} className="text-green-500" /> Acceuil
                  </li>
                </Link>
                <Link href="/categories">
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-4">
                    <FaTag size={20} className="text-green-500" /> Catégories
                  </li>
                </Link>
                <Link href="/postes">
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-4">
                    <FaListAlt size={20} className="text-green-500" /> Postes
                  </li>
                </Link>
                <Link href="/search">
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-4">
                    <FaSearch size={20} className="text-green-500" /> Rechercher
                  </li>
                </Link>
                <Link href="/contacts">
                  <li className="bg-slate-700 flex-row w-full  p-5 rounded-lg  hover:bg-green-500 transition duration-200 flex items-center justify-center gap-4">
                    <FaEnvelope size={20} className="text-green-500" /> Contacts
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center lg:w-11/12 w-full md:w-11/12 lg:p-4 md:p-4 p-0 mt-32">
        <h3 className="text-6xl lg:text-8xl text-green-500 font-black tracking-tighter mb-8">
          Rechercher,
        </h3>

        <p className="text-white text-lg font-normal">
          Chez <span className="text-green-500 font-bold">Locagram</span>, nous
          vous offrons une{" "}
          <span className="text-green-500 font-bold">
            expérience de recherche simplifiée
          </span>
          grâce à nos différentes catégories de locations. Que vous soyez à la
          recherche d'une
          <span className="text-green-500 font-bold">
            maison spacieuse
          </span>{" "}
          pour votre famille, d'un{" "}
          <span className="text-green-500 font-bold">appartement moderne</span>{" "}
          pour votre prochain séjour, ou d'une{" "}
          <span className="text-green-500 font-bold">chambre cosy</span>
          pour un séjour temporaire, notre plateforme vous permet de trouver
          rapidement ce que vous cherchez.
          <br /> <br />
          Nous proposons plusieurs options pour affiner vos recherches :
          <p className="list-disc list-inside text-white">
            <li>
              <span className="text-green-500">Maisons</span> pour un confort
              optimal et plus d’espace
            </li>
            <li>
              <span className="text-green-500">Appartements</span> modernes et
              pratiques
            </li>
            <li>
              <span className="text-green-500">Villas</span> luxueuses avec des
              équipements premium
            </li>
            <li>
              <span className="text-green-500">Chambres</span> pour une solution
              économique
            </li>
          </p>
          <br />
          Grâce à notre filtre de recherche,{" "}
          <span className="text-green-500 font-bold">Locagram</span> vous permet
          de trouver exactement ce que vous recherchez, que ce soit par
          <span className="text-green-500">prix</span>,
          <span className="text-green-500">emplacement</span>, ou
          <span className="text-green-500">type de bien</span>.
        </p>
        {/* Le séparateur */}
        <div className="my-10"></div>

        <form className="w-full mx-auto mt-10 rounded-md border border-slate-600 p-4 gap-4 justify-center items-center shadow-lg hover:bg-green-500/10 bg-slate-500/15 hover:-translate-y-1 transition-all">
          <h2 className="text-3xl font-semibold text-start text-white mb-6">
            Recherchez votre location idéale
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Catégorie */}
            <div className="flex items-center">
              <i className="text-green-500 text-xl fas fa-home"></i>
              <div className="w-full flex flex-col">
                <label
                  htmlFor="categorie"
                  className="text-lg font-medium text-white"
                >
                  Catégorie
                </label>
                <select
                  id="categorie"
                  name="categorie"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                >
                  <option value="auberge">Auberge</option>
                  <option value="maison">Maison à louer</option>
                  <option value="manoir">Manoir</option>
                  <option value="atelier">Atelier</option>
                  <option value="villa">Villa</option>
                  <option value="chalet">Chalet</option>
                  <option value="loft">Loft</option>
                  <option value="studio">Studio</option>
                  <option value="pavillon">Pavillon</option>
                  <option value="mobilhome">Mobil-home</option>
                  <option value="appartement-meuble">Appartement meublé</option>
                  <option value="duplex">Duplex</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="chambre-hotel">Chambre d'hôtel</option>
                  <option value="loft-industriel">Loft industriel</option>
                  <option value="caravane">Caravane</option>
                  <option value="hotel-ville">Hôtel de ville</option>
                  <option value="parcelle-vendre">Parcelle à vendre</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center">
              <i className="text-green-500 text-xl fas fa-money-bill-wave"></i>
              <div className="flex w-full flex-col">
                <label
                  htmlFor="budget"
                  className="text-lg font-medium text-white"
                >
                  Budget (en FCFA)
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  placeholder="Exemple : 5000"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Localisation */}
            <div className="flex items-center">
              <i className="text-green-500 text-xl fas fa-map-marker-alt"></i>
              <div className="flex w-full flex-col">
                <label
                  htmlFor="localisation"
                  className="text-lg font-medium text-white"
                >
                  Localisation
                </label>
                <input
                  type="text"
                  id="localisation"
                  name="localisation"
                  placeholder="Entrez une ville ou un quartier"
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Bouton de recherche */}
          <div className="w-full text-center mt-6 bg-selate-100">
            <button
              type="submit"
              className="bg-green-500 text-white p-4 font-bold rounded-lg w-full max-w-2xl hover:bg-green-600 transition-all duration-300"
            >
              Rechercher
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 md:grid-cols-2 gap-4 w-full mx-auto"></div>

        <div className="my-10"></div>
        <Link
          href="https://rayague.github.io/locagram-demarcheurs/"
          target="_blank"
          className="my-4 text-white flex flex-row border border-slate-600 items-center justify-between p-8 rounded-lg bg-slate-900 backdrop-blur-md backdrop-brightness-75"
        >
          <span className="tracking-tighter md:text-6xl lg:text-8xl sm:text-6xl text-4xl font-black">
            DÉMARCHEURS
          </span>
          <FaLink className="text-white mb-2 md:text-6xl lg:text-8xl sm:text-6xl text-4xl" />
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
