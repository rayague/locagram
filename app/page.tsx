"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  FaSearch,
  FaBars,
  FaEnvelope,
  FaListAlt,
  FaHandshake,
  FaTag,
  FaUserFriends,
  FaUsers,
  FaUserTie,
  FaTimes,
  FaLink,
  FaHome,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";

export default function Section() {
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
        {/* Navbar */}
        {/* <div className="fixed top-4 flex flex-row items-center justify-between w-[95%]  rounded-xl p-4 backdrop-blur-lg backdrop-brightness-200">
          <strong className="text-white text-5xl tracking-tighter font-black">
            Loca<span className="text-green-500">gram</span>
          </strong>
          <div className="flex gap-6">
            <button>
              <FaSearch size={24} color="white" />
            </button>

            <button onClick={openModal}>
              <FaBars size={24} color="green" />
            </button>
          </div>
        </div> */}

        {/* Modale */}
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
                <Link href="">
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
        <div className="border-y-4 border-green-500 p-4 overflow-hidden">
          <motion.div
            className="text-white font-black text-7xl whitespace-nowrap uppercase tracking-tighter ease-linear"
            animate={{
              x: ["100%", "-100%"], // Déplace de droite à gauche
            }}
            transition={{
              repeat: Infinity, // Répète l'animation à l'infini
              duration: 25, // Durée de l'animation
              ease: "linear", // Animation fluide
            }}
          >
            Retrouvez avec aisance et rapidité les logements qui répondent
            précisément à vos attentes.
          </motion.div>
        </div>

        <div className="my-10"></div>

        {/* Le séparateur */}
        <div className="bg-slate-900 backdrop-blur-md backdrop-brightness-50 w-full px-4 py-10 rounded-lg shadow-lg shadow-green-950">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-6 justify-center items-center">
            <div className="flex flex-col items-center text-center text-white">
              <FaUserTie size={40} className="text-green-500 mb-3" />
              <h3 className="text-2xl lg:text-3xl md:text-3xl sm:text-3xl font-bold">
                Postes
              </h3>
              <p className="text-3xl font-bold mt-2">1000+</p>
            </div>
            <div className="flex flex-col items-center text-center text-white">
              <FaTag size={40} className="text-green-500 mb-3" />
              <h3 className="text-2xl lg:text-3xl md:text-3xl sm:text-3xl font-bold">
                Catégories
              </h3>
              <p className="text-3xl font-bold mt-2">20+</p>
            </div>
            <div className="flex flex-col items-center text-center text-white">
              <FaUserFriends size={40} className="text-green-500 mb-3" />
              <h3 className="text-2xl lg:text-3xl md:text-3xl sm:text-3xl font-bold">
                Visiteurs
              </h3>
              <p className="text-3xl font-bold mt-2">50,000+</p>
            </div>
          </div>
        </div>

        <div className="my-10"></div>
        <h3 className="text-6xl lg:text-8xl text-green-500 font-black tracking-tighter mb-8">
          Découvrez,
        </h3>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2 gap-8 items-center justify-around">
          <Image
            src="/images/house1.jpg"
            height={500}
            width={500}
            className="shadow-lg shadow-green-800 rounded-lg"
            alt=""
          />
          <Image
            src="/images/house2.jpg"
            height={500}
            width={500}
            className="shadow-lg shadow-green-800 rounded-lg"
            alt=""
          />
          <Image
            src="/images/house3.jpg"
            height={500}
            width={500}
            className="shadow-lg shadow-green-800 rounded-lg"
            alt=""
          />
        </div>
        <div className="bg-slatne-700 mx-auto mt-10 flex flex-col gap-6">
          <p className="text-white text-lg font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error sed
            cumque dolorem assumenda ut hic rem magni accusamus placeat libero
            tenetur fuga quae delectus, enim beatae. Optio suscipit fugiat
            consectetur. Lorem ipsum dolor sit amet, consectetur adipisicing
            elit. Est, blanditiis nesciunt adipisci alias eligendi beatae et,
            libero corrupti cumque, inventore error mollitia amet veniam. Non
            maiores similique at excepturi perspiciatis. Lorem ipsum dolor sit
            amet consectetur adipisicing elit. Aliquid dolor quidem placeat sed?
            Odit quo, ipsa hic repudiandae, non consequuntur, vel unde minima
            accusantium est obcaecati optio facere magnam exercitationem?
          </p>
        </div>
        {/* Le séparateur */}
        <div className="my-10"></div>
        <h3 className="text-6xl lg:text-8xl text-green-500 font-black tracking-tighter mb-8">
          Parcourez,
        </h3>
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-2 gap-4 w-full mx-auto">
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            {/* <FaBed size={30} className="text-green-500 mb-2" /> */}
            <span className="font-black text-xl text-white text-start">
              Auberge
            </span>
            <p className="text-white text-md mt-2 font-normal">
              Hébergement collectif pour séjours courts, idéal pour les
              voyageurs.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            {/* <FaHouseUser size={30} className="text-green-500 mb-2" /> */}
            <span className="font-black text-xl text-white text-start">
              Maison à louer
            </span>
            <p className="text-white text-md mt-2 font-normal">
              Logement indépendant à louer à court ou long terme, souvent avec
              jardin.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            {/* <FaSwimmer size={30} className="text-green-500 mb-2" /> */}
            <span className="font-black text-xl text-white text-start">
              Villa
            </span>
            <p className="text-white text-md mt-2 font-normal">
              Maison luxueuse avec piscine, jardin ou vue imprenable.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 /10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            {/* <FaMapMarkedAlt size={30} className="text-green-500 mb-2" /> */}
            <span className="font-black text-xl text-white text-start">
              Appartement meublé
            </span>
            <p className="text-white text-md mt-2 font-normal">
              Appartement meublé, prêt à être habité pour séjours temporaires.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            {/* <FaBed size={30} className="text-green-500 mb-2" /> */}
            <span className="font-black text-xl text-white text-start">
              Chambre d'hôtel
            </span>
            <p className="text-white text-md mt-2 font-normal">
              Chambre privative avec services de nettoyage et restauration.
            </p>
          </Link>
        </div>
        <div className="bg-slatne-700 mx-auto mt-10 flex flex-col gap-6">
          <p className="text-white text-lg font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error sed
            cumque dolorem assumenda ut hic rem magni accusamus placeat libero
            tenetur fuga quae delectus, enim beatae. Optio suscipit fugiat
            consectetur. Lorem ipsum, dolor sit amet consectetur adipisicing
            elit. Ratione libero facere perspiciatis ex, neque ea sunt
            cupiditate explicabo dignissimos culpa ut quos velit asperiores
            doloremque mollitia, voluptatum, deserunt suscipit harum.
          </p>
          <Link
            href="/categories"
            className="focus:outline-none text-center max-w-sm font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Voir plus
          </Link>
        </div>

        <div className="my-10"></div>
        <h3 className="text-6xl lg:text-8xl text-green-500 font-black tracking-tighter mb-8">
          Choisissez,
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-evenly items-center gap-8">
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Sunset in the mountains"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-white text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Date publication
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Auteur
              </span>
            </div>
          </div>
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Sunset in the mountains"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-white text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Date publication
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Auteur
              </span>
            </div>
          </div>
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Sunset in the mountains"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-white text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Date publication
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Auteur
              </span>
            </div>
          </div>
          <div className="max-w-xl rounded overflow-hidden shadow-lg shadow-green-800 mx-auto">
            <Image
              className="w-full"
              src="/images/house4.jpg"
              alt="Sunset in the mountains"
              height={500}
              width={500}
            />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">The Coldest Sunset</div>
              <p className="text-white text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptatibus quia, nulla! Maiores et perferendis eaque,
                exercitationem praesentium nihil.
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Date publication
              </span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                #Auteur
              </span>
            </div>
          </div>
        </div>
        <div className="bg-slatne-700 mx-auto mt-10 flex flex-col gap-6">
          <p className="text-white text-lg font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error sed
            cumque dolorem assumenda ut hic rem magni accusamus placeat libero
            tenetur fuga quae delectus, enim beatae. Optio suscipit fugiat
            consectetur. Lorem ipsum, dolor sit amet consectetur adipisicing
            elit. Ratione libero facere perspiciatis ex, neque ea sunt
            cupiditate explicabo dignissimos culpa ut quos velit asperiores
            doloremque mollitia, voluptatum, deserunt suscipit harum.
          </p>
          <Link
            href="/postes"
            className="focus:outline-none text-center max-w-sm font-bold text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg text-lg px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Voir plus
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
