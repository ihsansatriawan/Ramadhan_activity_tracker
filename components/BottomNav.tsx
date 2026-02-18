"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  activeColor: string;
  hoverColor: string;
}

const navItems: NavItem[] = [
  { href: "/", icon: "home", label: "Home", activeColor: "bg-bauhaus-red text-white", hoverColor: "hover:bg-bauhaus-red hover:text-white" },
  { href: "#", icon: "book_2", label: "Jurnal", activeColor: "bg-bauhaus-blue text-white", hoverColor: "hover:bg-bauhaus-blue hover:text-white" },
  { href: "#", icon: "leaderboard", label: "Klasemen", activeColor: "bg-bauhaus-yellow text-black", hoverColor: "hover:bg-bauhaus-yellow hover:text-black" },
  { href: "#", icon: "person", label: "Profil", activeColor: "bg-black text-white", hoverColor: "hover:bg-black hover:text-white" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-t-4 border-black p-0 grid grid-cols-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.icon}
            href={item.href}
            className={`flex flex-col items-center justify-center py-4 border-r-2 border-black last:border-r-0 transition-colors h-full
              ${isActive ? item.activeColor : `text-black ${item.hoverColor}`}`}
            aria-label={item.label}
          >
            <span className="material-symbols-outlined text-3xl">{item.icon}</span>
          </Link>
        );
      })}
    </nav>
  );
}
