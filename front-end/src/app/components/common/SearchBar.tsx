import React, { useState } from "react";
import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder: string;
  onSearch: (query: string) => void;
};

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white 
          placeholder-gray-400 focus:outline-none focus:border-neonGreen/50"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <button
        type="submit"
        className="absolute inset-y-2 right-2 px-4 bg-neonGreen text-dark rounded-md font-medium
          hover:bg-opacity-90 transition-colors disabled:opacity-50"
        disabled={!query.trim()}
      >
        Search
      </button>
    </form>
  );
}
