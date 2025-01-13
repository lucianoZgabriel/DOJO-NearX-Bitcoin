"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex gap-4">
      <Link
        href="/"
        className={`${
          isActive("/")
            ? "text-primary font-medium"
            : "text-white hover:text-primary"
        }`}
      >
        Explorador
      </Link>
      <Link
        href="/carteiras"
        className={`${
          isActive("/carteiras")
            ? "text-primary font-medium"
            : "text-white hover:text-primary"
        }`}
      >
        Carteiras
      </Link>
      <Link
        href="/status"
        className={`${
          isActive("/status")
            ? "text-primary font-medium"
            : "text-white hover:text-primary"
        }`}
      >
        Status
      </Link>
      <Link
        href="/mine"
        className={`${
          isActive("/mine")
            ? "text-primary font-medium"
            : "text-white hover:text-primary"
        }`}
      >
        Mine Blocks
      </Link>
    </nav>
  );
}
