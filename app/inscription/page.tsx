import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5 lg:p-24 md:p-16 sm:p-8 bg-green-300">
      <div className="flex flex-col md:flex-row w-full rounded-2xl bg-white shadow-xl">
        <div className="relative w-full h-[500px] md:h-auto md:w-1/2 hidden lg:block">
          <Image
            src="/images/town.jpg"
            layout="fill"
            objectFit="cover"
            alt="Image"
            className="rounded-tl-2xl md:rounded-bl-2xl"
          />
        </div>
        <div className="my-auto mb-auto flex flex-col w-full lg:w-1/2 p-10">
          <p className="text-5xl font-bold text-zinc-950 dark:text-white">
            Inscription
          </p>
          <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400">
            Entrer vos identifiants pour vous inscrire!
          </p>
          <div className="relative my-4">
            <div className="relative flex items-center py-1">
              <div className="grow border-t border border-zinc-700"></div>
              <div className="grow border-t border border-zinc-700"></div>
            </div>
          </div>
          <div>
            <form className="mb-4">
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <label className="text-zinc-950" htmlFor="nomAgence">
                    Nom de l&apos;agence
                  </label>
                  <input
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-slate-600 bg-white px-4 py-3 text-sm font-medium text-zinc-950 focus:outline-0"
                    id="nomAgence"
                    placeholder="Agence Locagram"
                    type="text"
                    autoCapitalize="none"
                    autoComplete=" nomAgence"
                    autoCorrect="off"
                    name="nomAgence"
                  />
                  <label className="text-zinc-950 mt-2" htmlFor="nomGerant">
                    Nom du Gérant
                  </label>
                  <input
                    id="nomGerant"
                    placeholder="Agent Gerant"
                    type="text"
                    autoComplete="nomGerant"
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-slate-600 bg-white px-4 py-3 text-sm font-medium text-zinc-950 focus:outline-0"
                    name="nomGerant"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-zinc-950 " htmlFor="numeroIFU">
                    Numéro IFU
                  </label>
                  <input
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-950 placeholder:text-zinc-400 focus:outline-0 dark:border-zinc-800 dark:bg-transparent dark:text-white dark:placeholder:text-zinc-400"
                    id="numeroIFU"
                    placeholder="123456789AB12"
                    type="text"
                    autoCapitalize="none"
                    autoComplete="numeroIFU"
                    autoCorrect="off"
                    name="numeroIFU"
                  />
                  <label className="text-zinc-950 mt-2" htmlFor="password">
                    Numéro de Téléphone
                  </label>
                  <input
                    id="telephone"
                    placeholder="00098909876"
                    type="text"
                    autoComplete="telephone"
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-slate-600 bg-white px-4 py-3 text-sm font-medium text-zinc-950 focus:outline-0"
                    name="telephone"
                  />
                </div>
                <div className="grid gap-1">
                  <label className="text-zinc-950 " htmlFor="email">
                    Email
                  </label>
                  <input
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-slate-600 bg-white px-4 py-3 text-sm font-medium text-zinc-950 focus:outline-0"
                    id="email"
                    placeholder="gerant@locagram.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    name="email"
                  />
                  <label className="text-zinc-950 mt-2" htmlFor="password">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    placeholder="Mot de passe"
                    type="password"
                    autoComplete="current-password"
                    className="mr-2.5 mb-2 h-full min-h-[44px] w-full rounded-lg border border-slate-600 bg-white px-4 py-3 text-sm font-medium text-zinc-950 focus:outline-0"
                    name="password"
                  />
                </div>
                {/* Form inputs go here */}
                <button
                  className="whitespace-nowrap ring-offset-background bg-green-500 text-white text-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white-foreground hover:bg-green-700 mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium"
                  type="submit"
                >
                  S&apos;inscrire
                </button>
              </div>
            </form>
            <p>
              <Link
                href="/"
                className="font-medium text-blue-500 underline text-sm"
              >
                J&apos;ai déjà un compte? Me connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
