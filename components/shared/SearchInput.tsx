"use client";

import { FaSearch } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { useRouter } from "next/navigation";

const SearchInput = () => {
  const router = useRouter();
  // Create a ref for the input element
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle the Enter key press event
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      const searchTerm = inputRef.current.value;
      // Navigate to the projects page with the search term as a query parameter
      router.push(`/projects?search=${searchTerm}`);
    }
  };

  return (
    <div className="relative flex items-center w-24 md:w-40 lg:w-auto">
      {/* Search icon */}
      <span className="absolute left-3 text-gray-700">
        <FaSearch />
      </span>
      {/* Search input field */}
      <Input
        ref={inputRef}
        onKeyDown={handleKeyDown}
        placeholder="Search projects"
        aria-label="Search projects"
        className="pl-8 md:pl-10 rounded-3xl"
      />
    </div>
  );
};

export default SearchInput;
