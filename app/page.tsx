import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-5 lg:p-24 md:p-16 sm:p-8 bg-green-300">
      <div className="flex flex-col md:flex-row w-full h-full rounded-2xl bg-white shadow-xl">
        <div className="relative w-full hidden h-[300px] lg:h-auto lg:block  lg:w-1/2">
          <Image
            src="/images/town.jpg"
            layout="fill"
            alt="Image"
            objectFit="cover"
            className="rounded-tl-2xl md:rounded-bl-2xl"
          />
        </div>

        <div className="flex flex-col justify-center w-full p-10 lg:w-1/2">
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Connexion
          </p>
          <p className="mb-2.5 mt-2.5 font-normal text-zinc-950 dark:text-zinc-400">
            Entrer votre email et votre mot de passe pour vous connecter!
          </p>
          <div className="relative my-4">
            <div className="relative flex items-center py-1">
              <div className="grow border-t border-zinc-200 dark:border-zinc-700"></div>
              <div className="grow border-t border-zinc-200 dark:border-zinc-700"></div>
            </div>
          </div>
          <div>
            <form className="mb-4">
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <label
                    className="text-zinc-950 dark:text-white"
                    htmlFor="email"
                  >
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
                  <label
                    className="text-zinc-950 mt-2 dark:text-white"
                    htmlFor="password"
                  >
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
                <button
                  className="whitespace-nowrap ring-offset-background bg-green-500 text-white text-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-white-foreground hover:bg-green-700 mt-2 flex h-[unset] w-full items-center justify-center rounded-lg px-4 py-4 text-sm font-medium"
                  type="submit"
                >
                  Se connecter
                </button>
              </div>
            </form>
            <p>
              <Link
                href="/dashboard/signin/forgot_password"
                className="font-medium text-blue-500 underline dark:text-white text-sm"
              >
                Mot de passe oublié?
              </Link>
            </p>
            <p>
              <Link
                href="/inscription"
                className="font-medium text-blue-500 underline dark:text-white text-sm"
              >
                Je n&apos;ai pas de compte? M&apos;inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
