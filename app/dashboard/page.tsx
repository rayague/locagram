"use client";
import { motion } from "framer-motion";
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
import { auth, provider } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useRouter } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
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
    <main className="flex min-h-screen bg-slate-900 flex-col items-center justify-center font-sans">
      <div className="h-auto w-full px-5 flex sm:w-3/4 md:1/2 lg:w-1/2 flex-col my-8 gap-5">
        <h1 className="font-extrabold text-white text-5xl">Dashboard</h1>
        <p className="text-white font-normal">
          Bienvenue sur votre tableau de bord. Ici, vous pouvez accéder
          rapidement à toutes les informations importantes, gérer vos projets,
          suivre vos performances, et bien plus encore. Utilisez les sections
          ci-dessous pour explorer les différentes fonctionnalités et rester à
          jour avec vos tâches.
        </p>
      </div>

      <div className="w-full h-full sm:w-3/4 md:1/2 lg:w-1/2 transition ease-out delay-100 mb-20 px-5">
        {/* Carte pour Dashboard */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 3,
              opacity: 0
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.2
              }
            }
          }}
        >
          <div className="h-52 w-full bg-slate-800 p-4 my-10 shadow-lg shadow-slate-950">
            <h1 className="text-3xl text-white font-bold">Dashboard</h1>
            <p className="text-white font-normal">
              Sur la page Dashboard, vous pouvez obtenir une vue d'ensemble de
              votre compte, avec des statistiques et des raccourcis vers
              d'autres sections importantes.
            </p>
          </div>
        </motion.div>

        {/* Carte pour Postes */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 3,
              opacity: 0
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 0.6
              }
            }
          }}
        >
          <div className="h-52 w-full bg-slate-800 p-4 my-10 shadow-lg shadow-slate-950">
            <h1 className="text-3xl text-white font-bold">Postes</h1>
            <p className="text-white font-normal">
              La page Postes vous permet de gérer tous vos articles, consulter
              les détails, éditer ou supprimer des postes existants.
            </p>
          </div>
        </motion.div>

        {/* Carte pour Profil */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 3,
              opacity: 0
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 1
              }
            }
          }}
        >
          <div className="h-52 w-full bg-slate-800 p-4 my-10 shadow-lg shadow-slate-950">
            <h1 className="text-3xl text-white font-bold">Profil</h1>
            <p className="text-white font-normal">
              La page Profil vous permet de voir et modifier vos informations
              personnelles, changer votre mot de passe et mettre à jour vos
              préférences.
            </p>
          </div>
        </motion.div>

        {/* Carte pour Déconnexion */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              scale: 3,
              opacity: 0
            },
            visible: {
              scale: 1,
              opacity: 1,
              transition: {
                delay: 1.4
              }
            }
          }}
        >
          <div className="h-52 w-full bg-slate-800 p-4 my-10 shadow-lg shadow-slate-950">
            <h1 className="text-3xl text-white font-bold">Déconnexion</h1>
            <p className="text-white font-normal">
              En cliquant sur déconnexion, vous terminez votre session actuelle
              et revenez à la page d'accueil.
            </p>
          </div>
        </motion.div>
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
          <Link href="" onClick={handleSignOut}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </Link>
        </span>
      </div>
    </main>
  );
}
