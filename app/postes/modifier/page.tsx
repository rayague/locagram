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
      <div className="h-auto w-3/4 sm:w-3/4 my-10 lg:w-1/2  flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">Ajouter location</h1>
        <p className="text-white font-normal">
          Cet écran vous permet de modifier les détails d'une annonce existante.
          Que vous ayez besoin de changer le prix, de mettre à jour les photos,
          ou de corriger des informations, cet espace vous offre toutes les
          options nécessaires pour ajuster vos annonces. Un poste bien présenté
          est crucial pour attirer l'attention des locataires potentiels, et cet
          écran vous donne la flexibilité d'améliorer vos annonces en fonction
          des besoins du marché. Assurez-vous que toutes les informations sont
          exactes et attrayantes pour maximiser vos chances de succès.
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
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black "
                    htmlFor="quartier"
                  >
                    Quartier
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="email"
                      name="quartier"
                      id="quartier"
                      placeholder=""
                    />
                  </div>
                </div> */}

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
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      type="number"
                      name="disponibilite"
                      id="disponibilite"
                      placeholder="disponibilite"
                    />
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

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faHome,
  faSignOutAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebaseConfig";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ville: "",
    quartier: "",
    typeLocation: "",
    loyer: "",
    fraisVisite: "",
    disponibilite: "",
    description: "",
    conditionLocation: "",
    image: null
  });

  const { id } = router.query; // Assuming you pass the post ID via query parameter

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const docRef = doc(db, "locations", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setFormData({ ...docSnap.data() });
          } else {
            toast.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document: ", error);
        }
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const docRef = doc(db, "locations", id);
      await updateDoc(docRef, formData);
      toast.success("Annonce mise à jour avec succès!");
      router.push("/postes");
    } catch (error) {
      console.error("Error updating document: ", error);
      toast.error("Erreur lors de la mise à jour de l'annonce.");
    }
    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen bg-slate-900 flex-col items-center font-sans">
      <div className="h-auto w-3/4 sm:w-3/4 my-10 lg:w-1/2  flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">
          Modifier location
        </h1>
        <p className="text-white font-normal">
          Cet écran vous permet de modifier les détails d'une annonce
          existante...
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
              <form onSubmit={handleFormSubmit}>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="ville"
                    >
                      Ville
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black"
                      type="text"
                      name="ville"
                      id="ville"
                      value={formData.ville}
                      onChange={handleInputChange}
                      placeholder="Abomey-Calavi"
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="quartier"
                    >
                      Quartier
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black"
                      type="text"
                      name="quartier"
                      id="quartier"
                      value={formData.quartier}
                      onChange={handleInputChange}
                      placeholder="Bidossessi"
                    />
                  </div>
                </div>

                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="typeLocation"
                    >
                      Type de location
                    </label>
                    <select
                      name="typeLocation"
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black"
                      value={formData.typeLocation}
                      onChange={handleInputChange}
                    >
                      <option value="Appartement">Appartement</option>
                      {/* ...other options */}
                    </select>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="loyer"
                    >
                      Frais de loyer
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black"
                      type="number"
                      name="loyer"
                      id="loyer"
                      value={formData.loyer}
                      onChange={handleInputChange}
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="fraisVisite"
                  >
                    Frais de Visite
                  </label>
                  <select
                    name="fraisVisite"
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black"
                    value={formData.fraisVisite}
                    onChange={handleInputChange}
                  >
                    <option value="1.000">1.000</option>
                    {/* ...other options */}
                  </select>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="disponibilite"
                  >
                    Disponibilité
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black"
                    type="number"
                    name="disponibilite"
                    id="disponibilite"
                    value={formData.disponibilite}
                    onChange={handleInputChange}
                    placeholder="disponibilite"
                  />
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black"
                    rows={3}
                    id="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Votre description.."
                  ></textarea>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="conditionLocation"
                  >
                    Condition de location
                  </label>
                  <textarea
                    name="conditionLocation"
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black"
                    rows={3}
                    id="conditionLocation"
                    value={formData.conditionLocation}
                    onChange={handleInputChange}
                    placeholder="Vos conditions de location.."
                  ></textarea>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="image"
                  >
                    Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleFileChange}
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary py-3 px-4 text-white rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Mise à jour en cours..." : "Mettre à jour"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
