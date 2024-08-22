import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faHome,
  faSignOutAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import { auth, provider } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function page() {
  return (
    <main className="flex min-h-screen bg-slate-900 flex-col items-center font-sans">
      <div className="h-auto sm:w-3/4 md:w-1/2 lg:w-1/2 w-3/4 my-10  flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">Postes</h1>
        <p className="text-white font-normal">
          Bienvenue sur votre profil ! Cette section est dédiée à la gestion de
          vos informations personnelles et à la personnalisation de votre
          expérience sur notre plateforme. Vous pouvez consulter et mettre à
          jour vos détails personnels, suivre vos activités récentes, et gérer
          vos préférences. Assurez-vous que votre profil est à jour pour
          profiter pleinement de nos services. C'est également ici que vous
          pouvez vérifier vos interactions avec les différentes annonces et
          agences, ainsi que garder un œil sur vos
        </p>
      </div>

      <Link
        href="/postes/ajouter"
        className="text-white bg-blue-700 hover:bg-blue-800 mb-5 justify-items-end focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-3/4 lg:w-1/2 sm:w-1/2 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Ajouter
      </Link>
      {/* <div className="w-full bg-slate-100 mx-5 overflow-x-auto mb-20 shadow-lg shadow-slate-950 rounded-lg">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="min-w-[220px] px-6 py-4 font-medium text-black">
                Nom
              </th>
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Prénom
              </th>
              <th className="min-w-[120px] px-6 py-4 font-medium text-black">
                Adresse Email
              </th>
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Adresse
              </th>
              <th className="min-w-[120px] px-6 py-4 font-medium text-black">
                Numéro de Téléphone
              </th>
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Mot de Passe
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-200 transition-colors duration-200">
              <td className="border-b border-[#eee] px-6 py-5">Doe</td>
              <td className="border-b border-[#eee] px-6 py-5">John</td>
              <td className="border-b border-[#eee] px-6 py-5">
                john.doe@example.com
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                123 Rue Principale, Paris
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                +33 1 23 45 67 89
              </td>
              <td className="border-b border-[#eee] px-6 py-5">********</td>
            </tr>
            <tr className="hover:bg-gray-200 transition-colors duration-200">
              <td className="border-b border-[#eee] px-6 py-5">Smith</td>
              <td className="border-b border-[#eee] px-6 py-5">Jane</td>
              <td className="border-b border-[#eee] px-6 py-5">
                jane.smith@example.com
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                456 Avenue de la Liberté, Lyon
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                +33 6 12 34 56 78
              </td>
              <td className="border-b border-[#eee] px-6 py-5">********</td>
            </tr>
            <tr className="hover:bg-gray-200 transition-colors duration-200">
              <td className="border-b border-[#eee] px-6 py-5">Dupont</td>
              <td className="border-b border-[#eee] px-6 py-5">Marie</td>
              <td className="border-b border-[#eee] px-6 py-5">
                marie.dupont@example.com
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                789 Boulevard des Champs, Marseille
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                +33 7 89 01 23 45
              </td>
              <td className="border-b border-[#eee] px-6 py-5">********</td>
            </tr>
          </tbody>
        </table>
      </div> */}

      <div className="w-3/4 bg-slate-100 mx-5 overflow-x-auto mb-20 shadow-lg shadow-slate-950 rounded-lg">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Ville
              </th>
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Quartier
              </th>
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Type de location
              </th>
              <th className="min-w-[100px] px-6 py-4 font-medium text-black">
                Frais de loyer
              </th>
              <th className="min-w-[100px] px-6 py-4 font-medium text-black">
                Frais de visite
              </th>
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Disponibilité
              </th>
              <th className="min-w-[300px] px-6 py-4 font-medium text-black">
                Description
              </th>
              <th className="min-w-[300px] px-6 py-4 font-medium text-black">
                Condition de location
              </th>
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Image
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-200 transition-colors duration-200">
              <td className="border-b border-[#eee] px-6 py-5">
                Abomey-Calavi
              </td>
              <td className="border-b border-[#eee] px-6 py-5">Bidossessi</td>
              <td className="border-b border-[#eee] px-6 py-5">Appartement</td>
              <td className="border-b border-[#eee] px-6 py-5">100.000</td>
              <td className="border-b border-[#eee] px-6 py-5">5.000</td>
              <td className="border-b border-[#eee] px-6 py-5">Disponible</td>
              <td className="border-b border-[#eee] px-6 py-5">
                Appartement moderne, bien situé avec toutes les commodités.
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                Paiement anticipé de 3 mois requis. Caution d'un mois.
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                <img src="/path/to/image1.jpg" alt="image1" />
              </td>
            </tr>
            <tr className="hover:bg-gray-200 transition-colors duration-200">
              <td className="border-b border-[#eee] px-6 py-5">Cotonou</td>
              <td className="border-b border-[#eee] px-6 py-5">Jéricho</td>
              <td className="border-b border-[#eee] px-6 py-5">Villa</td>
              <td className="border-b border-[#eee] px-6 py-5">300.000</td>
              <td className="border-b border-[#eee] px-6 py-5">10.000</td>
              <td className="border-b border-[#eee] px-6 py-5">Indisponible</td>
              <td className="border-b border-[#eee] px-6 py-5">
                Villa spacieuse avec piscine, idéale pour famille.
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                Contrat d'un an minimum. Garantie de 2 mois exigée.
              </td>
              <td className="border-b border-[#eee] px-6 py-5">
                <img src="/path/to/image2.jpg" alt="image2" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-row gap-8 backdrop-blur-sm backdrop-brightness-50 cursor-pointer justify-evenly py-4 px-10 rounded-3xl fixed bottom-2">
        <span className="text-3xl text-white">
          <Link href="/dashboard">
            <FontAwesomeIcon icon={faHome} />
          </Link>
        </span>
        <span className="text-3xl text-white">
          <Link href="/postes">
            <FontAwesomeIcon icon={faClipboard} />
          </Link>
        </span>
        <span className="text-3xl text-white">
          <Link href="/profil">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </span>
        <span className="text-3xl text-white">
          <Link href="">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </Link>
        </span>
      </div>
    </main>
  );
}
