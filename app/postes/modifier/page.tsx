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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditLocationPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const locationId = searchParams.get("id");

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
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

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

    const fetchLocationData = async () => {
      if (!locationId) return;

      try {
        const docRef = doc(db, "locations", locationId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setVille(data.formVille);
          setQuartier(data.formQuartier);
          setTypeLocation(data.formTypeLocation);
          setLoyer(data.formLoyer);
          setDisponibilite(data.formDisponibilite);
          setDescription(data.formDescription);
          setFraisVisite(data.formFraisVisite);
          setConditionLocation(data.formConditionLocation);
          setExistingImageUrls(data.formImages || []);
        } else {
          toast.error("Location non trouvée.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données: ", error);
        toast.error("Erreur lors de la récupération des données.");
      }
    };

    fetchLocationData();
    return () => unsubscribe();
  }, [route, locationId]);

  const handleImagesUpload = async () => {
    if (!images) return existingImageUrls;

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
    return [...existingImageUrls, ...imageUrls.filter((url) => url !== null)];
  };

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
      !conditionLocation
    ) {
      toast.warning("Veuillez remplir tous les champs.");
      console.log("Veuillez remplir tous les champs.");
      return; // Interrompre la soumission du formulaire
    }

    if (images && images.length + existingImageUrls.length > 6) {
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

      const locationRef = doc(db, "locations", locationId!);
      await updateDoc(locationRef, {
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
        updatedAt: new Date().toISOString()
      });

      toast.success("Location mise à jour avec succès !");
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
      console.error("Erreur lors de la mise à jour de la location: ", error);
      toast.error("Erreur lors de la mise à jour de la location.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-900 flex-col items-center font-sans">
      <div className="h-auto w-3/4 sm:w-3/4 my-10 lg:w-1/2 flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">
          Modifier location
        </h1>
        <p className="text-white font-normal">
          Vous êtes sur le point de modifier une annonce de location existante.
          Cet écran est conçu pour vous permettre de mettre à jour les
          informations de votre offre. Remplissez les détails du logement,
          ajoutez ou remplacez des photos, et ajustez les conditions selon
          l'évolution du marché.
        </p>
      </div>

      <div className="grid grid-col gap-8 mt-5 mb-24">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-stroke bg-white shadow-default ">
            <div className="border-b border-stroke px-7 py-4">
              <h3 className="font-medium text-black">
                Informations de l'agence
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleSubmit}>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="ville"
                    >
                      Ville
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none"
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
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="quartier"
                    >
                      Quartier
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
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
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="typeLocation"
                    >
                      Type de location
                    </label>
                    <div className="relative">
                      <select
                        name="typeLocation"
                        value={typeLocation}
                        onChange={(e) => setTypeLocation(e.target.value)}
                        className="relative z-20 w-full appearance-none rounded border border-stroke bg-gray-300 py-3 px-4 outline-none focus:border-blue-500 active:border-blue-500"
                      >
                        <option value="">Sélectionnez</option>
                        <option value="chambre">Chambre</option>
                        <option value="appartement">Appartement</option>
                        <option value="maison">Maison</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="loyer"
                    >
                      Loyer (CFA)
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="number"
                      name="loyer"
                      value={loyer}
                      onChange={(e) => setLoyer(e.target.value)}
                      id="loyer"
                      placeholder="20000"
                    />
                  </div>
                </div>

                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="disponibilite"
                    >
                      Disponibilité
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="date"
                      name="disponibilite"
                      value={disponibilite}
                      onChange={(e) => setDisponibilite(e.target.value)}
                      id="disponibilite"
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="fraisVisite"
                    >
                      Frais de visite (CFA)
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="number"
                      name="fraisVisite"
                      value={fraisVisite}
                      onChange={(e) => setFraisVisite(e.target.value)}
                      id="fraisVisite"
                      placeholder="3000"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="conditionLocation"
                  >
                    Conditions de location
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                    type="text"
                    name="conditionLocation"
                    value={conditionLocation}
                    onChange={(e) => setConditionLocation(e.target.value)}
                    id="conditionLocation"
                    placeholder="1 mois de caution, 1 mois de loyer"
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
                    className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id="description"
                    placeholder="Description de la location"
                  />
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="images"
                  >
                    Ajouter ou remplacer des images
                  </label>
                  <input
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-300 focus:outline-none"
                    type="file"
                    name="images"
                    onChange={(e) => setImages(e.target.files)}
                    id="images"
                    multiple
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Vous pouvez télécharger jusqu'à 6 images. Les images
                    existantes seront remplacées par les nouvelles si elles sont
                    téléchargées.
                  </p>
                  <div className="flex flex-wrap mt-4">
                    {existingImageUrls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded mr-2 mb-2"
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-blue-500 py-3 px-6 text-center font-medium text-white hover:bg-blue-600 lg:px-8 xl:px-10"
                    disabled={isLoading}
                  >
                    {isLoading ? "Chargement..." : "Enregistrer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
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
