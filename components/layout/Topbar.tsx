"use client";

import { usePathname } from "next/navigation";

interface TopbarProps {
  onMenuClick: () => void;
}

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Visão Geral",
    subtitle: "Confira o resumo do seu estúdio hoje",
  },
  "/agenda": {
    title: "Agenda de Aulas",
    subtitle: "Navegue pela semana e gerencie seus horários",
  },
  "/alunos": {
    title: "Meus Alunos",
    subtitle: "Cadastre e acompanhe seus estudantes",
  },
  "/financeiro": {
    title: "Financeiro",
    subtitle: "Registre pagamentos e acompanhe seu faturamento",
  },
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  const meta = PAGE_META[pathname] ?? {
    title: "Agenda Pro Music",
    subtitle: "Bem-vindo ao seu studio",
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-700 bg-gray-800/80 backdrop-blur-md px-4 md:px-6 shadow-sm">
      {/* Botão menu hamburger - só no mobile */}
      <button
        onClick={onMenuClick}
        className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        aria-label="Abrir menu"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Título e subtítulo dinâmicos */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold text-white leading-tight truncate">{meta.title}</p>
        <p className="text-xs text-gray-400 font-medium truncate hidden sm:block">{meta.subtitle}</p>
      </div>

      {/* Ações do topbar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Avatar do usuário */}
        <div className="flex items-center gap-2.5 bg-gray-700/50 hover:bg-gray-700 transition-colors rounded-xl px-3 py-1.5 cursor-pointer border border-gray-600/50">
          <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-xs font-black text-gray-900 shrink-0">
            B
          </div>
          <span className="text-sm font-semibold text-gray-200 hidden sm:block">Prof. Bruno</span>
        </div>
      </div>
    </header>
  );
}
