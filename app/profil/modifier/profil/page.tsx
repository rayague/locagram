import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faHome,
  faSignOutAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";

export default function page() {
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

      <div className="grid grid-col gap-8 mt-10 mb-24">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default shadow-lg shadow-slate-950">
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
