"use client";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
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

      {/* Título da página */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-100">Agenda de Aulas</h1>
      </div>

      {/* Ações do topbar */}
      <div className="flex items-center gap-2">
        {/* Botão de notificações */}
        <button
          className="relative inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
          aria-label="Notificações"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md">
            3
          </span>
        </button>

        {/* Avatar do usuário */}
        <button
          className="inline-flex items-center justify-center rounded-full w-9 h-9 bg-amber-500/20 text-amber-500 font-semibold text-sm hover:bg-amber-500/30 transition-colors border border-amber-500/20"
          aria-label="Perfil"
        >
          E
        </button>
      </div>
    </header>
  );
}
