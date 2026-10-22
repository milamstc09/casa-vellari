import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const titulo = Playfair_Display({ subsets: ["latin"], variable: "--font-titulo" });
const texto = DM_Sans({ subsets: ["latin"], variable: "--font-texto" });

export const metadata: Metadata = {
  title: "Casa Vellari | Cucina italiana",
  description: "Cucina italiana, con anima carioca. Ipanema, Rio de Janeiro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${texto.variable}`}>
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}