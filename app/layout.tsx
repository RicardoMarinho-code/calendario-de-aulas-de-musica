import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Agenda Pro Music",
  description: "Sistema de agendamento de aulas de música",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} h-full antialiased font-sans dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#09090b] text-gray-100 selection:bg-amber-500/30 selection:text-amber-200">
        {/* Fundo "Studio Foam" / Radial Glow */}
        <div className="fixed inset-0 z-[-2] bg-[#09090b]">
           <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse-ring" style={{ animationDuration: '8s' }} />
           <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-amber-600/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse-ring" style={{ animationDuration: '12s' }} />
        </div>

        {/* Textura de Filme/Analógico (Granulado) */}
        <div className="bg-noise" />
        
        {children}
      </body>
    </html>
  );
}
