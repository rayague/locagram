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
        <div className="w-full h-auto p-4 grid md:grid-cols-2 mt-4 sm:grid-cols-1 grid-cols-1 lg:grid-cols-3 gap-4 items-center justify-center ">
          <div className=" bg-white w-full rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl max-w-xl">
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
          <div className=" bg-white w-full rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl max-w-xl">
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
          <div className=" bg-white w-full rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl max-w-xl">
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
          <div className=" bg-white w-full rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl max-w-xl">
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
          <div className=" bg-white w-full rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl max-w-xl">
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
          <div className=" bg-white w-full rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl max-w-xl">
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
          <div className=" bg-white w-full rounded-lg overflow-hidden shadow-lg border border-green-700 mx-auto hover:border-x-green-500 transition-all hover:drop-shadow-2xl max-w-xl">
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
