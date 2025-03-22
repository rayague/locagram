"use client";

import Link from "next/link";
import { ToastContainer, ToastContentProps, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { JSXElementConstructor, useRef, useState } from "react";
import { HiOutlineMapPin } from "react-icons/hi2";
import Image from "next/image";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaBars,
  FaEnvelope,
  FaHome,
  FaSearch,
  FaTag,
  FaTimes,
  FaListAlt,
  FaLink,
} from "react-icons/fa";
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
      <div className="fixed top-3 flex flex-row items-center justify-between w-[95%]  rounded-xl p-2 backdrop-blur-lg backdrop-brightness-200 z-10">
        <strong className="text-white text-3xl tracking-tighter font-black">
          Loca<span className="text-green-500">gram</span>
        </strong>
        <div className="flex flex-row gap-6">
          <button>
            <FaSearch size={28} color="white" />
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
        <div className="my-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-evenly items-center gap-8">
          {/* Post 6 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Voyage au cœur des montagnes"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                Voyage au cœur des montagnes
              </div>
              <p className="text-white text-base">
                Partez à l'aventure dans les montagnes les plus reculées, où
                l'air pur et les paysages impressionnants vous laissent sans
                voix.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Aventure
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Thomas Lefevre
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #16 mars 2025
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 7 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Au matin dans les bois"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                Au matin dans les bois
              </div>
              <p className="text-white text-base">
                Le matin dans la forêt, un spectacle naturel incroyable où la
                brume s'élève lentement, et chaque feuille semble vivre à son
                propre rythme.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Nature
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Isabelle Dufresne
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #15 mars 2025
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 8 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Architecture d'antan"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Architecture d'antan</div>
              <p className="text-white text-base">
                Un regard sur l'architecture ancienne de notre époque, où chaque
                pierre et chaque détail raconte une histoire fascinante.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Architecture
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Pierre Gauthier
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #14 mars 2025
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 9 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Soleil couchant sur la mer"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                Soleil couchant sur la mer
              </div>
              <p className="text-white text-base">
                Le spectacle magique d'un coucher de soleil sur la mer, où le
                ciel et l'eau se mélangent dans une explosion de couleurs.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Paysage
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Clara Durand
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #13 mars 2025
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 10 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Mystères des cavernes sous-marines"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                Mystères des cavernes sous-marines
              </div>
              <p className="text-white text-base">
                Exploration sous-marine dans les cavernes profondes, où le
                silence règne et où les formes et couleurs des roches forment un
                monde à part.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Aventure
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Alain Rousseau
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #12 mars 2025
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 11 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Sous l’ombre des oliviers"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                Sous l’ombre des oliviers
              </div>
              <p className="text-white text-base">
                Détente et calme sous les ombres des oliviers centenaires, une
                expérience apaisante au cœur de la nature méditerranéenne.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Nature
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Aurélie Morel
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #11 mars 2025
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Le coucher du soleil glacé"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">
                Le coucher du soleil glacé
              </div>
              <p className="text-white text-base">
                Découvrez la beauté des couchers de soleil glacés qui peignent
                le ciel de couleurs vibrantes, créant des paysages
                époustouflants.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #22 mars 2025
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Jean Dupont
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Photographie
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 2 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Perdu dans la brume"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Perdu dans la brume</div>
              <p className="text-white text-base">
                Une aventure captivante à travers des paysages brumeux, où tout
                semble mystérieux et serein.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #20 mars 2025
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Marie Lambert
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Nature
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 3 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Retraite en montagne"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Retraite en montagne</div>
              <p className="text-white text-base">
                Un trésor caché dans les montagnes, offrant tranquillité et
                l'évasion parfaite du tumulte de la vie.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #19 mars 2025
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Lucas Martin
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Architecture
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 4 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="L'heure dorée"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">L'heure dorée</div>
              <p className="text-white text-base">
                Capturez la beauté éphémère de l'heure dorée, lorsque le monde
                est baigné dans une lumière douce et chaleureuse.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #18 mars 2025
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Sophie Moreau
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Paysage
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>

          {/* Post 5 */}
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Nuit dans la forêt"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">Nuit dans la forêt</div>
              <p className="text-white text-base">
                Plongez dans le mystère de la forêt la nuit, où les sons et les
                ombres prennent vie sous la lumière de la lune.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #17 mars 2025
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Clara Béatrice
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Aventure
              </span>
            </div>
            <Link
              href=""
              className="focus:outline-none text-center flex w-11/12 mx-auto my-6 items-center justify-center font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              Détails
            </Link>
          </div>
        </div>
        <div className="my-10"></div>
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
              <Link href="/postes" className="hover:underline me-4 md:me-6">
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
