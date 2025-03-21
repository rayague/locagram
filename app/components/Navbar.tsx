"use client";
import { useState, useEffect, useRef } from "react";
import { FaSearch, FaBars } from "react-icons/fa";
import { gsap } from "gsap";

const Navbar = () => {
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
    <div>
      {/* Navbar */}
      <div className="fixed top-4 flex items-center justify-between w-[95%]e rounded-xl p-4 backdrop-blur-lg backdrop-brightness-200">
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
      </div>

      {/* Modale */}
      {isModalOpen && (
        <div
          ref={modalBackgroundRef}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={closeModal} // Fermer la modale si on clique à l'extérieur
        >
          <div
            ref={modalRef}
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()} // Empêche la fermeture si on clique à l'intérieur de la modale
          >
            <h2 className="text-xl font-bold text-center">Menu</h2>
            <ul className="mt-4 text-center">
              <li className="py-2">Catégories</li>
              <li className="py-2">Rechercher</li>
              <li className="py-2">Contact</li>
            </ul>
            <div className="mt-4 flex justify-center">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
