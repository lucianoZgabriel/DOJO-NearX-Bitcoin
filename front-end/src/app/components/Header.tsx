import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-neonBlue to-neonGreen p-4">
      <div className="container mx-auto flex justify-center items-center">
        <h1 className="text-2xl font-bold">Bitcoin Explorer</h1>
        <nav className="absolute left-3">
          <Link href="/" className="text-white hover:underline">
            Início
          </Link>
        </nav>
      </div>
    </header>
  );
}
