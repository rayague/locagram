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
      <div className="h-auto w-3/4 sm:w-3/4 my-10 lg:w-1/2  flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">Ajouter location</h1>
        <p className="text-white font-normal">
          Vous êtes sur le point de créer une nouvelle annonce de location. Cet
          écran est conçu pour vous guider à travers toutes les étapes
          nécessaires pour publier une offre complète et attractive. Remplissez
          les détails du logement, ajoutez des photos de qualité, et définissez
          un prix compétitif pour attirer les locataires. Plus votre annonce est
          claire et détaillée, plus vous avez de chances de recevoir des
          demandes rapidement. Ce processus simple vous permet de mettre en
          avant vos propriétés et de les rendre visibles aux nombreux
          utilisateurs à la recherche de leur prochain chez-soi.
        </p>
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
                      htmlFor="ville"
                    >
                      Ville
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4  text-black focus:border-blue-500 focus-visible:outline-none"
                        type="text"
                        name="ville"
                        id="ville"
                        placeholder="Abomey-Calavi"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="quartier"
                    >
                      Quartier
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="text"
                      name="quartier"
                      id="quartier"
                      placeholder="Bidossessi"
                    />
                  </div>
                </div>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="typeLocation"
                    >
                      Type de location
                    </label>
                    <div className="relative">
                      <select
                        name="typeLocation"
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none"
                        id=""
                      >
                        <option value="Appartement">Appartement</option>
                        <option value="Loft">Loft</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Villa">Villa</option>
                        <option value="Duplex">Duplex</option>
                        <option value="Maison individuelle">
                          Maison individuelle
                        </option>
                        <option value="Bungalow">Bungalow</option>
                        <option value="Maison de ville">Maison de ville</option>
                        <option value="Studio">Studio</option>
                        <option value="Chambre à louer">Chambre à louer</option>
                        <option value="Colocation">Colocation</option>
                        <option value="Résidence étudiante">
                          Résidence étudiante
                        </option>
                        <option value="Gîte">Gîte</option>
                        <option value="Manoir">Manoir</option>
                        <option value="Château">Château</option>
                        <option value="Demeure historique">
                          Demeure historique
                        </option>
                        <option value="Résidence de luxe">
                          Résidence de luxe
                        </option>
                        <option value="Maison contemporaine">
                          Maison contemporaine
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black "
                      htmlFor="loyer"
                    >
                      Frais de loyer
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="number"
                      name="loyer"
                      id="loyer"
                      placeholder="100.000"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="typeLocation"
                  >
                    Frais de Visite
                  </label>
                  <select
                    name="typeLocation"
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                    id=""
                  >
                    <option value="1.000">1.000</option>
                    <option value="1.500">1.500</option>
                    <option value="2.000">2.000</option>
                    <option value="2.500">2.500</option>
                    <option value="3.000">3.000</option>
                    <option value="3.500">3.500</option>
                    <option value="4.000">4.000</option>
                    <option value="4.500">4.500</option>
                    <option value="5.000">5.000</option>
                    <option value="5.500">5.500</option>
                    <option value="6.000">6.000</option>
                    <option value="6.500">6.500</option>
                    <option value="7.000">7.000</option>
                    <option value="7.500">7.500</option>
                    <option value="8.000">8.000</option>
                    <option value="8.500">8.500</option>
                    <option value="9.000">9.000</option>
                    <option value="9.500">9.500</option>
                    <option value="10.000">10.000</option>
                  </select>
                </div>
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="disponibilite"
                  >
                    Disponibilité
                  </label>
                  <div className="relative">
                    <select
                      name="disponibilite"
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      id="disponibilite"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="indisponible">Non disponible</option>
                    </select>
                  </div>
                </div>
                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      name="description"
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      rows={3}
                      id="description"
                      placeholder="Votre description.."
                    ></textarea>
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="conditionLocation"
                  >
                    Condition de location
                  </label>
                  <div className="relative">
                    <textarea
                      name="conditionLocation"
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      rows={3}
                      id="conditionLocation"
                      placeholder="Vos conditions de location.."
                    ></textarea>
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
                      multiple
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <button
                    className="flex justify-center rounded bg-blue-600 text-white px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                  >
                    Enrégistrer
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
