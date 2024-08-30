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
import React, { useEffect, useState } from "react";
import { auth } from "../../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Page() {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nomAgence: "",
    nom: "",
    prenom: "",
    zone: "",
    specialisation: "",
    contact: "",
    ifu: "",
    contrat: null,
    image: null
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      toast.success("Déconnexion réussie");
      route.push("/acceuil");
    } catch (error) {
      console.error("Error signing out: ", error);
      toast.error("Erreur lors de la déconnexion");
    }
    setIsLoading(false);
  };

  const handleChange = (e: {
    target: { name: any; value: any; files: any };
  }) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value
    }));
  };

  // Validation de l'IFU
  const isValidIFU = (ifu: string) => {
    const ifuRegex = /^[0-9]{1,3}[A-Z]{1,2}[0-9]{6}$/; // Ajustez le regex selon les règles réelles
    return ifuRegex.test(ifu);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);

    // Vérification du numéro IFU
    if (!isValidIFU(formData.ifu)) {
      toast.error("Numéro IFU invalide. Veuillez entrer un numéro conforme.");
      setIsLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "agences"), {
        ...formData,
        userId: userId // Lier l'ID de l'utilisateur
      });
      toast.success("Agence enregistrée avec succès !");
      downloadFile(formData.image); // Télécharger le logo
      downloadFile(formData.contrat); // Télécharger le contrat
      setFormData({
        nomAgence: "",
        nom: "",
        prenom: "",
        zone: "",
        specialisation: "",
        contact: "",
        ifu: "",
        contrat: null,
        image: null
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Erreur lors de l'enregistrement de l'agence");
    }
    setIsLoading(false);
  };

  const downloadFile = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Libérer l'URL
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-900 flex-col items-center font-sans">
      <div className="h-auto w-3/4 sm:w-3/4 my-10 lg:w-1/2 flex flex-col gap-5">
        <h1 className="font-extrabold text-white text-5xl">Modifier Agence</h1>
        <p className="text-white font-normal">
          Bienvenue dans la section de gestion du profil de votre agence ! Ici,
          vous pouvez ajuster toutes les informations liées à votre agence,
          telles que le nom, l'adresse, les coordonnées de contact, et plus
          encore.
        </p>
      </div>

      <div className="grid grid-col gap-8 mt-5 mb-32">
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
                      htmlFor="nomAgence"
                    >
                      Nom de l'agence
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="text"
                      name="nomAgence"
                      id="nomAgence"
                      placeholder="Devid Jhon"
                      value={formData.nomAgence}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="nom"
                    >
                      Nom du Gérant
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="text"
                      name="nom"
                      id="nom"
                      placeholder="Doe"
                      value={formData.nom}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="prenom"
                    >
                      Prénom du Gérant
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="text"
                      name="prenom"
                      id="prenom"
                      placeholder="Jhon"
                      value={formData.prenom}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="zone"
                    >
                      Zone de couverture
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="text"
                      name="zone"
                      id="zone"
                      placeholder="Abomey-Calavi"
                      value={formData.zone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="specialisation"
                  >
                    Spécialisation
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none"
                    type="text"
                    name="specialisation"
                    id="specialisation"
                    placeholder="ex: transport"
                    value={formData.specialisation}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="contact"
                  >
                    Contact WhatsApp
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray-300 px-4 py-3 text-black focus:border-blue-500 focus-visible:outline-none"
                    type="text"
                    name="contact"
                    id="contact"
                    placeholder="+000 00 00 0000"
                    value={formData.contact}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-5">
                  <label
                    className="mb-3 block text-sm font-medium text-black"
                    htmlFor="ifu"
                  >
                    N0 : IFU
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none"
                    type="text"
                    name="ifu"
                    id="ifu"
                    placeholder="000000000"
                    value={formData.ifu}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-5 flex flex-col gap-5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="contrat"
                    >
                      Contrat
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="file"
                      name="contrat"
                      id="contrat"
                      accept="application/pdf"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black"
                      htmlFor="image"
                    >
                      Logo de l'agence
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray-300 py-3 px-4 text-black focus:border-blue-500 focus-visible:outline-none"
                      type="file"
                      name="image"
                      id="image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-between">
                  <button
                    type="submit"
                    className="rounded-md bg-green-600 py-2 px-4 font-bold text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Chargement..." : "Enregistrer"}
                  </button>
                  <Link href="/acceuil" className="flex items-center gap-1">
                    <FontAwesomeIcon icon={faHome} className="text-black" />
                    <span className="text-black">Retour</span>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </main>
  );
}
