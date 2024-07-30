import { Button } from "@/components/ui/button";
import Link from "next/link";
import HamburgerMenu from "@/components/shared/HamburgerMenu";
import { Crimson_Pro } from "next/font/google";
import { cn } from "@/lib/utils";
import { UserButton } from "@/components/shared/UserButton";
import SearchInput from "./SearchInput";

const font = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400"],
});

const Navbar = () => {
  return (
    <nav className="bg-[#6F38C5] flex items-center justify-between p-2 md:px-4 md:py-2 lg:px-8 lg:py-6 w-full shadow-sm h-[70px] lg:h-auto fixed top-0 z-10">
      {/* Hamburger Menu for small screens */}
      <HamburgerMenu />

      {/* Navigation links for medium and larger screens */}
      <div className="hidden md:flex md:gap-x-2 lg:gap-x-6 items-center ">
        <Link href="/projects" className="text-white">
          <Button variant="ghost" className="text-md lg:text-lg px-1 lg:px-2">
            Projects
          </Button>
        </Link>

        <Link href="/share-work" className="text-white ">
          <Button variant="ghost" className="text-md lg:text-lg px-1 lg:px-2">
            Share Work
          </Button>
        </Link>

        <Link href="/profile" className="text-white">
          <Button variant="ghost" className="text-md lg:text-lg px-1 lg:px-2">
            Profile
          </Button>
        </Link>
      </div>

      {/* Logo name */}
      <Link
        href="/projects"
        className={cn(
          "text-2xl md:text-3xl lg:text-4xl font-semibold text-white md:mx-6 mb-1",
          font.className
        )}
      >
        Project Nexus
      </Link>

      {/* Search input and user button */}
      <div className="flex gap-x-2 md:gap-x-8">
        <SearchInput />
        <UserButton />
      </div>
    </nav>
  );
};

export default Navbar;
