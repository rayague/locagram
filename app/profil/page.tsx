"use client";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faHome,
  faSignOutAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged, User } from "firebase/auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const router = useRouter();
  const [userId, setUserId] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser);
      } else {
        router.push("/acceuil");
        toast.error("Vous n'êtes pas connecté");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Déconnexion réussie");
      router.push("/acceuil");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  if (!userId) {
    return null; // Empêche le rendu de l'écran tant que l'utilisateur n'est pas vérifié
  }

  return (
    <main className="flex min-h-screen bg-slate-900 flex-col items-center font-sans">
      <div className="h-auto w-3/4 sm:w-3/4 my-10 lg:w-1/2 flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">Profil</h1>
        <p className="text-white font-normal">
          Bienvenue sur l'écran des postes ! Ici, vous pouvez explorer et gérer
          toutes les annonces de location disponibles. Que vous cherchiez un
          appartement, une villa de luxe ou une simple chambre à louer, cette
          section vous offre une vue d'ensemble sur toutes les options. Vous
          pouvez consulter les détails, contacter les propriétaires, et même
          enregistrer vos annonces préférées pour les consulter plus tard.
          Naviguez aisément à travers les différentes offres pour trouver le
          logement qui correspond à vos besoins. Si vous êtes un propriétaire,
          cet espace vous permet également de gérer vos annonces et de les
          rendre visibles pour les locataires potentiels.
        </p>
      </div>
      <div className="grid grid-cols w-3/4 mx-5 sm:w-1/2 gap-8 mt-10 mb-5">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default shadow-lg shadow-slate-950">
            <div className="border-b border-stroke px-7 py-4">
              <h3 className="font-medium text-black">
                Informations Personnelles
              </h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <div className="w-full rounded border border-stroke text-gray-600 bg-gray-300 py-3 px-4 focus:border-blue-500 focus-visible:outline-none ">
                      <h3>{userId.displayName}</h3>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <div className="w-full rounded border border-stroke text-gray-600 bg-gray-300 py-3 px-4 focus:border-blue-500 focus-visible:outline-none ">
                      <h3>{userId.email}</h3>
                    </div>
                  </div>
                </div>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <div className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                      <h3>+990 3343 7865</h3>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <div className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none ">
                      <h3>Nom de l'agence</h3>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                    <h3>{userId.email}</h3>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                    <h3>Mot de passe</h3>
                  </div>
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <Link
                    href="/profil/modifier/profil"
                    className="flex justify-center rounded bg-orange-400 focus:ring-orange-600 text-white px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  >
                    Modifier
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-col w-3/4 mx-5 sm:w-1/2 gap-8 mt-5 mb-24">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default shadow-lg shadow-slate-950">
            <div className="border-b border-stroke px-7 py-4">
              <h3 className="font-medium text-black  ">
                Informations de l'agence
              </h3>
            </div>
            <Image
              src="/images/picture2.jpg"
              height={200}
              width={500}
              alt="Image"
              objectFit="contain"
              className="w-44 h-44 flex flex-row rounded-full mx-auto my-6"
            />
            <div className="p-7">
              <form action="#">
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <div className="relative">
                      <div className=" w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                        <h3>Nom de l'agence</h3>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <div className=" w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                      <h3>Nom du Gérant</h3>
                    </div>
                  </div>
                </div>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <div className="relative">
                      <div className=" w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                        <h3>Prénom du Gérant</h3>
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <div className=" w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                      <h3>Zone de couverture</h3>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="relative">
                    <div className=" w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                      <h3>Spécialisation</h3>
                    </div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className=" w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                    <h3>Contact WhatsApp</h3>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="relative">
                    <div className=" w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                      <h3>N0 : IFU</h3>
                    </div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="relative">
                    <div className=" w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-gray-600 focus:border-blue-500 focus-visible:outline-none">
                      <h3>Contrat de bail</h3>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <Link
                    href="/profil/modifier/agence"
                    className="flex justify-center rounded bg-orange-400 focus:ring-orange-600 text-white px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  >
                    Modifier
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
