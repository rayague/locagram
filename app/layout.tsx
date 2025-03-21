import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Locagram - Trouvez la location idéale en un clic",
  description:
    "Locagram est la plateforme de référence pour trouver rapidement des locations, des chambres à louer et bien plus encore. Simplifiez vos recherches et trouvez la solution d'hébergement qui vous convient, que ce soit pour une nuit ou pour un long séjour, le tout en quelques clics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/locagram.jpg" type="image/jpg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
