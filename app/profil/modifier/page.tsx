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
import { auth, provider } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
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
      <div className="h-auto w-3/4 sm:w-3/4 my-10 lg:w-1/2 flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">Profil</h1>
        <p className="text-white font-normal">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
          nesciunt mollitia nobis dignissimos, a itaque obcaecati dolorem
          voluptate asperiores. Ea?
        </p>
      </div>

      <div className="grid grid-col gap-8 mt-10 mb-5">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="border-b border-stroke px-7 py-4">
              <h3 className="font-medium text-black  ">
                Informations Personnelles
              </h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="fullName"
                    >
                      Prénom
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none 
                     "
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Devid Jhon"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="phoneNumber"
                    >
                      Nom
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="+990 3343 7865"
                    />
                  </div>
                </div>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="fullName"
                    >
                      Téléphone
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none 
                     "
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="Devid Jhon"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="phoneNumber"
                    >
                      Agence
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="+990 3343 7865"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="emailAddress"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      placeholder="devidjond45@gmail.com"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="Username"
                  >
                    Mot de passe
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                    type="text"
                    name="Username"
                    id="Username"
                    placeholder="devidjhon24"
                  />
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <button
                    className="flex justify-center rounded bg-orange-400 focus:ring-orange-600 text-white px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                  >
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-col gap-8 mt-5 mb-24">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default ">
            <div className="border-b border-stroke px-7 py-4">
              <h3 className="font-medium text-black  ">
                Informations de l'agence
              </h3>
            </div>
            <div className="p-7">
              <form action="#">
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="nomAgence"
                    >
                      Nom de l'agence
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none 
                     "
                        type="text"
                        name="nomAgence"
                        id="nomAgence"
                        placeholder="Devid Jhon"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="nom"
                    >
                      Nom du Gérant
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="text"
                      name="nom"
                      id="nom"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="prenom"
                    >
                      Prénom du Gérant
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none 
                     "
                        type="text"
                        name="prenom"
                        id="prenom"
                        placeholder="Jhon"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="zone"
                    >
                      Zone de couverture
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="text"
                      name="zone"
                      id="zone"
                      placeholder="Abomey-Calavi"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="emailAddress"
                  >
                    Spécialisation
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      placeholder="devidjond45@gmail.com"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="contact"
                  >
                    Contact WhatsApp
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                    type="number"
                    name="contact"
                    id="contact"
                    placeholder="+000 00 00 0000"
                  />
                </div>
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="ifu"
                  >
                    N0 : IFU
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="number"
                      name="ifu"
                      id="ifu"
                      placeholder="IFU"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="contrat"
                  >
                    Contrat de bail
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="file"
                      name="contrat"
                      id="contrat"
                      placeholder="Contrat de bail"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="image"
                  >
                    Image
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="file"
                      name="image"
                      id="image"
                      placeholder="image"
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <button
                    className="flex justify-center rounded bg-blue-600 text-white px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
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
