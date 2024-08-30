"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboard,
  faHome,
  faSignOutAlt,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { signOut, onAuthStateChanged } from "firebase/auth";
import React, { useRef, useState, useEffect } from "react";
import { auth, storage, db } from "../../../firebaseConfig"; // Assurez-vous que ces importations sont correctes
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Page() {
  const route = useRouter();
  const [ville, setVille] = useState("");
  const [quartier, setQuartier] = useState("");
  const [typeLocation, setTypeLocation] = useState("");
  const [loyer, setLoyer] = useState("");
  const [disponibilite, setDisponibilite] = useState("");
  const [description, setDescription] = useState("");
  const [fraisVisite, setFraisVisite] = useState("");
  const [conditionLocation, setConditionLocation] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        route.push("/acceuil");
      }
    });
    return () => unsubscribe();
  }, [route]);

  const handleImagesUpload = async () => {
    if (!images) return [];

    const uploadPromises = Array.from(images).map(async (image) => {
      try {
        const imageRef = ref(storage, `images/${Date.now()}-${image.name}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        return imageUrl;
      } catch (error) {
        console.error("Erreur lors du téléchargement de l'image: ", error);
        toast.error("Erreur lors du téléchargement de l'image.");
        return null;
      }
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls.filter((url) => url !== null);
  };

  //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier si tous les champs sont remplis
    if (
      !ville ||
      !quartier ||
      !typeLocation ||
      !loyer ||
      !disponibilite ||
      !description ||
      !fraisVisite ||
      !conditionLocation ||
      !images
    ) {
      toast.warning("Veuillez remplir tous les champs.");
      console.log("Veuillez remplir tous les champs.");
      return; // Interrompre la soumission du formulaire
    }

    if (images.length > 6) {
      toast.warning("Vous ne pouvez télécharger que jusqu'à 6 images.");
      return; // Interrompre la soumission du formulaire si plus de 6 images
    }

    setIsLoading(true);

    try {
      if (!userId) {
        throw new Error("Utilisateur non authentifié.");
      }

      const imageUrls = await handleImagesUpload();
      if (imageUrls.length === 0) {
        throw new Error("Les URLs des images sont manquantes.");
      }

      const locationRef = collection(db, "locations");
      const response = await addDoc(locationRef, {
        formVille: ville,
        formQuartier: quartier,
        formTypeLocation: typeLocation,
        formLoyer: loyer,
        formDisponibilite: disponibilite,
        formDescription: description,
        formFraisVisite: fraisVisite,
        formConditionLocation: conditionLocation,
        formImages: imageUrls, // Utiliser le tableau d'URLs des images
        userId: userId,
        submittedAt: new Date().toISOString()
      });

      console.log("Document ajouté avec ID: ", response.id);
      toast.success("Location ajoutée avec succès !");
      route.push("/postes");

      // Réinitialiser les champs du formulaire
      setVille("");
      setQuartier("");
      setTypeLocation("");
      setLoyer("");
      setDisponibilite("");
      setDescription("");
      setFraisVisite("");
      setConditionLocation("");
      setImages(null);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la location: ", error);
      toast.error("Erreur lors de l'ajout de la location.");
    } finally {
      setIsLoading(false);
    }
  };

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
              <form onSubmit={handleSubmit}>
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
                        value={ville}
                        onChange={(e) => setVille(e.target.value)}
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
                      value={quartier}
                      onChange={(e) => setQuartier(e.target.value)}
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
                        value={typeLocation}
                        onChange={(e) => setTypeLocation(e.target.value)}
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
                      value={loyer}
                      onChange={(e) => setLoyer(e.target.value)}
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
                    name="fraisVisite"
                    value={fraisVisite}
                    onChange={(e) => setFraisVisite(e.target.value)}
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                    id="typeLocation"
                  >
                    <option value="">--Choisir--</option>
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
                      value={disponibilite}
                      onChange={(e) => setDisponibilite(e.target.value)}
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none "
                      id="disponibilite"
                    >
                      <option value="">--Choisir--</option>
                      <option value="Immédiate">Immédiate</option>
                      <option value="Sous 1 mois">Sous 1 mois</option>
                      <option value="Sous 3 mois">Sous 3 mois</option>
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                      value={conditionLocation}
                      onChange={(e) => setConditionLocation(e.target.value)}
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
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImages(e.target.files)}
                      id="images"
                    />
                  </div>
                </div>

                <div className="flex flex-row justify-end gap-4">
                  <button
                    type="submit"
                    className={`mt-4 w-full flex justify-center bg-blue-500 text-white py-3 rounded-md 
                    ${
                      isLoading
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-blue-600"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "En cours..." : "Ajouter"}
                  </button>
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
