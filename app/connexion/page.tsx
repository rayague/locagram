"use client";
import Link from "next/link";
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth, provider } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mot_de_passe, setMot_de_passe] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validation des champs
    if (!validateEmail(email) || !email || !mot_de_passe) {
      toast.error(
        "Le format de l'email est invalide ou les champs sont vides."
      );
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        mot_de_passe
      );
      const response = userCredential.user;
      const userEmail = userCredential.user.email;

      console.log("Utilisateur connecté :", response, userEmail);
      toast.success("Connexion réussie !");
      router.push("/dashboard");
    } catch (error) {
      // Gérer l'erreur ici et afficher un message avec toastify
      toast.error("Erreur de connexion. Veuillez vérifier vos informations.");
      console.error("Erreur de connexion :", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-900 flex-col items-center justify-center font-sans">
      <h1 className="text-5xl text-white mb-10">Connexion</h1>
      <form
        className="w-3/4 lg:w-1/4 sm:w-2/4 md:w-2/4 mx-auto"
        onSubmit={handleSubmit}
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="mot_de_passe"
            id="mot_de_passe"
            min={8}
            value={mot_de_passe}
            onChange={(e) => setMot_de_passe(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Mot de passe
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl w-full sm:w-full px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {isLoading ? "Chargement..." : "Se connecter"}
        </button>
      </form>
      <h2 className="text-white my-5">
        Je n'ai pas encore de compte{" "}
        <Link href="inscription" className="text-sky-400">
          M'inscrire
        </Link>
      </h2>
      <ToastContainer />
    </main>
  );
}

// https://theswissbay.ch/pdf/Books/Linguistics/Mega%20linguistics%20pack/Austronesian/Tagalog%2C%20Basic%20%28Aspillera%29.pdf
