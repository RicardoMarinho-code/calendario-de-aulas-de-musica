"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
      </svg>
    ),
  },
  {
    label: "Agenda",
    href: "/agenda",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: "Meus Alunos",
    href: "/alunos",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-gray-800 text-white relative overflow-hidden">
      {/* Logo */}
      <div className="relative z-10 flex h-16 items-center gap-3 px-6 border-b border-gray-700">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
          <span className="text-gray-900 font-black text-xl leading-none pt-0.5">A</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-white">Agenda Pro Music</span>
      </div>

      {/* Navegação */}
      <nav className="relative z-10 flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-300 relative overflow-hidden group
                ${isActive
                  ? "bg-amber-500/10 text-amber-500 shadow-[inset_0_0_15px_rgba(245,158,11,0.15)] border-l-4 border-l-amber-500"
                  : "text-gray-400 hover:bg-gray-800/80 hover:text-white border-l-4 border-l-transparent"
                }
              `}
            >
              <div className={`transition-all duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]' : 'group-hover:scale-110'}`}>
                {item.icon}
              </div>
              <span className={`tracking-wide ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              
              {/* Audio Equalizer Active Indicator */}
              {isActive && (
                <div className="flex items-end gap-[2px] h-3 ml-auto opacity-90">
                  <span className="w-1 bg-amber-500 rounded-t-[1px] animate-eq shadow-[0_0_5px_rgba(245,158,11,0.8)]" style={{ '--eq-duration': '0.9s' } as React.CSSProperties} />
                  <span className="w-1 bg-amber-500 rounded-t-[1px] animate-eq shadow-[0_0_5px_rgba(245,158,11,0.8)]" style={{ '--eq-duration': '1.2s' } as React.CSSProperties} />
                  <span className="w-1 bg-amber-500 rounded-t-[1px] animate-eq shadow-[0_0_5px_rgba(245,158,11,0.8)]" style={{ '--eq-duration': '0.8s' } as React.CSSProperties} />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer da Sidebar */}
      <div className="relative z-10 px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 w-full cursor-pointer hover:bg-gray-700/50 p-2 rounded-xl transition-colors">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold text-gray-900 shrink-0">
            B
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Prof. Bruno</p>
            <p className="text-xs text-amber-500/80 truncate font-medium">Plano Pro</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar Desktop - fixa */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile - overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden animate-slide-in">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
