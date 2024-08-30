"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faHome,
  faSignOutAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Location = {
  id: string;
  formVille: string;
  formQuartier: string;
  formTypeLocation: string;
  formLoyer: string;
  FormFraisVisite: string;
  formDisponibilite: string;
  formDescription: string;
  formConditionLocation: string;
  formImages: string[];
};

export default function Page() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "locations"), (snapshot) => {
      const locationsData = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Location, "id">;
        return {
          id: doc.id,
          ...data
        };
      });

      setLocations(locationsData);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleEdit = (id: string) => {
    // Implement edit functionality
    console.log(`Edit location with ID: ${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce poste ?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "locations", id));
        toast.success("Poste supprimé avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la suppression du poste.");
      }
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-900 flex-col items-center font-sans">
      <div className="h-auto sm:w-3/4 md:w-1/2 lg:w-1/2 w-3/4 my-10 flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">Postes</h1>
        <p className="text-white font-normal">
          Bienvenue sur votre profil ! Cette section est dédiée à la gestion de
          vos informations personnelles et à la personnalisation de votre
          expérience sur notre plateforme...
        </p>
      </div>

      <Link
        href="/postes/ajouter"
        className="text-white bg-blue-700 hover:bg-blue-800 mb-5 justify-items-end focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-3/4 lg:w-1/2 sm:w-1/2 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Ajouter
      </Link>

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
                Images
              </th>
              <th className="min-w-[150px] px-6 py-4 font-medium text-black">
                Actions
              </th>{" "}
              {/* New Actions Column */}
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr
                key={location.id}
                className="hover:bg-gray-200 transition-colors duration-200 text-black"
              >
                <td className="border-b border text-black px-6 py-5">
                  {location.formVille}
                </td>
                <td className="border-b border text-black px-6 py-5">
                  {location.formQuartier}
                </td>
                <td className="border-b border text-black px-6 py-5">
                  {location.formTypeLocation}
                </td>
                <td className="border-b border text-black px-6 py-5">
                  {location.formLoyer}
                </td>
                <td className="border-b border text-black px-6 py-5">
                  {location.FormFraisVisite}
                </td>
                <td className="border-b border text-black px-6 py-5">
                  {location.formDisponibilite}
                </td>
                <td className="border-b border text-black px-6 py-5">
                  {location.formDescription}
                </td>
                <td className="border-b border text-black px-6 py-5">
                  {location.formConditionLocation}
                </td>
                <td className="border-b border text-black px-6 py-5">
                  <div className="flex flex-wrap gap-2">
                    {location.formImages &&
                      location.formImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`image${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                  </div>
                </td>
                <td className="border-b border flex flex-col justify-center items-center gap-2   text-black px-6 py-5">
                  <button
                    onClick={() => handleEdit(location.id)}
                    className="text-white hover:underline bg-blue-500 font-semibold p-2 rounded-md"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="bg-red-500 text-white font-semibold hover:underline ml-2 p-2 rounded-md"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
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
      <ToastContainer />
    </main>
  );
}
