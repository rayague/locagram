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
  FaBed,
  FaBoxOpen,
  FaCaravan,
  FaSwimmer,
  FaMapMarkedAlt,
  FaHouseUser,
  FaHammer,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import { gsap } from "gsap";
import { span } from "framer-motion/client";

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
                <Link href="/postes">
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
              <p className="text-3xl font-bold mt-2">15+</p>
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
            src="/images/house8.jpg"
            height={500}
            width={500}
            className="shadow-lg shadow-green-800 rounded-lg"
            alt=""
          />
          <Image
            src="/images/938308c8-9120-46ca-b954-9543b8b84eb5.avif"
            height={500}
            width={500}
            className="shadow-lg shadow-green-800 rounded-lg"
            alt=""
          />
          <Image
            src="/images/81dca5d6-5a86-49bc-8eca-4a8610a07d27.webp"
            height={500}
            width={500}
            className="shadow-lg shadow-green-800 rounded-lg"
            alt=""
          />
        </div>
        <div className="bg-slatne-700 mx-auto mt-10 flex flex-col gap-6">
          <p className="text-xl  font-normal text-white">
            <span className="text-green-500 font-bold italic">Locagram</span>{" "}
            est la plateforme idéale pour trouver{" "}
            <span className="text-green-500 font-bold italic">
              la location de vos rêves
            </span>{" "}
            dans n'importe quelle ville du Bénin. Que vous soyez à la recherche
            d'une{" "}
            <span className="text-green-500 font-bold italic">
              maison spacieuse
            </span>
            , d'un <span className="text-green-500">appartement moderne</span>,
            ou d'une{" "}
            <span className="text-green-500 font-bold italic">
              villa avec piscine
            </span>
            , nous avons ce qu'il vous faut. Notre service vous permet de
            trouver des logements de qualité, tout en{" "}
            <span className="text-green-500 font-bold italic">
              filtrant selon vos préférences
            </span>{" "}
            (prix, type de bien, nombre de chambres, etc.). Grâce à{" "}
            <span className="text-green-500 font-bold italic">Locagram</span>,
            vous avez la possibilité de discuter directement avec les
            démarcheurs via{" "}
            <span className="text-green-500 font-bold italic">WhatsApp</span>,
            vous garantissant ainsi une communication rapide et sans tracas. Que
            vous soyez un utilisateur final cherchant la location parfaite ou un
            démarcheur souhaitant{" "}
            <span className="text-green-500 font-bold italic">
              ajouter vos annonces
            </span>
            , notre plateforme simplifie chaque étape du processus. Trouvez un
            logement facilement, faites des recherches rapides et bénéficiez des
            meilleures offres à travers notre interface intuitive et rapide.{" "}
            <span className="text-green-500 font-bold italic">Locagram</span>{" "}
            est la solution pour tous vos besoins en matière de location, avec
            des options qui s'adaptent à chaque style de vie et budget.
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
            <FaBed size={30} className="text-green-500 mb-2" />
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
            <FaHouseUser size={30} className="text-green-500 mb-2" />
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
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 /10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaMapMarkedAlt size={30} className="text-green-500 mb-2" />
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
            <FaBed size={30} className="text-green-500 mb-2" />
            <span className="font-black text-xl text-white text-start">
              Chambre d'hôtel
            </span>
            <p className="text-white text-md mt-2 font-normal">
              Chambre privative avec services de nettoyage et restauration.
            </p>
          </Link>

          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaCaravan size={30} className="text-green-500 mb-2" />
            <span className="font-black text-xl text-white text-start">
              Caravane
            </span>
            <p className="text-white text-sm mt-2">
              Un véhicule conçu pour être un logement mobile, idéal pour les
              voyages ou le camping.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaSwimmer size={30} className="text-green-500 mb-2" />
            <span className="font-black text-xl text-white text-start">
              Villa
            </span>
            <p className="text-white text-sm mt-2">
              Une maison luxueuse avec des équipements haut de gamme comme une
              piscine, un jardin ou une vue imprenable.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaBoxOpen size={30} className="text-green-500 mb-2" />
            <span className="font-black text-xl text-white text-start">
              Studio
            </span>
            <p className="text-white text-sm mt-2">
              Un petit appartement d'une seule pièce, souvent idéal pour les
              étudiants ou les personnes seules.
            </p>
          </Link>
          <Link
            href=""
            className="rounded-md border border-green-500 p-4 flex flex-col justify-center items-start shadow-lg hover:bg-green-500/10 bg-green-300/15 hover:-translate-y-1 transition-all"
          >
            <FaHammer size={30} className="text-green-500 mb-2" />
            <span className="font-black text-xl text-white text-start">
              Atelier
            </span>
            <p className="text-white text-sm mt-2">
              Un espace destiné à la création ou à l'artisanat, souvent loué
              pour des événements ou des sessions de travail.
            </p>
          </Link>
        </div>
        <div className="bg-slatne-700 mx-auto mt-10 flex flex-col gap-6">
          <p className="text-white text-xl font-normal">
            Chez <span className="text-green-500">Locagram</span>, nous
            comprenons que chaque utilisateur a des besoins différents en
            matière de location. C'est pourquoi nous avons conçu une plateforme
            qui vous offre une grande flexibilité dans vos recherches. Nos
            catégories de logements sont soigneusement regroupées pour vous
            permettre de trouver rapidement ce que vous cherchez, que ce soit
            pour un séjour temporaire ou à long terme.
          </p>

          <p className="text-white text-lg font-normal mt-4">
            Voici un aperçu des principales catégories disponibles sur{" "}
            <span className="text-green-500">Locagram</span> :
          </p>

          <ul className="list-disc list-inside text-white text-lg font-normal mt-4">
            <li>
              <span className="text-green-500">Auberges</span> : Des
              hébergements collectifs idéals pour les voyageurs à la recherche
              d’un séjour court.
            </li>
            <li>
              <span className="text-green-500">Maisons à louer</span> : Des
              logements indépendants, souvent avec jardin, pour un séjour
              confortable à court ou long terme.
            </li>
            <li>
              <span className="text-green-500">Appartements meublés</span> : Des
              appartements prêts à être habités, parfaits pour un séjour
              temporaire.
            </li>
            <li>
              <span className="text-green-500">Chambres d'hôtel</span> : Des
              chambres privatives avec services de nettoyage et restauration
              pour un séjour tout confort.
            </li>
            <li>
              <span className="text-green-500">Caravanes</span> : Des logements
              mobiles parfaits pour les aventuriers et les amateurs de camping.
            </li>
            <li>
              <span className="text-green-500">Villas</span> : Des maisons
              luxueuses avec des équipements haut de gamme comme une piscine ou
              un jardin.
            </li>
            <li>
              <span className="text-green-500">Studios</span> : Des appartements
              compacts, idéals pour les étudiants ou les séjours courts.
            </li>
            <li>
              <span className="text-green-500">Ateliers</span> : Des espaces
              dédiés à la création, à l'artisanat ou aux événements
              professionnels.
            </li>
          </ul>

          <p className="text-white text-xl font-normal mt-4">
            Si vous ne trouvez pas la catégorie qui vous convient, ne vous
            inquiétez pas ! Cliquez sur le bouton ci-dessous pour découvrir
            encore plus d'options et affiner votre recherche selon vos
            préférences.
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

        <div className="bg-slatne-700 mx-auto mt-10 flex flex-col gap-6">
          <p className="text-white text-xl font-normal">
            Chez <span className="text-green-500">Locagram</span>, nous avons
            sélectionné pour vous une gamme de logements adaptés à toutes vos
            attentes. Que vous soyez à la recherche d'une maison spacieuse, d'un
            appartement moderne ou d'un bien plus luxueux, notre plateforme vous
            offre plusieurs options pour trouver facilement le logement idéal.
          </p>

          <p className="text-white text-lg font-normal mt-6">
            Voici quelques-unes des locations disponibles actuellement :
          </p>

          <ul className="list-disc list-inside text-white text-lg font-normal mt-4 space-y-2">
            <li>
              <span className="text-green-500">
                Maison spacieuse à la campagne
              </span>{" "}
              – Idéale pour des séjours familiaux, avec un grand jardin et tout
              le confort nécessaire.
            </li>
            <li>
              <span className="text-green-500">
                Appartement moderne en centre-ville
              </span>{" "}
              – Parfait pour les séjours courts, proche de tous les commerces et
              des transports en commun.
            </li>
            <li>
              <span className="text-green-500">
                Villa luxueuse avec piscine
              </span>{" "}
              – Pour ceux qui recherchent un cadre somptueux avec des
              équipements haut de gamme.
            </li>
            <li>
              <span className="text-green-500">Chambre cosy à louer</span> –
              Solution économique et pratique pour un séjour temporaire.
            </li>
          </ul>

          <p className="text-white text-xl font-normal mt-6">
            Ce sont juste quelques exemples de ce que nous proposons. Si vous
            souhaitez découvrir toutes les options disponibles, n'hésitez pas à
            cliquer sur le bouton ci-dessous pour voir l'ensemble des locations
            proposées par <span className="text-green-500">Locagram</span>.
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
          href="https://rayague.github.io/locagram-demarcheurs/"
          target="_blank"
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
