"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, Activity, Blocks, Search } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      href: "/",
      label: "Explorer",
      icon: <Search size={18} />,
    },
    {
      href: "/carteiras",
      label: "Wallets",
      icon: <Wallet size={18} />,
    },
    {
      href: "/status",
      label: "Status",
      icon: <Activity size={18} />,
    },
    {
      href: "/mine",
      label: "Mine Blocks",
      icon: <Blocks size={18} />,
    },
  ];

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
            ${
              isActive(item.href)
                ? "bg-white/10 text-neonGreen font-medium border border-neonGreen/20"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }
          `}
        >
          <span
            className={`
            ${isActive(item.href) ? "text-neonGreen" : "text-gray-400"}
          `}
          >
            {item.icon}
          </span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
