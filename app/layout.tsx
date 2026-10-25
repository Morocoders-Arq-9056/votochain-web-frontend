import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ variable: "--font-display", subsets: ["latin"] });
const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VotaChain — Votación verificable",
  description:
    "Plataforma de votación verificable para comunidades. Solo los votos confirmados cuentan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-text-primary">
        {children}
      </body>
    </html>
  );
}
