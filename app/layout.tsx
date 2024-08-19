import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Locagram Dashboard",
  description: "Locagram pour vos recherhes de logemements ou d'appartements"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/images/locagram.png" type="image" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
