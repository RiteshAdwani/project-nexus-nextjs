"use client";

import { categoryFilters } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CategoriesBar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  // Get the currently selected category from URL parameters
  const selectedCategory = searchParams.get("category");

  // Combine "All" with other category filters
  const categories = ["All", ...categoryFilters];

  // Handle category selection
  const handleTags = (item: string) => {
    if (item === "All") {
      router.push(`${pathName}`); // Remove category filter
    } else {
      router.push(`${pathName}?category=${item}`); // Apply category filter
    }
  };

  return (
    <div className="flex justify-center w-full py-2 md:py-4 lg:py-6 shadow-sm rounded-md">
      <ul className="flex gap-4 overflow-y-auto px-4 ">
        {categories.map((category) => (
          <li key={category} className="flex-none my-2">
            <button
              type="button"
              onClick={() => handleTags(category)}
              className={`px-4 py-2 text-sm lg:text-md rounded-full shadow-md focus:outline-none transition-transform transform hover:scale-105 whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-[#6F38C5] text-white border-1"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesBar;
