import { Link } from "wouter";
import { FaLink } from "react-icons/fa";
import logo from "@/assets/logo-locagram.png";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img src={logo} alt="Locagram Logo" className="h-8 w-8" />
              <h3 className="text-2xl font-bold text-white dark:text-white">
                Locagram
              </h3>
            </Link>
            <p className="text-gray-400 dark:text-gray-400">
              Votre partenaire immobilier de confiance au Bénin.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white dark:text-white">
              Liens rapides
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/louer"
                  className="text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white"
                >
                  Louer
                </Link>
              </li>
              <li>
                <Link
                  href="/vendre"
                  className="text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white"
                >
                  Vendre
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 dark:text-gray-400 hover:text-white dark:hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white dark:text-white">
              Contact
            </h3>
            <ul className="space-y-2 text-gray-400 dark:text-gray-400">
              <li>Email: contact@locagram.bj</li>
              <li>Tél: +229 90 00 00 00</li>
              <li>Adresse: Cotonou, Bénin</li>
            </ul>
          </div>
        </div>

        {/* Demarcheurs section */}
        <div className="mt-12">
          <Link
            href="https://demarcheur-dashboard-hub.vercel.app/login"
            className="my-4 text-white flex flex-row border border-slate-600 items-center justify-between p-8 rounded-lg bg-slate-900 dark:bg-slate-900 backdrop-blur-md backdrop-brightness-75"
          >
            <span className="tracking-tighter md:text-6xl lg:text-8xl sm:text-6xl text-4xl font-black text-white dark:text-white">
              DÉMARCHEURS
            </span>
            <FaLink className="text-white dark:text-white mb-2 md:text-6xl lg:text-8xl sm:text-6xl text-4xl" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-800 text-center text-gray-400 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Locagram. Développé par{" "}
            <a
              href="mailto:rayague03@gmail.com"
              className="text-green-500 hover:text-green-400"
            >
              Ray Ague
            </a>
            . Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
