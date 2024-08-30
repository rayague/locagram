"use client";
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
import { auth } from "../../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function page() {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      await signOut(auth);
      toast.success("Déconnexion réussie");
      route.push("/acceuil");
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error("erreur lors de la déconnexion");
    }
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen bg-slate-900 flex-col items-center font-sans">
      <div className="h-auto w-3/4 sm:w-3/4 lg:w-1/2 my-10 flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">Modifier Profil</h1>
        <p className="text-white font-normal">
          Dans cet écran, vous avez l'opportunité de modifier et d'actualiser
          les informations de votre profil. Que vous souhaitiez changer votre
          nom, votre adresse e-mail, ou d'autres détails personnels, cet espace
          est conçu pour vous offrir une interface simple et intuitive.
          Assurez-vous que toutes vos informations sont correctes pour garantir
          une meilleure expérience utilisateur et une communication fluide avec
          les agences et propriétaires. Prenez quelques minutes pour vérifier et
          ajuster vos préférences afin que votre profil reflète au mieux qui
          vous êtes.
        </p>
      </div>

      <div className="grid grid-col gap-8 mt-10 mb-24 bg-white">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default shadow-lg shadow-slate-950">
            <div className="border-b border-stroke px-7 py-4">
              <h3 className="font-medium text-black  ">
                Informations Personnelles
              </h3>
            </div>
            <div className="p-7 bg-white">
              <form action="#">
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="prenom"
                    >
                      Prénom
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none 
                     "
                        type="text"
                        name="prenom"
                        id="prenom"
                        placeholder="Devid Jhon"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="nom"
                    >
                      Nom
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="text"
                      name="nom"
                      id="nom"
                      placeholder="+990 3343 7865"
                    />
                  </div>
                </div>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="telephone"
                    >
                      Téléphone
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none 
                     "
                        type="text"
                        name="telephone"
                        id="telephone"
                        placeholder="Devid Jhon"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="agence"
                    >
                      Agence
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="text"
                      name="agence"
                      id="agence"
                      placeholder="+990 3343 7865"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="email"
                      name="email"
                      id="email"
                      placeholder="devidjond45@gmail.com"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="password"
                  >
                    Mot de passe
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                    type="text"
                    name="password"
                    id="password"
                    placeholder="devidjhon24"
                  />
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <Link
                    href="/profil/modifier/profil"
                    className="flex justify-center rounded bg-orange-400 focus:ring-orange-600 text-white px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  >
                    Enrégistrer
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-4 lg:gap-8 md:gap-6 backdrop-blur-xl backdrop-brightness-200 cursor-pointer justify-evenly py-6 px-4 rounded-3xl fixed bottom-2">
        <span className="text-3xl text-black hover:scale-110">
          <Link href="/dashboard" className="bg-white p-3 rounded-full ">
            <FontAwesomeIcon icon={faHome} />
          </Link>
        </span>
        <span className="text-3xl text-black hover:scale-110">
          <Link href="/postes" className="bg-white p-3 rounded-full">
            <FontAwesomeIcon icon={faClipboard} />
          </Link>
        </span>
        <span className="text-3xl text-black hover:scale-110">
          <Link href="/profil" className="bg-white p-3 rounded-full">
            <FontAwesomeIcon icon={faUser} />
          </Link>
        </span>
        <span className="text-3xl text-black hover:scale-110">
          <Link
            href=""
            onClick={handleSignOut}
            className="bg-white p-3 rounded-full"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </Link>
        </span>
      </div>
    </main>
  );
}
